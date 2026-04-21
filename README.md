# Scribe IQ

Copywriting bible + AI generation tool. 26 niches × 24 personas × 8 collaboration bands. 200 years of what works and why.

---

## Running Locally (Windows)

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Git](https://git-scm.com)
- [Claude Code](https://claude.ai/code) — installed and authenticated with your Max subscription

### Setup

```powershell
git clone https://github.com/alvindean/scribiq1-.git C:\Users\alvin\Documents\scribiq
cd C:\Users\alvin\Documents\scribiq
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Claude Integration — Two Modes

### Mode 1: Subprocess (Max subscription, no API key)

**Route:** `POST /api/claude`

Calls Claude by spawning the `claude` CLI as a subprocess. Uses your authenticated Max session — no `ANTHROPIC_API_KEY` needed, no API credits burned.

```json
POST /api/claude
{
  "prompt": "Write a direct response hook for a productivity app",
  "system": "You are a copywriting expert",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}
```

**Requirements:**
- `claude` must be in your PATH (installed via Claude Code)
- Run `claude /status` to confirm you're authenticated and on Max/Pro
- The Next.js process must be running on the same machine as Claude Code

**Tradeoffs:**

| | Subprocess (`/api/claude`) | SDK (`/api/generate`) |
|---|---|---|
| API key needed | No | Yes |
| Billing | Max subscription | API credits |
| Streaming | Yes (stdout pipe) | Yes (SDK stream) |
| Startup latency | ~1–2s (process spawn) | ~200ms |
| Model control | No | Full |
| Concurrent requests | Limited by machine | Rate limit only |

### Mode 2: Anthropic SDK (API key, pay-per-token)

**Route:** `POST /api/generate`

Uses `@anthropic-ai/sdk` with `claude-opus-4-7`. Requires `ANTHROPIC_API_KEY` in `.env.local`.

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key from [console.anthropic.com](https://console.anthropic.com). This is separate from your claude.ai subscription.

---

## Cloudflare Tunnel Setup (Windows)

### Install cloudflared

```powershell
winget install --id Cloudflare.cloudflared
```

### Authenticate

```powershell
cloudflared tunnel login
```

This opens a browser — log in with the Cloudflare account that manages your domain.

### Create the tunnel

```powershell
cloudflared tunnel create scribiq
```

Copy the tunnel ID from the output.

### Config file

Create `C:\Users\alvin\.cloudflared\scribiq-config.yml`:

```yaml
tunnel: <your-tunnel-id>
credentials-file: C:\Users\alvin\.cloudflared\<tunnel-id>.json

ingress:
  - hostname: scribiq.nuwavmedia.com
    service: http://localhost:3000
  - service: http_status:404
```

### Route DNS

```powershell
cloudflared tunnel route dns scribiq scribiq.nuwavmedia.com
```

### Run the tunnel

```powershell
cloudflared tunnel --config C:\Users\alvin\.cloudflared\scribiq-config.yml run scribiq
```

### Install as Windows service (auto-start on boot)

```powershell
cloudflared service install
```

---

## Health Check

```
GET /api/health
→ { "status": "ok", "service": "scribe-iq", "timestamp": "..." }
```

---

## Security Notes

- `.cloudflared/*.json` and `.cloudflared/cert.pem` are in `.gitignore` — never commit credentials
- Do not put `ANTHROPIC_API_KEY` in environment if using the subprocess mode
- The subprocess route inherits the machine's Claude Code session — keep that session secured
