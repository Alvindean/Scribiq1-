// Rate limiting for this route is handled at the middleware layer (src/middleware.ts)
import crypto from "crypto";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, organizations, profiles, emailVerificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest): Promise<Response> {
  let email: string;
  let password: string;
  let name: string;

  try {
    const body = (await request.json()) as {
      email: string;
      password: string;
      name: string;
    };
    email = body.email?.trim().toLowerCase();
    password = body.password;
    name = body.name?.trim();

    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    // Basic email format check server-side (HTML type="email" is bypassed by API callers)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email address");
    }
    if (!name) name = email.split("@")[0];
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    // bcrypt silently truncates at 72 bytes; cap here to avoid user confusion
    if (password.length > 128) {
      throw new Error("Password must be 128 characters or fewer");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request body";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check if user already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return new Response(
        JSON.stringify({ error: "An account with this email already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user
    const [newUser] = await db
      .insert(users)
      .values({ email, name, passwordHash })
      .returning({ id: users.id });

    if (!newUser) throw new Error("Failed to create user");

    // Create org slug from email username
    const emailUsername = email.split("@")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const orgSlug = `${emailUsername}-${Date.now()}`;

    // Create organization
    const [newOrg] = await db
      .insert(organizations)
      .values({
        name: `${name}'s Organization`,
        slug: orgSlug,
        ownerId: newUser.id,
        plan: "starter",
      })
      .returning({ id: organizations.id });

    if (!newOrg) throw new Error("Failed to create organization");

    // Create profile
    await db.insert(profiles).values({
      id: newUser.id,
      orgId: newOrg.id,
      email,
      name,
      role: "owner",
    });

    // Send email verification
    try {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      await db.insert(emailVerificationTokens).values({
        userId: newUser.id,
        token: verificationToken,
        email,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      });
      await sendVerificationEmail(
        email,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`
      );
    } catch {
      // Non-fatal: account is created, verification email failed
    }

    return new Response(JSON.stringify({ userId: newUser.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
