import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateVoiceover } from "@/lib/elevenlabs/tts";
import { uploadToR2, buildR2Key } from "@/lib/media/r2";

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

    // Generate voiceover audio
    const { audioBuffer, contentType } = await generateVoiceover({
      text,
      voiceId,
    });

    // Upload to R2
    const key = buildR2Key(
      "shared",
      lesson.project_id,
      "audio",
      `${lessonId}-voiceover.mp3`
    );

    const url = await uploadToR2({
      key,
      body: audioBuffer,
      contentType,
      metadata: { lessonId, userId: user.id },
    });

    // Update lesson record
    await supabase
      .from("lessons")
      .update({ voiceover_url: url, status: "voiced" })
      .eq("id", lessonId);

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
