import crypto from "crypto";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { emailVerificationTokens, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest): Promise<Response> {
  let email: string;

  try {
    const body = (await request.json()) as { email: string };
    email = body.email?.trim().toLowerCase();
    if (!email) {
      return new Response(null, { status: 200 });
    }
  } catch {
    return new Response(null, { status: 200 });
  }

  try {
    // Find user by email — don't enumerate whether they exist
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      // Silently return 200 to avoid user enumeration
      return new Response(null, { status: 200 });
    }

    // Rate-limit: check if a token was created in the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const [recentToken] = await db
      .select({ createdAt: emailVerificationTokens.createdAt })
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, user.id))
      .orderBy(desc(emailVerificationTokens.createdAt))
      .limit(1);

    if (recentToken && recentToken.createdAt > twoMinutesAgo) {
      // Silently throttle
      return new Response(null, { status: 200 });
    }

    // Create a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await db.insert(emailVerificationTokens).values({
      userId: user.id,
      token: verificationToken,
      email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });

    await sendVerificationEmail(
      email,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`
    );
  } catch {
    // Non-fatal — don't leak errors
  }

  return new Response(null, { status: 200 });
}
