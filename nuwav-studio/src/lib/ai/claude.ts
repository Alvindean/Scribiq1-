import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not set");
    }
    _client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://nuwav-studio.vercel.app",
        "X-Title": "NuWav Studio",
      },
    });
  }
  return _client;
}

// Change to any OpenRouter model slug you prefer
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4-5";

export interface GenerateOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function generateText(options: GenerateOptions): Promise<string> {
  const { prompt, systemPrompt, maxTokens = 4096, temperature = 0.7 } = options;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const response = await getClient().chat.completions.create({
    model: DEFAULT_MODEL,
    max_tokens: maxTokens,
    temperature,
    messages,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("No text content in OpenRouter response");
  return text;
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
    throw new Error(`Model returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }
}
