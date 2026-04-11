import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateText } from "@/lib/ai/claude";
import { checkUserRateLimit } from "@/lib/ratelimit/upstash";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkUserRateLimit(session.user.id, "lessons-rewrite", 30, 3600);
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
  let script: string;
  let prompts: string[];

  try {
    const body = (await request.json()) as {
      lessonId?: string;
      script?: string;
      prompts?: unknown;
    };

    lessonId = body.lessonId?.trim() ?? "";
    script = body.script?.trim() ?? "";
    prompts = Array.isArray(body.prompts)
      ? (body.prompts as unknown[])
          .map((p) => String(p).trim())
          .filter((p) => p.length > 0)
      : [];

    if (!lessonId) throw new Error("lessonId is required");
    if (!script) throw new Error("script is required");
    if (prompts.length === 0) throw new Error("At least one prompt is required");
    if (prompts.length > 10) throw new Error("Maximum 10 prompts allowed");
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }

  // Verify the lesson belongs to the authenticated user's org
  const [lesson] = await db
    .select({ id: lessons.id, projectId: lessons.projectId })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Build numbered instruction list
  const instructionList = prompts
    .map((p, i) => `${i + 1}. ${p}`)
    .join("\n");

  const systemPrompt = `You are a professional scriptwriter and editor. Your job is to rewrite a lesson script by applying a set of specific instructions simultaneously.

Rules:
- Apply ALL instructions at once — do not cherry-pick
- Preserve the overall structure and key information unless an instruction says otherwise
- Keep scene markers like [SCENE: Title] in place unless told to remove them
- Return ONLY the rewritten script — no preamble, no explanation, no markdown fences`;

  const userPrompt = `CURRENT SCRIPT:
${script}

INSTRUCTIONS TO APPLY:
${instructionList}

Rewrite the script applying every instruction above. Return only the rewritten script text.`;

  try {
    const rewritten = await generateText({
      prompt: userPrompt,
      systemPrompt,
      maxTokens: 6000,
      temperature: 0.6,
    });

    return Response.json({ script: rewritten.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
