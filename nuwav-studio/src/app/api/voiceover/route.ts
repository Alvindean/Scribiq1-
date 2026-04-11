import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateVoiceover } from "@/lib/elevenlabs/tts";
import { uploadToR2, buildR2Key } from "@/lib/media/r2";
import { checkUserRateLimit } from "@/lib/ratelimit/upstash";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rl = await checkUserRateLimit(session.user.id, "voiceover", 10, 3600);
  if (!rl.success) {
    return Response.json(
      { error: "Rate limit exceeded. Try again shortly." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  }

  let lessonId: string;
  let text: string;
  let voiceId: string | undefined;

  try {
    const body = (await request.json()) as {
      lessonId: string;
      text: string;
      voiceId?: string;
    };
    lessonId = body.lessonId;
    text = body.text;
    voiceId = body.voiceId;

    if (!lessonId || !text) throw new Error("Missing required fields");
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

    const { audioBuffer, contentType } = await generateVoiceover({
      text,
      voiceId,
    });

    const key = buildR2Key(
      "shared",
      lesson.projectId,
      "audio",
      `${lessonId}-voiceover.mp3`
    );

    const url = await uploadToR2({
      key,
      body: audioBuffer,
      contentType,
      metadata: { lessonId, userId: session.user.id },
    });

    await db
      .update(lessons)
      .set({ voiceoverUrl: url, status: "voiced" })
      .where(eq(lessons.id, lessonId));

    return new Response(JSON.stringify({ url }), {
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
