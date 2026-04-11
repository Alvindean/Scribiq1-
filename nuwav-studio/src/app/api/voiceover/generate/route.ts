import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadToR2 } from "@/lib/media/r2";
import { checkUserRateLimit } from "@/lib/ratelimit/upstash";

/**
 * POST /api/voiceover/generate
 * Body: { lessonId: string; voiceId: string; text?: string }
 *
 * Generates a voiceover via ElevenLabs TTS, uploads the audio to R2, and
 * persists the resulting URL on the lesson row.
 */
export async function POST(request: NextRequest): Promise<Response> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. Rate limit: 10 requests per hour
  const rl = await checkUserRateLimit(userId, "voiceover-generate", 10, 3600);
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

  // 3. Parse body
  let lessonId: string;
  let voiceId: string;
  let textOverride: string | undefined;

  try {
    const body = (await request.json()) as {
      lessonId: string;
      voiceId: string;
      text?: string;
    };
    lessonId = body.lessonId;
    voiceId = body.voiceId;
    textOverride = body.text;

    if (!lessonId || !voiceId) throw new Error("Missing required fields");
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // 4. Fetch lesson + project for orgId
  const [lesson] = await db
    .select({
      id: lessons.id,
      script: lessons.script,
      projectId: lessons.projectId,
    })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  const [project] = await db
    .select({ id: projects.id, orgId: projects.orgId })
    .from(projects)
    .where(eq(projects.id, lesson.projectId))
    .limit(1);

  const orgId = project?.orgId ?? "shared";

  // 5. Determine text to synthesize
  let rawText = textOverride ?? lesson.script ?? "";

  // Strip section markers like [SCENE: ...], [SLIDE: ...]
  const cleanText = rawText.replace(/\[[^\]]*\]/g, "").trim();

  if (!cleanText) {
    return Response.json(
      { error: "No script content to synthesize" },
      { status: 400 }
    );
  }

  // 6. Validate text length (ElevenLabs free tier limit)
  if (cleanText.length > 5000) {
    return Response.json(
      { error: "Script exceeds maximum length of 5000 characters" },
      { status: 400 }
    );
  }

  // 7. Call ElevenLabs TTS API
  const elevenRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: "eleven_turbo_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  // 8. Handle ElevenLabs errors
  if (!elevenRes.ok) {
    const errText = await elevenRes.text().catch(() => elevenRes.statusText);
    return Response.json(
      { error: `ElevenLabs error: ${errText}` },
      { status: 502 }
    );
  }

  // 9. Get audio buffer
  const audioBuffer = Buffer.from(await elevenRes.arrayBuffer());

  // 10. Upload to R2: <orgId>/<projectId>/voiceovers/<lessonId>-<timestamp>.mp3
  const timestamp = Date.now();
  const key = `${orgId}/${lesson.projectId}/voiceovers/${lessonId}-${timestamp}.mp3`;

  const voiceoverUrl = await uploadToR2({
    key,
    body: audioBuffer,
    contentType: "audio/mpeg",
    metadata: { lessonId, userId },
  });

  // 11. Persist voiceover URL on the lesson
  await db
    .update(lessons)
    .set({ voiceoverUrl, status: "voiced", updatedAt: new Date() })
    .where(eq(lessons.id, lessonId));

  // 12. Return result
  return Response.json({ lessonId, voiceoverUrl }, { status: 200 });
}
