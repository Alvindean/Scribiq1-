import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitations, organizations, profiles, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { sendInviteEmail } from "@/lib/email/send";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Load the caller's profile to confirm they are an admin or owner
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.role !== "admin" && profile.role !== "owner") {
    return Response.json(
      { error: "Only admins can invite team members" },
      { status: 403 }
    );
  }

  if (!profile.orgId) {
    return Response.json(
      { error: "You are not part of an organization" },
      { status: 400 }
    );
  }

  const body = (await request.json()) as { email?: string; role?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const role = body.role === "admin" ? "admin" : "member";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Load org to include its name in the email
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, profile.orgId))
    .limit(1);

  if (!org) {
    return Response.json({ error: "Organization not found" }, { status: 404 });
  }

  // Check if this email already belongs to a member of the org
  const [existingMember] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(eq(profiles.email, email), eq(profiles.orgId, profile.orgId)))
    .limit(1);

  if (existingMember) {
    return Response.json(
      { error: "This person is already a member of your organization" },
      { status: 409 }
    );
  }

  // Check if there is already a pending (not accepted, not expired) invitation
  const now = new Date();
  const existingInvites = await db
    .select({ id: invitations.id, expiresAt: invitations.expiresAt, acceptedAt: invitations.acceptedAt })
    .from(invitations)
    .where(
      and(
        eq(invitations.orgId, profile.orgId),
        eq(invitations.email, email)
      )
    );

  const pendingInvite = existingInvites.find(
    (inv) => !inv.acceptedAt && inv.expiresAt > now
  );

  if (pendingInvite) {
    return Response.json(
      { error: "This person already has a pending invitation" },
      { status: 409 }
    );
  }

  // Generate a secure random token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [newInvite] = await db
    .insert(invitations)
    .values({
      orgId: profile.orgId,
      email,
      role,
      token,
      invitedBy: session.user.id,
      expiresAt,
    })
    .returning({ id: invitations.id });

  // Send invite email — fall back to console log if Resend is not configured
  const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://app.nuwavstudio.com";
  const inviteUrl = `${APP_URL}/invite/${token}`;
  const inviterName = profile.name ?? session.user.email ?? "A team member";

  try {
    await sendInviteEmail(email, inviterName, org.name, inviteUrl);
  } catch (err) {
    console.warn("[invite] Email send failed — logging invite URL instead:", inviteUrl);
    console.error(err);
  }

  return Response.json({ success: true, invitationId: newInvite.id }, { status: 201 });
}
