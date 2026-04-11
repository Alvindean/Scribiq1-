import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { invitations, profiles, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as {
    token?: string;
    name?: string;
    password?: string;
  };
  const token = (body.token ?? "").trim();
  const name = (body.name ?? "").trim() || null;
  const password = (body.password ?? "").trim();

  if (!token) {
    return Response.json({ error: "Missing invitation token" }, { status: 400 });
  }

  // Look up invitation
  const [invite] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.token, token))
    .limit(1);

  if (!invite) {
    return Response.json({ error: "Invalid invitation" }, { status: 404 });
  }

  if (invite.acceptedAt) {
    return Response.json(
      { error: "This invitation has already been accepted" },
      { status: 409 }
    );
  }

  if (invite.expiresAt < new Date()) {
    return Response.json(
      { error: "This invitation has expired" },
      { status: 410 }
    );
  }

  // Check if a user with this email already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, invite.email))
    .limit(1);

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;

    // Update their profile to the invited org
    await db
      .update(profiles)
      .set({ orgId: invite.orgId, role: invite.role })
      .where(eq(profiles.id, existingUser.id));
  } else {
    // New user — create user + profile
    // Password is required for new users
    if (!password || password.length < 8) {
      return Response.json(
        {
          error:
            "A password of at least 8 characters is required for new accounts",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const displayName = name ?? invite.email.split("@")[0];

    const [newUser] = await db
      .insert(users)
      .values({
        email: invite.email,
        name: displayName,
        passwordHash,
      })
      .returning({ id: users.id });

    userId = newUser.id;

    // Create profile for new user
    await db.insert(profiles).values({
      id: userId,
      email: invite.email,
      name: displayName,
      orgId: invite.orgId,
      role: invite.role,
    });
  }

  // Mark invitation as accepted
  await db
    .update(invitations)
    .set({ acceptedAt: new Date() })
    .where(eq(invitations.id, invite.id));

  return Response.json({ success: true, userId });
}
