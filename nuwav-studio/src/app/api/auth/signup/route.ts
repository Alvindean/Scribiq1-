import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, organizations, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

    if (!email || !password || !name) {
      throw new Error("Missing required fields");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
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
