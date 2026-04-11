import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, exports, modules, lessons } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import JSZip from "jszip";
import PptxGenJS from "pptxgenjs";
import { uploadToR2, buildR2Key } from "@/lib/media/r2";

type ExportFormat = "mp4" | "pdf" | "pptx" | "scorm" | "zip";

/** Sanitise a string so it's safe to use as a file/folder name */
function safeName(name: string): string {
  return name
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return new Response(JSON.stringify({ error: "Missing projectId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const exportList = await db
    .select()
    .from(exports)
    .where(eq(exports.projectId, projectId))
    .orderBy(desc(exports.createdAt));

  const mapped = exportList.map((e) => ({
    id: e.id,
    format: e.format,
    status: e.status,
    url: e.url,
    created_at: e.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  return Response.json({ exports: mapped });
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let projectId: string;
  let format: ExportFormat;

  try {
    const body = (await request.json()) as {
      projectId: string;
      format: ExportFormat;
    };
    projectId = body.projectId;
    format = body.format;

    if (!projectId || !format) throw new Error("Missing required fields");

    const validFormats: ExportFormat[] = ["mp4", "pdf", "pptx", "scorm", "zip"];
    if (!validFormats.includes(format)) {
      throw new Error(`Invalid format. Must be one of: ${validFormats.join(", ")}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request body";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ------------------------------------------------------------------ //
  // Formats that require async video rendering — queue and return early  //
  // ------------------------------------------------------------------ //
  if (format === "mp4") {
    try {
      const [project] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!project) {
        return new Response(JSON.stringify({ error: "Project not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const [exportRecord] = await db
        .insert(exports)
        .values({
          projectId,
          format,
          status: "pending",
        })
        .returning({ id: exports.id });

      if (!exportRecord) throw new Error("Failed to create export record");

      return new Response(
        JSON.stringify({
          exportId: exportRecord.id,
          message:
            "Video rendering requires manual processing — check back later.",
        }),
        {
          status: 202,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Internal server error";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ------------------------------------------------------------------ //
  // PPTX — synchronous slide-deck export using pptxgenjs                //
  // ------------------------------------------------------------------ //
  if (format === "pptx") {
    try {
      // 1. Fetch project + modules + lessons
      const [projectRow] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!projectRow) {
        return new Response(JSON.stringify({ error: "Project not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const moduleRows = await db
        .select()
        .from(modules)
        .where(eq(modules.projectId, projectId))
        .orderBy(asc(modules.order));

      const lessonRows = await db
        .select()
        .from(lessons)
        .where(eq(lessons.projectId, projectId))
        .orderBy(asc(lessons.order));

      // Create export record in "processing" state
      const [exportRecord] = await db
        .insert(exports)
        .values({ projectId, format, status: "processing" })
        .returning({ id: exports.id });

      if (!exportRecord) throw new Error("Failed to create export record");

      // 2. Build the presentation
      const BG_DARK    = "18181b"; // zinc-900
      const BG_DARKER  = "09090b"; // zinc-950
      const VIOLET     = "7c3aed"; // violet-600
      const VIOLET_LT  = "a78bfa"; // violet-400  — accent text
      const WHITE      = "FFFFFF";
      const GRAY_400   = "a1a1aa"; // zinc-400
      const SLIDE_W    = 10;       // inches  (LAYOUT_WIDE)
      const SLIDE_H    = 5.625;

      // Utility: split script text into bullet chunks (max 6 per slide)
      const MAX_BULLETS = 6;
      function scriptToBullets(script: string): string[][] {
        const raw = script.trim();
        if (!raw) return [["(No script content)"]];
        // Split at sentence boundaries: period / exclamation / question followed by space or EOL
        const sentences = raw
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
        const chunks: string[][] = [];
        for (let i = 0; i < sentences.length; i += MAX_BULLETS) {
          chunks.push(sentences.slice(i, i + MAX_BULLETS));
        }
        return chunks.length ? chunks : [["(No script content)"]];
      }

      const pptx = new PptxGenJS();
      pptx.layout   = "LAYOUT_WIDE";
      pptx.title    = projectRow.title;
      pptx.subject  = projectRow.niche ?? "Course";
      pptx.author   = "Nuwav Studio";
      pptx.company  = "Nuwav";

      // ── Slide 1: Title slide ──────────────────────────────────────── //
      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: BG_DARKER };

      // Violet accent bar on left edge
      titleSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.18, h: SLIDE_H,
        fill: { color: VIOLET },
        line: { type: "none", color: VIOLET, pt: 0 },
      });

      // Gradient overlay rectangle (simulated with a semi-transparent rect)
      titleSlide.addShape(pptx.ShapeType.rect, {
        x: 0.18, y: 0, w: SLIDE_W - 0.18, h: SLIDE_H,
        fill: { color: BG_DARKER, transparency: 0 },
        line: { type: "none", color: BG_DARKER, pt: 0 },
      });

      // Course title
      titleSlide.addText(projectRow.title, {
        x: 0.6, y: 1.6, w: SLIDE_W - 1.2, h: 1.2,
        fontSize: 44,
        bold: true,
        color: WHITE,
        align: "left",
        fontFace: "Calibri",
      });

      // Description / subtitle
      if (projectRow.niche || projectRow.targetAudience) {
        const subtitle = [projectRow.niche, projectRow.targetAudience]
          .filter(Boolean)
          .join("  ·  ");
        titleSlide.addText(subtitle, {
          x: 0.6, y: 2.95, w: SLIDE_W - 1.2, h: 0.5,
          fontSize: 18,
          color: VIOLET_LT,
          align: "left",
          fontFace: "Calibri",
        });
      }

      // Tone / meta line
      titleSlide.addText(
        `Tone: ${projectRow.tone}   ·   Type: ${projectRow.type}`,
        {
          x: 0.6, y: 3.6, w: SLIDE_W - 1.2, h: 0.4,
          fontSize: 13,
          color: GRAY_400,
          align: "left",
          fontFace: "Calibri",
        }
      );

      // Bottom violet accent line
      titleSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: SLIDE_H - 0.08, w: SLIDE_W, h: 0.08,
        fill: { color: VIOLET },
        line: { type: "none", color: VIOLET, pt: 0 },
      });

      // ── Per-module and per-lesson slides ─────────────────────────── //
      for (const mod of moduleRows) {
        const modLessons = lessonRows.filter((l) => l.moduleId === mod.id);
        const modNum     = mod.order + 1;

        // Section divider slide
        const dividerSlide = pptx.addSlide();
        dividerSlide.background = { color: BG_DARKER };

        // Full-width violet top bar
        dividerSlide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: SLIDE_W, h: 0.12,
          fill: { color: VIOLET },
          line: { type: "none", color: VIOLET, pt: 0 },
        });

        // Module number badge
        dividerSlide.addText(`MODULE ${modNum}`, {
          x: 0.6, y: 1.7, w: 3, h: 0.55,
          fontSize: 13,
          bold: true,
          color: VIOLET_LT,
          align: "left",
          fontFace: "Calibri",
          charSpacing: 4,
        });

        // Module title
        dividerSlide.addText(mod.title, {
          x: 0.6, y: 2.3, w: SLIDE_W - 1.2, h: 1.2,
          fontSize: 38,
          bold: true,
          color: WHITE,
          align: "left",
          fontFace: "Calibri",
        });

        // Lesson count
        dividerSlide.addText(
          `${modLessons.length} lesson${modLessons.length !== 1 ? "s" : ""}`,
          {
            x: 0.6, y: 3.6, w: 4, h: 0.4,
            fontSize: 13,
            color: GRAY_400,
            align: "left",
            fontFace: "Calibri",
          }
        );

        // Bottom accent line
        dividerSlide.addShape(pptx.ShapeType.rect, {
          x: 0, y: SLIDE_H - 0.08, w: SLIDE_W, h: 0.08,
          fill: { color: VIOLET },
          line: { type: "none", color: VIOLET, pt: 0 },
        });

        // Lesson content slides
        for (const lesson of modLessons) {
          const lessonNum = lesson.order + 1;
          const bulletGroups = scriptToBullets(lesson.script ?? "");

          for (let gi = 0; gi < bulletGroups.length; gi++) {
            const group      = bulletGroups[gi];
            const isOverflow = gi > 0;
            const contentSlide = pptx.addSlide();
            contentSlide.background = { color: BG_DARK };

            // Left violet accent strip
            contentSlide.addShape(pptx.ShapeType.rect, {
              x: 0, y: 0, w: 0.1, h: SLIDE_H,
              fill: { color: VIOLET },
              line: { type: "none", color: VIOLET, pt: 0 },
            });

            // Lesson title
            const titleSuffix = isOverflow ? ` (cont.)` : "";
            contentSlide.addText(`${lesson.title}${titleSuffix}`, {
              x: 0.3, y: 0.2, w: SLIDE_W - 0.6, h: 0.7,
              fontSize: 26,
              bold: true,
              color: WHITE,
              align: "left",
              fontFace: "Calibri",
            });

            // Separator line
            contentSlide.addShape(pptx.ShapeType.line, {
              x: 0.3, y: 0.95, w: SLIDE_W - 0.6, h: 0,
              line: { color: VIOLET, pt: 1.5 },
            });

            // Bullet points / paragraphs
            const bulletItems: PptxGenJS.TextProps[] = group.map((bullet) => ({
              text: `• ${bullet}`,
              options: {
                fontSize: 15,
                color: "e4e4e7", // zinc-200
                bullet: false,
                paraSpaceAfter: 6,
                fontFace: "Calibri",
              },
            }));

            contentSlide.addText(bulletItems, {
              x: 0.3, y: 1.1, w: SLIDE_W - 0.6, h: SLIDE_H - 1.7,
              valign: "top",
              fontFace: "Calibri",
            });

            // Footer bar
            contentSlide.addShape(pptx.ShapeType.rect, {
              x: 0, y: SLIDE_H - 0.38, w: SLIDE_W, h: 0.38,
              fill: { color: BG_DARKER },
              line: { type: "none", color: BG_DARKER, pt: 0 },
            });

            // Footer text: module name + lesson number
            contentSlide.addText(
              `${mod.title}   ·   Lesson ${lessonNum}`,
              {
                x: 0.3, y: SLIDE_H - 0.34, w: SLIDE_W - 0.6, h: 0.3,
                fontSize: 10,
                color: GRAY_400,
                align: "left",
                fontFace: "Calibri",
              }
            );
          }
        }
      }

      // ── Last slide: Thank You / outro ─────────────────────────────── //
      const outroSlide = pptx.addSlide();
      outroSlide.background = { color: BG_DARKER };

      // Full violet background accent
      outroSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: SLIDE_W, h: 0.12,
        fill: { color: VIOLET },
        line: { type: "none", color: VIOLET, pt: 0 },
      });

      outroSlide.addText("Thank You", {
        x: 0.6, y: 1.6, w: SLIDE_W - 1.2, h: 1.1,
        fontSize: 48,
        bold: true,
        color: WHITE,
        align: "center",
        fontFace: "Calibri",
      });

      outroSlide.addText(projectRow.title, {
        x: 0.6, y: 2.85, w: SLIDE_W - 1.2, h: 0.55,
        fontSize: 20,
        color: VIOLET_LT,
        align: "center",
        fontFace: "Calibri",
      });

      outroSlide.addText("Built with Nuwav Studio", {
        x: 0.6, y: 3.55, w: SLIDE_W - 1.2, h: 0.35,
        fontSize: 12,
        color: GRAY_400,
        align: "center",
        fontFace: "Calibri",
      });

      outroSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: SLIDE_H - 0.08, w: SLIDE_W, h: 0.08,
        fill: { color: VIOLET },
        line: { type: "none", color: VIOLET, pt: 0 },
      });

      // 4. Generate PPTX buffer
      const pptxBuffer = (await pptx.write({
        outputType: "nodebuffer",
      })) as Buffer;

      // 5. Upload to R2
      const ts       = Date.now();
      const filename = `${safeName(projectRow.title)}-${ts}.pptx`;
      const r2Key    = buildR2Key(
        projectRow.orgId,
        projectId,
        "export",
        filename
      );

      const fileUrl = await uploadToR2({
        key: r2Key,
        body: pptxBuffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        metadata: {
          projectId,
          format,
          exportId: exportRecord.id,
        },
      });

      // 6. Mark export as complete
      await db
        .update(exports)
        .set({ status: "complete", url: fileUrl })
        .where(eq(exports.id, exportRecord.id));

      // 7. Return response
      return new Response(
        JSON.stringify({
          exportId: exportRecord.id,
          status: "complete",
          url: fileUrl,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Internal server error";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ------------------------------------------------------------------ //
  // ZIP-based synchronous export (zip / pdf / scorm)                    //
  // ------------------------------------------------------------------ //
  try {
    // Fetch project with all modules and lessons in one go
    const [projectRow] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!projectRow) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const moduleRows = await db
      .select()
      .from(modules)
      .where(eq(modules.projectId, projectId))
      .orderBy(asc(modules.order));

    const lessonRows = await db
      .select()
      .from(lessons)
      .where(eq(lessons.projectId, projectId))
      .orderBy(asc(lessons.order));

    // Create export record in "processing" state while we build the ZIP
    const [exportRecord] = await db
      .insert(exports)
      .values({ projectId, format, status: "processing" })
      .returning({ id: exports.id });

    if (!exportRecord) throw new Error("Failed to create export record");

    // ---- Build the ZIP in-memory with JSZip ---- //
    const zip = new JSZip();

    // project.json — top-level project metadata
    zip.file(
      "project.json",
      JSON.stringify(
        {
          id: projectRow.id,
          title: projectRow.title,
          type: projectRow.type,
          niche: projectRow.niche ?? null,
          targetAudience: projectRow.targetAudience ?? null,
          tone: projectRow.tone,
          durationTarget: projectRow.durationTarget ?? null,
          status: projectRow.status,
          brandSettings: projectRow.brandSettings,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    // modules/ — one sub-folder per module
    for (const mod of moduleRows) {
      const modFolder = safeName(mod.title);
      const modLessons = lessonRows.filter((l) => l.moduleId === mod.id);

      // modules/[module-title]/metadata.json
      zip.file(
        `modules/${modFolder}/metadata.json`,
        JSON.stringify(
          {
            id: mod.id,
            title: mod.title,
            type: mod.type,
            order: mod.order,
          },
          null,
          2
        )
      );

      // modules/[module-title]/[lesson-title].txt — script content
      for (const lesson of modLessons) {
        const lessonFile = safeName(lesson.title);
        const scriptContent =
          lesson.script?.trim() ||
          `[No script yet for lesson: ${lesson.title}]`;

        zip.file(`modules/${modFolder}/${lessonFile}.txt`, scriptContent);
      }
    }

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    // Upload to R2
    const filename = `${safeName(projectRow.title)}-${Date.now()}.zip`;
    const r2Key = buildR2Key(
      projectRow.orgId,
      projectId,
      "export",
      filename
    );

    const fileUrl = await uploadToR2({
      key: r2Key,
      body: zipBuffer,
      contentType: "application/zip",
      metadata: {
        projectId,
        format,
        exportId: exportRecord.id,
      },
    });

    // Mark export as complete with the download URL
    await db
      .update(exports)
      .set({ status: "complete", url: fileUrl })
      .where(eq(exports.id, exportRecord.id));

    return new Response(
      JSON.stringify({
        exportId: exportRecord.id,
        status: "complete",
        url: fileUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
