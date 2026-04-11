import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, exports, modules, lessons } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import JSZip from "jszip";
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
  if (format === "mp4" || format === "pptx") {
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
