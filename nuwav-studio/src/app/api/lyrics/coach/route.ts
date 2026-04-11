import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai/claude";
import { checkUserRateLimit } from "@/lib/ratelimit/upstash";

interface CoachResponse {
  rhymeScheme: string;
  weakLines: string[];
  suggestions: string[];
  overallScore: number;
  flowNotes: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkUserRateLimit(session.user.id, "lyrics-coach", 10, 3600);
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

  let lyrics: string;
  let genre: string | undefined;

  try {
    const body = (await request.json()) as {
      lyrics?: string;
      genre?: string;
    };
    lyrics = body.lyrics?.trim() ?? "";
    genre = body.genre?.trim() || undefined;
    if (!lyrics) throw new Error("lyrics is required");
    if (lyrics.length > 5000) throw new Error("lyrics must be 5000 characters or fewer");
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }

  const systemPrompt = `You are a professional lyric coach with decades of experience in songwriting across all genres. Analyze the provided lyrics and return a JSON object with exactly these fields:
- rhymeScheme: string — describe the overall rhyme scheme (e.g. "ABAB across verses, AABB in chorus")
- weakLines: string[] — list of specific lines that feel weak, clichéd, or could be stronger (quote the line exactly)
- suggestions: string[] — concrete, actionable suggestions to improve the lyrics (be specific)
- overallScore: number — an integer from 1 to 10 rating the overall quality of the lyrics
- flowNotes: string — observations about rhythmic flow, syllable density, singability, and pacing`;

  const userPrompt = `${genre ? `Genre: ${genre}\n\n` : ""}Lyrics to analyze:\n\n${lyrics}`;

  try {
    const result = await generateJSON<CoachResponse>({
      prompt: userPrompt,
      systemPrompt,
      maxTokens: 1000,
      temperature: 0.5,
    });

    // Validate shape
    if (
      typeof result.rhymeScheme !== "string" ||
      !Array.isArray(result.weakLines) ||
      !Array.isArray(result.suggestions) ||
      typeof result.overallScore !== "number" ||
      typeof result.flowNotes !== "string"
    ) {
      throw new Error("AI returned unexpected shape");
    }

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
