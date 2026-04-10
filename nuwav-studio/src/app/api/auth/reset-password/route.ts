import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";

export async function POST(request: NextRequest): Promise<Response> {
  let token: string;
  let password: string;

  try {
    const body = (await request.json()) as { token: string; password: string };
    token = body.token?.trim();
    password = body.password;

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!password || password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (password.length > 128) {
      return new Response(
        JSON.stringify({ error: "Password must be 128 characters or fewer" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!resetToken) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired reset token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (resetToken.usedAt !== null) {
      return new Response(
        JSON.stringify({ error: "This reset link has already been used" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (resetToken.expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ error: "This reset link has expired" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, resetToken.userId));

    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetToken.id));

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[reset-password] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
