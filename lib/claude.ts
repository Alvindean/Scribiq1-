import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GenerateOptions {
  niche: string
  persona: string
  eraInfluence?: string
  targetAudience: string
  topic: string
  toneNotes?: string
  customRules?: string
  nicheData?: Record<string, unknown>
  personaData?: Record<string, unknown>
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildSystemPrompt(options: GenerateOptions): string {
  const {
    niche,
    persona,
    eraInfluence,
    targetAudience,
    toneNotes,
    customRules,
    nicheData,
    personaData,
  } = options

  // Build niche section
  let nicheSection = `## Niche: ${niche}`
  if (nicheData) {
    const lines: string[] = [`## Niche: ${niche}`]
    if (nicheData.description) {
      lines.push(`Description: ${nicheData.description}`)
    }
    if (Array.isArray(nicheData.rules) && nicheData.rules.length > 0) {
      lines.push('Rules:')
      ;(nicheData.rules as string[]).forEach((r) => lines.push(`- ${r}`))
    }
    if (nicheData.toneNotes) {
      lines.push(`Tone notes: ${nicheData.toneNotes}`)
    }
    if (Array.isArray(nicheData.keywords) && nicheData.keywords.length > 0) {
      lines.push(`Keywords: ${(nicheData.keywords as string[]).join(', ')}`)
    }
    nicheSection = lines.join('\n')
  }

  // Build persona section
  let personaSection = `## Persona: ${persona}`
  if (personaData) {
    const lines: string[] = [`## Persona: ${persona}`]
    if (personaData.writingStyle) {
      lines.push(`Writing style: ${personaData.writingStyle}`)
    }
    if (
      Array.isArray(personaData.voiceCharacteristics) &&
      personaData.voiceCharacteristics.length > 0
    ) {
      lines.push('Voice characteristics:')
      ;(personaData.voiceCharacteristics as string[]).forEach((v) =>
        lines.push(`- ${v}`)
      )
    }
    if (
      Array.isArray(personaData.signaturePhrases) &&
      personaData.signaturePhrases.length > 0
    ) {
      lines.push(
        `Signature phrases: ${(personaData.signaturePhrases as string[]).join(' | ')}`
      )
    }
    if (
      Array.isArray(personaData.forbiddenPhrases) &&
      personaData.forbiddenPhrases.length > 0
    ) {
      lines.push(
        `Forbidden phrases (never use): ${(personaData.forbiddenPhrases as string[]).join(', ')}`
      )
    }
    personaSection = lines.join('\n')
  }

  const eraSection = eraInfluence
    ? `## Era Influence\nWrite with stylistic influence from: ${eraInfluence}`
    : ''

  const toneSection = toneNotes ? `## Tone Notes\n${toneNotes}` : ''

  const customSection = customRules ? `## Custom Rules\n${customRules}` : ''

  const parts = [
    'You are a world-class editorial copywriter operating through the Scribe IQ system. You write with surgical precision, deep authority, and a voice that commands attention.',
    nicheSection,
    personaSection,
    `## Target Audience\n${targetAudience}`,
    eraSection,
    toneSection,
    customSection,
    `## Core Directives
- Write entirely in the voice of the specified persona — never break character
- Honor all niche rules without exception
- Write for the target audience; assume their intelligence, frustrations, and desires
- Prioritize clarity, punch, and memorability over filler
- Use short paragraphs, rhythm, and white space to control pacing
- Never use hollow corporate language, passive voice abuse, or clichéd openers
- Every sentence must earn its place`,
  ]

  return parts.filter(Boolean).join('\n\n')
}

// ─── Streaming generation ─────────────────────────────────────────────────────

export async function generateCopy(options: GenerateOptions): Promise<ReadableStream> {
  const systemPrompt = buildSystemPrompt(options)

  const eraLine = options.eraInfluence
    ? `**Era Influence:** ${options.eraInfluence}`
    : ''

  const userMessageParts = [
    'Write high-converting editorial copy about the following topic:',
    '',
    `**Topic:** ${options.topic}`,
    `**Niche:** ${options.niche}`,
    `**Persona:** ${options.persona}`,
    `**Target Audience:** ${options.targetAudience}`,
    eraLine,
    '',
    'Deliver the copy now. Begin immediately — no preamble, no meta-commentary. Just the copy.',
  ]

  const userMessage = userMessageParts.filter((l) => l !== undefined).join('\n')

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}
