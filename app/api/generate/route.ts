import { NextRequest, NextResponse } from 'next/server'
import { generateCopy, GenerateOptions } from '@/lib/claude'
import { getNiche, getPersona } from '@/lib/bible'

export async function POST(req: NextRequest) {
  let body: GenerateOptions & { nicheId?: string; personaId?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { niche, persona, targetAudience, topic, nicheId, personaId, ...rest } = body

  // Validate required fields
  const missing: string[] = []
  if (!niche) missing.push('niche')
  if (!persona) missing.push('persona')
  if (!targetAudience) missing.push('targetAudience')
  if (!topic) missing.push('topic')

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 }
    )
  }

  // Enrich with bible data when IDs are provided
  let nicheData: Record<string, unknown> | undefined
  if (nicheId) {
    const found = await getNiche(nicheId)
    if (found) nicheData = found as Record<string, unknown>
  }

  let personaData: Record<string, unknown> | undefined
  if (personaId) {
    const found = await getPersona(personaId)
    if (found) personaData = found as Record<string, unknown>
  }

  const options: GenerateOptions = {
    niche,
    persona,
    targetAudience,
    topic,
    ...rest,
    nicheData,
    personaData,
  }

  try {
    const stream = await generateCopy(options)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    console.error('Generation error:', err)
    return NextResponse.json(
      { error: 'Failed to generate copy. Please try again.' },
      { status: 500 }
    )
  }
}
