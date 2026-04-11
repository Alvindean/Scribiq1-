import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { invitations, organizations, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest): Promise<Response> {
  const token = request.nextUrl.searchParams.get("token") ?? "";

  if (!token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const [invite] = await db
      .select()
      .from(invitations)
      .where(eq(invitations.token, token))
      .limit(1);

    if (!invite) {
      return Response.json({ error: "Invalid invitation" }, { status: 404 });
    }

    // Load org name
    const [org] = await db
      .select({ name: organizations.name })
      .from(organizations)
      .where(eq(organizations.id, invite.orgId))
      .limit(1);

    const orgName = org?.name ?? "your team";

    if (invite.acceptedAt) {
      return Response.json({
        email: invite.email,
        orgName,
        role: invite.role,
        accepted: true,
        isNewUser: false,
      });
    }

    if (invite.expiresAt < new Date()) {
      return Response.json({
        email: invite.email,
        orgName,
        role: invite.role,
        expired: true,
        isNewUser: false,
      });
    }

    // Check if a user already has an account
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, invite.email))
      .limit(1);

    return Response.json({
      email: invite.email,
      orgName,
      role: invite.role,
      isNewUser: !existingUser,
      expired: false,
      accepted: false,
    });
  } catch (err) {
    console.error("[GET /api/team/invite-info]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
