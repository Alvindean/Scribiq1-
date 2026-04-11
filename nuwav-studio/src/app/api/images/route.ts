import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { generateSlideBackground } from "@/lib/media/images";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let prompt: string;
  let lessonId: string | undefined;

  try {
    const body = (await request.json()) as {
      prompt: string;
      lessonId?: string;
    };
    prompt = body.prompt;
    lessonId = body.lessonId;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error("Missing or empty prompt");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request body";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await generateSlideBackground(prompt.trim());

    // Persist background colours to the lesson's visualSettings when a
    // lessonId is supplied so the canvas can pick them up without re-calling
    // this endpoint.
    if (lessonId) {
      await db
        .update(lessons)
        .set({
          visualSettings: {
            backgroundColor: result.css,
            backgroundImageUrl: result.svgDataUrl,
            textColor: result.colors.text === "#ffffff" ? "light" : "dark",
          },
          updatedAt: new Date(),
        })
        .where(eq(lessons.id, lessonId));
    }

    return new Response(
      JSON.stringify({
        svgDataUrl: result.svgDataUrl,
        css: result.css,
        colors: result.colors,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
