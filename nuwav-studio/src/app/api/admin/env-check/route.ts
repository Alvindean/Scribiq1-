import { auth } from "@/lib/auth";

export interface EnvCheckItem {
  key: string;
  present: boolean;
  required: boolean;
}

export interface EnvCheckGroup {
  name: string;
  checks: EnvCheckItem[];
}

export interface EnvCheckResponse {
  groups: EnvCheckGroup[];
}

const GROUPS: Array<{ name: string; checks: Array<{ key: string; required: boolean }> }> = [
  {
    name: "Core",
    checks: [
      { key: "NEXT_PUBLIC_APP_URL", required: true },
      { key: "NEXTAUTH_SECRET", required: true },
      { key: "NEXTAUTH_URL", required: true },
      { key: "AUTH_SECRET", required: false },
      { key: "ADMIN_EMAIL", required: true },
    ],
  },
  {
    name: "Database",
    checks: [
      { key: "DATABASE_URL", required: true },
    ],
  },
  {
    name: "Auth",
    checks: [
      { key: "GOOGLE_CLIENT_ID", required: false },
      { key: "GOOGLE_CLIENT_SECRET", required: false },
    ],
  },
  {
    name: "AI",
    checks: [
      { key: "OPENROUTER_API_KEY", required: true },
      { key: "OPENROUTER_MODEL", required: false },
      { key: "ANTHROPIC_API_KEY", required: false },
      { key: "OPENAI_API_KEY", required: false },
    ],
  },
  {
    name: "TTS (ElevenLabs)",
    checks: [
      { key: "ELEVENLABS_API_KEY", required: true },
      { key: "ELEVENLABS_VOICE_ID", required: false },
    ],
  },
  {
    name: "Storage (R2)",
    checks: [
      { key: "CLOUDFLARE_R2_ACCOUNT_ID", required: true },
      { key: "CLOUDFLARE_R2_ACCESS_KEY", required: true },
      { key: "CLOUDFLARE_R2_SECRET_KEY", required: true },
      { key: "CLOUDFLARE_R2_BUCKET", required: true },
      { key: "CLOUDFLARE_R2_PUBLIC_URL", required: false },
    ],
  },
  {
    name: "Redis (Upstash)",
    checks: [
      { key: "UPSTASH_REDIS_REST_URL", required: false },
      { key: "UPSTASH_REDIS_REST_TOKEN", required: false },
    ],
  },
  {
    name: "Email (Resend)",
    checks: [
      { key: "RESEND_API_KEY", required: true },
      { key: "FROM_EMAIL", required: false },
      { key: "EMAIL_FROM", required: false },
    ],
  },
  {
    name: "Payments (Stripe)",
    checks: [
      { key: "STRIPE_SECRET_KEY", required: true },
      { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: true },
      { key: "STRIPE_WEBHOOK_SECRET", required: true },
      { key: "STRIPE_STARTER_PRICE_ID", required: false },
      { key: "STRIPE_PRO_PRICE_ID", required: false },
      { key: "STRIPE_AGENCY_PRICE_ID", required: false },
    ],
  },
  {
    name: "Optional",
    checks: [
      { key: "SPOTIFY_CLIENT_ID", required: false },
      { key: "SPOTIFY_CLIENT_SECRET", required: false },
      { key: "PIXABAY_API_KEY", required: false },
      { key: "FREESOUND_API_KEY", required: false },
    ],
  },
];

function isPresent(key: string): boolean {
  const val = process.env[key];
  return !!(val && val.trim().length > 0);
}

export async function GET(): Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as {
    email?: string | null;
    isAdmin?: boolean;
  };

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin =
    user.isAdmin === true ||
    (adminEmail
      ? user.email?.toLowerCase() === adminEmail.toLowerCase()
      : false);

  if (!isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const groups: EnvCheckGroup[] = GROUPS.map(({ name, checks }) => ({
    name,
    checks: checks.map(({ key, required }) => ({
      key,
      present: isPresent(key),
      required,
    })),
  }));

  const response: EnvCheckResponse = { groups };
  return Response.json(response);
}
