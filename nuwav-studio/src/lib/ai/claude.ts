import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

const DEFAULT_MODEL =
  process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

export interface GenerateOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function generateText(options: GenerateOptions): Promise<string> {
  const { prompt, systemPrompt, maxTokens = 4096, temperature = 0.7 } = options;

  const message = await getClient().messages.create({
    model: DEFAULT_MODEL,
    max_tokens: maxTokens,
    temperature,
    ...(systemPrompt ? { system: systemPrompt } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in response");
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

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`AI returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }
}
