import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lyrics } from "@/lib/db/schema";
import { generateText } from "@/lib/ai/claude";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let prompt: string;
  let structure: string | undefined;
  let mood: string | undefined;
  let existingLyrics: string | undefined;
  let lessonId: string | undefined;
  let projectId: string | undefined;

  try {
    const body = (await request.json()) as {
      prompt?: string;
      structure?: string;
      mood?: string;
      existingLyrics?: string;
      lessonId?: string;
      projectId?: string;
    };

    prompt = body.prompt?.trim() ?? "";
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

  const systemPrompt = `You are a professional songwriter. Write compelling, authentic lyrics based on the user's instructions.
Rules:
- Use section markers like [Verse 1], [Chorus], [Bridge], [Outro]
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
