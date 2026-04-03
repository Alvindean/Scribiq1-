import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let projectId: string;
  try {
    const body = (await request.json()) as { projectId: string };
    projectId = body.projectId;
    if (!projectId) throw new Error("Missing projectId");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch the project, verifying org membership (RLS handles authorization)
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
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
          target_audience: project.target_audience ?? "general audience",
          tone: project.tone,
          duration_target: project.duration_target ?? undefined,
          type: project.type,
          template_structure: null,
        });

        send({
          step: "outline_done",
          message: "Outline generated. Creating modules…",
          progress: 20,
        });

        // Step 2 — Create modules
        const moduleInserts = outline.modules.map((mod, idx) => ({
          project_id: projectId,
          title: mod.title,
          order: idx,
          type: mod.type,
        }));

        const { data: createdModules, error: moduleError } = await supabase
          .from("modules")
          .insert(moduleInserts)
          .select("id, title");

        if (moduleError || !createdModules) {
          throw new Error("Failed to create modules");
        }

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

            // Insert lesson row
            const { data: createdLesson, error: lessonError } = await supabase
              .from("lessons")
              .insert({
                module_id: dbModule.id,
                project_id: projectId,
                title: lesson.title,
                order: lIdx,
                duration_seconds: lesson.duration_seconds,
                status: "draft",
              })
              .select("id")
              .single();

            if (lessonError || !createdLesson) {
              throw new Error(`Failed to create lesson: ${lesson.title}`);
            }

            // Generate script
            const script = await generateScript({
              lesson_title: lesson.title,
              key_points: lesson.key_points,
              tone: project.tone,
              target_audience: project.target_audience ?? "general audience",
              duration_seconds: lesson.duration_seconds,
              product_name: project.title,
              niche: project.niche ?? undefined,
            });

            // Save script to lesson
            await supabase
              .from("lessons")
              .update({ script, status: "scripted" })
              .eq("id", createdLesson.id);

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
        await supabase
          .from("projects")
          .update({ status: "review" })
          .eq("id", projectId);

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
