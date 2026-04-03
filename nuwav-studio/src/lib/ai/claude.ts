import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface GenerateOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function generateText(options: GenerateOptions): Promise<string> {
  const { prompt, systemPrompt, maxTokens = 4096, temperature = 0.7 } = options;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    temperature,
    ...(systemPrompt ? { system: systemPrompt } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return textBlock.text;
}

export async function generateJSON<T>(options: GenerateOptions): Promise<T> {
  const text = await generateText({
    ...options,
    systemPrompt:
      (options.systemPrompt ?? "") +
      "\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown code blocks, no explanation — just the raw JSON object.",
  });

  // Strip any accidental markdown
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`Claude returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }
}

export { anthropic };
