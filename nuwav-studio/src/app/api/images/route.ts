import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { generateSlideBackground } from "@/lib/media/images";

type ImageStyle = "photorealistic" | "illustration" | "abstract" | "minimal";
type AspectRatio = "16:9" | "1:1" | "9:16";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let prompt: string;
  let style: ImageStyle | undefined;
  let aspectRatio: AspectRatio | undefined;

  try {
    const body = (await request.json()) as {
      prompt: string;
      style?: ImageStyle;
      aspectRatio?: AspectRatio;
    };
    prompt = body.prompt;
    style = body.style;
    aspectRatio = body.aspectRatio;

    if (!prompt) throw new Error("Missing prompt");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await generateSlideBackground({
      prompt,
      style,
      aspectRatio,
    });

    return new Response(JSON.stringify({ url: result.url }), {
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
