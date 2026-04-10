import { NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendPasswordResetEmail } from "@/lib/email";

const SAFE_RESPONSE = {
  message: "If that email is registered, a reset link has been sent.",
};

export async function POST(request: NextRequest): Promise<Response> {
  let email: string;

  try {
    const body = (await request.json()) as { email: string };
    email = body.email?.trim().toLowerCase();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const [user] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user) {
      try {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await db.insert(passwordResetTokens).values({
          userId: user.id,
          token,
          expiresAt,
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
        await sendPasswordResetEmail(email, resetUrl);
      } catch (err) {
        console.error("[forgot-password] Failed to send reset email:", err);
      }
    }
  } catch (err) {
    console.error("[forgot-password] DB error:", err);
  }

  return new Response(JSON.stringify(SAFE_RESPONSE), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
