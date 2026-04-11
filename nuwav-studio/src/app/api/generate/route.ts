import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, modules, lessons, templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateOutline, generateScript } from "@/lib/ai/pipeline";

interface ProgressEvent {
  step: string;
  message: string;
  progress: number;
}

function encodeSSE(data: ProgressEvent): string {
  return `data: ${JSON.stringify(data)}\n\n`;
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
  let requestTemplateId: string | undefined;
  try {
    const body = (await request.json()) as { projectId: string; templateId?: string };
    projectId = body.projectId;
    requestTemplateId = body.templateId;
    if (!projectId) throw new Error("Missing projectId");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Resolve templateId: prefer the one sent in the request body, fall back to
  // the value stored on the project row itself.
  const resolvedTemplateId = requestTemplateId ?? project.templateId ?? null;

  let templateStructure: object | null = null;
  if (resolvedTemplateId) {
    const [template] = await db
      .select({ structure: templates.structure })
      .from(templates)
      .where(eq(templates.id, resolvedTemplateId))
      .limit(1);

    if (template?.structure && Object.keys(template.structure as object).length > 0) {
      templateStructure = template.structure as object;
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: ProgressEvent) => {
        controller.enqueue(new TextEncoder().encode(encodeSSE(event)));
      };

      try {
        // Step 1 — Generate outline
        send({ step: "outline", message: "Generating course outline…", progress: 5 });

        const outline = await generateOutline({
          niche: project.niche ?? "",
          product_name: project.title,
          target_audience: project.targetAudience ?? "general audience",
          tone: project.tone,
          duration_target: project.durationTarget ?? undefined,
          type: project.type,
          template_structure: templateStructure,
        });

        send({
          step: "outline_done",
          message: "Outline generated. Creating modules…",
          progress: 20,
        });

        // Step 2 — Create modules
        const createdModules = await db
          .insert(modules)
          .values(
            outline.modules.map((mod, idx) => ({
              projectId,
              title: mod.title,
              order: idx,
              type: mod.type,
            }))
          )
          .returning({ id: modules.id, title: modules.title });

        send({
          step: "modules_created",
          message: `Created ${createdModules.length} modules. Generating lessons…`,
          progress: 30,
        });

        // Step 3 — Create lessons and generate scripts
        const totalLessons = outline.modules.reduce(
          (sum, mod) => sum + mod.lessons.length,
          0
        );
        let completedLessons = 0;

        for (let mIdx = 0; mIdx < outline.modules.length; mIdx++) {
          const mod = outline.modules[mIdx];
          const dbModule = createdModules[mIdx];

          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const lesson = mod.lessons[lIdx];

            const [createdLesson] = await db
              .insert(lessons)
              .values({
                moduleId: dbModule.id,
                projectId,
                title: lesson.title,
                order: lIdx,
                durationSeconds: lesson.duration_seconds,
                status: "draft",
              })
              .returning({ id: lessons.id });

            if (!createdLesson) {
              throw new Error(`Failed to create lesson: ${lesson.title}`);
            }

            // Generate script
            const script = await generateScript({
              lesson_title: lesson.title,
              key_points: lesson.key_points,
              tone: project.tone,
              target_audience: project.targetAudience ?? "general audience",
              duration_seconds: lesson.duration_seconds,
              product_name: project.title,
              niche: project.niche ?? undefined,
            });

            await db
              .update(lessons)
              .set({ script, status: "scripted" })
              .where(eq(lessons.id, createdLesson.id));

            completedLessons++;
            const progress = 30 + Math.round((completedLessons / totalLessons) * 60);

            send({
              step: "lesson_scripted",
              message: `Scripted "${lesson.title}" (${completedLessons}/${totalLessons})`,
              progress,
            });
          }
        }

        // Step 4 — Mark project as ready for review
        await db
          .update(projects)
          .set({ status: "review" })
          .where(eq(projects.id, projectId));

        send({
          step: "complete",
          message: "Generation complete! Your course is ready for review.",
          progress: 100,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        send({ step: "error", message, progress: -1 });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
