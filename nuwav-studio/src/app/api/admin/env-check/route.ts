import { auth } from "@/lib/auth";

const VARS_TO_CHECK = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "ELEVENLABS_API_KEY",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "AUTH_SECRET",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "ADMIN_EMAIL",
];

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

  const result: Record<string, boolean> = {};
  for (const v of VARS_TO_CHECK) {
    result[v] = !!(process.env[v] && process.env[v]!.trim().length > 0);
  }

  return Response.json(result);
}
