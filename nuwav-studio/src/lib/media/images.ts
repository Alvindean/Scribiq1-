export interface ImageGenerationOptions {
  prompt: string;
  style?: "photorealistic" | "illustration" | "abstract" | "minimal";
  aspectRatio?: "16:9" | "1:1" | "9:16";
  model?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

// inference.sh FLUX image generation
export async function generateSlideBackground(
  options: ImageGenerationOptions
): Promise<GeneratedImage> {
  const {
    prompt,
    style = "abstract",
    aspectRatio = "16:9",
    model = "black-forest-labs/FLUX.1-schnell",
  } = options;

  const enhancedPrompt = `${prompt}, ${style} style, professional, high quality, ${aspectRatio === "16:9" ? "widescreen landscape" : ""}`;

  const response = await fetch("https://api.inference.sh/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.INFERENCE_SH_API_KEY ?? ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: enhancedPrompt,
      n: 1,
      size: aspectRatio === "16:9" ? "1344x768" : "1024x1024",
    }),
  });

  if (!response.ok) {
    throw new Error(`Image generation failed: ${response.status}`);
  }

  const data = await response.json() as { data: Array<{ url: string }> };
  const imageUrl = data.data[0]?.url;
  if (!imageUrl) throw new Error("No image URL in response");

  return { url: imageUrl, prompt: enhancedPrompt };
}
