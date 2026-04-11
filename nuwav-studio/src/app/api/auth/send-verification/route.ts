import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailVerificationTokens, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/email/send";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let email: string;

  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Look up user — return 200 even on miss to prevent user enumeration
  const [user] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Generate a secure token and store it
  const token = crypto.randomUUID();
  await db.insert(emailVerificationTokens).values({
    userId: user.id,
    token,
    email: user.email,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send verification email (non-fatal — log but don't surface to client)
  try {
    await sendVerificationEmail(user.email, user.name ?? "", token);
  } catch (err) {
    console.error("[send-verification] Failed to send email:", err);
  }

  return NextResponse.json({ success: true });
}
