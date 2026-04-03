import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  let lessonId: string;
  let compositionId: string;

  try {
    const body = (await request.json()) as {
      lessonId: string;
      compositionId: string;
    };
    lessonId = body.lessonId;
    compositionId = body.compositionId;

    if (!lessonId || !compositionId) throw new Error("Missing required fields");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Verify lesson access (RLS handles authorization)
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("id, project_id")
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return new Response(JSON.stringify({ error: "Lesson not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create render job record
    const { data: renderJob, error: jobError } = await supabase
      .from("render_jobs")
      .insert({
        lesson_id: lessonId,
        project_id: lesson.project_id,
        composition_id: compositionId,
        status: "queued",
      })
      .select("id")
      .single();

    if (jobError || !renderJob) {
      throw new Error("Failed to create render job");
    }

    // In a production implementation, this would trigger a Remotion Lambda render:
    // await triggerRemotion Lambda({ renderId: renderJob.id, compositionId, lessonId })

    return new Response(JSON.stringify({ jobId: renderJob.id }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
