import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, renderJobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
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
    const [lesson] = await db
      .select({ id: lessons.id, projectId: lessons.projectId })
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      return new Response(JSON.stringify({ error: "Lesson not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [renderJob] = await db
      .insert(renderJobs)
      .values({
        lessonId,
        projectId: lesson.projectId,
        compositionId,
        status: "queued",
      })
      .returning({ id: renderJobs.id });

    if (!renderJob) {
      throw new Error("Failed to create render job");
    }

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
