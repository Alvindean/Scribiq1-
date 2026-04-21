import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id: lessonId } = await params;

  if (!lessonId) {
    return new Response(JSON.stringify({ error: "Lesson ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let script: string | undefined;
  let durationSeconds: number | undefined;

  try {
    const body = (await request.json()) as {
      script?: string;
      durationSeconds?: number;
    };
    script = body.script;
    durationSeconds = body.durationSeconds;

    if (script === undefined && durationSeconds === undefined) {
      throw new Error("At least one field required");
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body — provide script and/or durationSeconds" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const updates: { script?: string; durationSeconds?: number; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (script !== undefined) updates.script = script;
    if (durationSeconds !== undefined) updates.durationSeconds = durationSeconds;

    const result = await db
      .update(lessons)
      .set(updates)
      .where(eq(lessons.id, lessonId))
      .returning({ id: lessons.id });

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Lesson not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
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
