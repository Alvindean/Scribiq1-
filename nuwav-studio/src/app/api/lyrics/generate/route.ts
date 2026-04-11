import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lyrics } from "@/lib/db/schema";
import { generateText } from "@/lib/ai/claude";
import { checkUserRateLimit } from "@/lib/ratelimit/upstash";

// Per-genre structural guidance injected into the system prompt
const GENRE_PROMPTS: Record<string, { structure: string; style: string; rhyme: string }> = {
  pop: {
    structure:
      "[Intro] (optional) → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → [Bridge] → [Chorus] → [Outro]",
    style:
      "Catchy hooks, relatable themes, concise verses (4–8 lines), anthemic chorus repeated 3–4×. Radio-friendly phrasing.",
    rhyme: "ABAB or AABB couplets. Melodic, singable lines.",
  },
  "hip-hop": {
    structure:
      "[Intro] (optional) → [Verse 1] (16 bars) → [Hook] → [Verse 2] (16 bars) → [Hook] → [Verse 3] (16 bars, optional) → [Hook] → [Outro]",
    style:
      "Rhythmic flow, wordplay, internal rhymes, storytelling or braggadocio. Hooks are short and punchy (4–8 lines). Use [Hook] instead of [Chorus]. Count bars — 16 per verse.",
    rhyme:
      "Multi-syllabic end rhymes + internal rhymes. Bar-count discipline matters.",
  },
  "r&b": {
    structure:
      "[Intro] → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → [Bridge] → [Chorus] → [Vamp/Outro]",
    style:
      "Smooth, sensual, emotionally expressive. Runs and ad-libs welcome in the chorus. Verses build narrative; chorus delivers the emotional payoff. Vamp/Outro uses repeated affirmations.",
    rhyme:
      "ABAB with smooth, conversational lines. Allow melisma-friendly open vowels.",
  },
  country: {
    structure:
      "[Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Bridge] → [Chorus] → [Outro]",
    style:
      "Storytelling-first, vivid imagery — trucks, small towns, love, heartbreak, family. Plain-spoken but emotionally resonant. Chorus summarizes the story's emotional core.",
    rhyme: "AABB or ABAB. Each verse advances the narrative arc.",
  },
  rock: {
    structure:
      "[Intro] → [Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Guitar Solo] (mark as instrumental note) → [Bridge] → [Chorus] → [Outro]",
    style:
      "Raw energy, attitude, rebellion or passion. Chorus should be anthemic and screamed-back-able. Mark instrumental sections with a note in brackets.",
    rhyme: "ABAB or ABCB. Punchy, driving language with short punchy lines.",
  },
  edm: {
    structure:
      "[Intro] → [Verse 1] → [Build-Up] → [Drop] → [Verse 2] → [Build-Up] → [Drop] → [Breakdown] → [Build-Up] → [Drop] → [Outro]",
    style:
      "Minimalist lyrics focused on the Drop and Hook. Repeating chant-like phrases over the drop. Verses are sparse — they build tension for the drop. Drops often repeat a single memorable hook phrase.",
    rhyme:
      "Simple, repetitive, chant-friendly. Open vowels for crowd singalongs.",
  },
  blues: {
    structure:
      "[Verse 1] → [Verse 2] → [Verse 3] (each verse follows 12-bar AAB structure)",
    style:
      "Classic 12-bar blues — each verse: first line stated, second line repeats with slight variation, third line resolves. Raw, honest emotion — hardship, loss, longing, resilience.",
    rhyme:
      "AAB per verse (lines 1 & 2 rhyme or repeat, line 3 resolves). Keep it raw and conversational.",
  },
  jazz: {
    structure:
      "[Intro] → [Head (Theme)] → [Verse A] → [Verse A] → [Bridge (B)] → [Verse A] → [Outro]",
    style:
      "AABA 32-bar form. Sophisticated vocabulary, metaphor, understated emotion. Swing feel — lyrics should read like spoken word, not pop song. Subtext over direct statement.",
    rhyme:
      "Loose, conversational AABA rhyme scheme mirroring the musical form. Allow near-rhymes.",
  },
  folk: {
    structure:
      "[Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Verse 3] → [Chorus] → [Outro]",
    style:
      "Narrative-driven storytelling. 3–5 verses tell a complete arc. Acoustic, intimate, first-person. Let the story breathe — don't rush to the chorus. Each verse must advance the plot.",
    rhyme:
      "ABCB or ABAB ballad meter. Conversational, plain-spoken phrasing.",
  },
  gospel: {
    structure:
      "[Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Bridge / Call-and-Response] → [Vamp] → [Outro]",
    style:
      "Praise, worship, testimony. Repetition is power — vamp sections use repeated affirmations and ad-libs. Joyful, uplifting, or devotional. Call-and-response patterns welcome.",
    rhyme: "AABB or ABAB with singable open vowels. Repeating refrains in vamp.",
  },
  reggae: {
    structure:
      "[Intro] → [Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Bridge] → [Chorus] → [Outro]",
    style:
      "Laid-back rhythmic flow, positive themes — unity, love, social justice, spirituality. One-drop rhythm implied in the cadence. Offbeat phrasing emphasis. Warm, conversational delivery.",
    rhyme: "AABB or ABAB. Chorus delivers the message; verses tell the story.",
  },
};

/**
 * Normalise a free-text or dropdown genre value to one of our GENRE_PROMPTS keys.
 * Returns null if no match — the system prompt will stay generic.
 */
function resolveGenreKey(genre: string): string | null {
  const g = genre.toLowerCase();
  if (g.includes("hip") || g.includes("rap") || g.includes("trap")) return "hip-hop";
  if (g.includes("r&b") || g.includes("rnb") || g.includes("soul") || g.includes("rhythm")) return "r&b";
  if (g.includes("country") || g.includes("western") || g.includes("bluegrass")) return "country";
  if (g.includes("rock") || g.includes("alternative") || g.includes("metal") || g.includes("punk") || g.includes("grunge") || g.includes("indie rock")) return "rock";
  if (g.includes("edm") || g.includes("electronic") || g.includes("house") || g.includes("techno") || g.includes("trance") || g.includes("dance")) return "edm";
  if (g.includes("blues")) return "blues";
  if (g.includes("jazz")) return "jazz";
  if (g.includes("folk") || g.includes("acoustic") || g.includes("singer-songwriter") || g.includes("americana")) return "folk";
  if (g.includes("gospel") || g.includes("worship") || g.includes("christian") || g.includes("spiritual")) return "gospel";
  if (g.includes("reggae") || g.includes("ska") || g.includes("dancehall") || g.includes("dub")) return "reggae";
  if (g.includes("pop")) return "pop";
  return null;
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkUserRateLimit(session.user.id, "lyrics-generate", 20, 3600);
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

  let prompt: string;
  let genre: string | undefined;
  let structure: string | undefined;
  let mood: string | undefined;
  let existingLyrics: string | undefined;
  let lessonId: string | undefined;
  let projectId: string | undefined;

  try {
    const body = (await request.json()) as {
      prompt?: string;
      genre?: string;
      structure?: string;
      mood?: string;
      existingLyrics?: string;
      lessonId?: string;
      projectId?: string;
    };

    prompt = body.prompt?.trim() ?? "";
    genre = body.genre?.trim() || undefined;
    structure = body.structure?.trim() || undefined;
    mood = body.mood?.trim() || undefined;
    existingLyrics = body.existingLyrics?.trim() || undefined;
    lessonId = body.lessonId?.trim() || undefined;
    projectId = body.projectId?.trim() || undefined;

    if (!prompt) throw new Error("prompt is required");
    if (prompt.length > 500) throw new Error("prompt must be 500 characters or fewer");
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }

  // Build genre-specific guidance block
  const genreKey = genre ? resolveGenreKey(genre) : null;
  const genreGuide = genreKey ? GENRE_PROMPTS[genreKey] : null;
  const genreBlock = genreGuide
    ? `\nGENRE: ${genreKey!.toUpperCase()}
Structure: ${genreGuide.structure}
Style: ${genreGuide.style}
Rhyme scheme: ${genreGuide.rhyme}\n`
    : "";

  const systemPrompt = `You are a professional songwriter. Write compelling, authentic lyrics based on the user's instructions.
${genreBlock}Rules:
- Follow the genre structure above if provided; otherwise use [Verse 1], [Chorus], [Bridge], [Outro] markers
- Match the emotional tone and style requested
- Keep lyrics natural and singable — avoid clichés
- Return ONLY the lyrics, no explanation, no markdown fences`;

  const userPromptParts: string[] = [`PROMPT:\n${prompt}`];
  if (structure) userPromptParts.push(`STRUCTURE:\n${structure}`);
  if (mood) userPromptParts.push(`MOOD / TONE:\n${mood}`);
  if (existingLyrics) userPromptParts.push(`EXISTING LYRICS (continue or build upon these):\n${existingLyrics}`);
  userPromptParts.push("Write the lyrics now.");

  const userPrompt = userPromptParts.join("\n\n");

  try {
    const text = await generateText({
      prompt: userPrompt,
      systemPrompt,
      maxTokens: 1500,
      temperature: 0.8,
    });

    const rewritten = text.trim();

    // Optionally persist to lyrics table if both lessonId and projectId are provided
    let lyricId: string | undefined;
    if (lessonId && projectId) {
      const [inserted] = await db
        .insert(lyrics)
        .values({
          projectId,
          lessonId,
          content: rewritten,
          source: "ai",
          aiPrompt: prompt,
        })
        .returning({ id: lyrics.id });
      lyricId = inserted.id;
    }

    return Response.json({ lyrics: rewritten, ...(lyricId ? { lyricId } : {}) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
