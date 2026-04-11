import { auth } from "@/lib/auth";

const FALLBACK_VOICES = [
  { voice_id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", category: "premade" },
  { voice_id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", category: "premade" },
  { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", category: "premade" },
  { voice_id: "ErXwobaYiN019PkySvjV", name: "Antoni", category: "premade" },
];

/**
 * GET /api/voiceover/voices
 *
 * Returns available ElevenLabs voices. Falls back to a hardcoded list when
 * ELEVENLABS_API_KEY is not configured. Response is cached for 10 minutes.
 */
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // No API key — return fallback list immediately
  if (!process.env.ELEVENLABS_API_KEY) {
    return Response.json(
      { voices: FALLBACK_VOICES },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=600",
        },
      }
    );
  }

  // Fetch live voices from ElevenLabs
  const elevenRes = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
  });

  if (!elevenRes.ok) {
    // Degrade gracefully to fallback
    return Response.json(
      { voices: FALLBACK_VOICES },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=600",
        },
      }
    );
  }

  const data = (await elevenRes.json()) as {
    voices: Array<{
      voice_id: string;
      name: string;
      category: string;
      labels?: Record<string, string>;
    }>;
  };

  const voices = (data.voices ?? []).map(({ voice_id, name, category, labels }) => ({
    voice_id,
    name,
    category,
    labels,
  }));

  return Response.json(
    { voices },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=600",
      },
    }
  );
}
