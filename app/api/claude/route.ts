import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  prompt: string
  history?: Message[]
  system?: string
  stream?: boolean
}

// Calls Claude via the Claude Code CLI subprocess.
// This uses the authenticated Max/Pro session on this machine — no API key needed.
// Tradeoffs vs @anthropic-ai/sdk:
//   ✓ No ANTHROPIC_API_KEY required — uses your claude.ai subscription
//   ✓ Zero API credit burn
//   ✗ No true token streaming (yields chunks as claude outputs them, but slower start)
//   ✗ Requires `claude` to be in PATH and authenticated on this machine
//   ✗ Higher latency (~1–2s subprocess startup per request)
//   ✗ No fine-grained model/temperature control
export async function POST(req: NextRequest) {
  let body: RequestBody

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { prompt, history = [], system } = body

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  // Build the full prompt with conversation context
  const parts: string[] = []
  if (system) parts.push(`[System context: ${system}]`)
  for (const msg of history) {
    parts.push(`${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
  }
  parts.push(prompt)

  const fullPrompt = parts.join('\n\n')

  // Stream stdout from the subprocess back to the client
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const proc = spawn('claude', ['-p', fullPrompt], {
        env: process.env,
        timeout: 120_000,
      })

      proc.stdout.on('data', (chunk: Buffer) => {
        controller.enqueue(encoder.encode(chunk.toString()))
      })

      proc.stderr.on('data', (chunk: Buffer) => {
        const msg = chunk.toString()
        // Only surface errors that matter — claude writes noise to stderr too
        if (msg.includes('not authenticated') || msg.includes('login') || msg.includes('error')) {
          console.error('[claude subprocess stderr]', msg)
        }
      })

      proc.on('error', (err) => {
        const isNotFound = (err as NodeJS.ErrnoException).code === 'ENOENT'
        const msg = isNotFound
          ? 'claude CLI not found. Install Claude Code and run `claude login` on this machine.'
          : err.message
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`))
        controller.close()
      })

      proc.on('close', (code) => {
        if (code !== 0 && code !== null) {
          controller.enqueue(
            encoder.encode(`\n\n[Error: claude exited with code ${code}. Run \`claude /status\` to check authentication.]`)
          )
        }
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
