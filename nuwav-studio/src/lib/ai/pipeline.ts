import { generateJSON, generateText } from "./claude";
import {
  buildOutlinePrompt,
  type OutlineInput,
  type GeneratedOutline,
} from "./prompts/generate-outline";
import { buildScriptPrompt, type ScriptInput } from "./prompts/generate-script";
import { buildVSLPrompt, type VSLInput } from "./prompts/generate-vsl";

export async function generateOutline(
  input: OutlineInput
): Promise<GeneratedOutline> {
  const prompt = buildOutlinePrompt(input);
  return generateJSON<GeneratedOutline>({ prompt });
}

export async function generateScript(input: ScriptInput): Promise<string> {
  const prompt = buildScriptPrompt(input);
  return generateText({ prompt });
}

export async function generateVSLScript(input: VSLInput): Promise<string> {
  const prompt = buildVSLPrompt(input);
  return generateText({ prompt });
}
