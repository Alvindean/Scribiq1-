import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitations, organizations, profiles } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  if (!profile.orgId) {
    return Response.json({ members: [], pendingInvitations: [], orgName: null });
  }

  const [org] = await db
    .select({ name: organizations.name })
    .from(organizations)
    .where(eq(organizations.id, profile.orgId))
    .limit(1);

  // All members of this org
  const members = await db
    .select({
      id: profiles.id,
      email: profiles.email,
      name: profiles.name,
      role: profiles.role,
      avatarUrl: profiles.avatarUrl,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .where(eq(profiles.orgId, profile.orgId));

  // Pending invitations (not accepted, not expired)
  const now = new Date();
  const allInvitations = await db
    .select({
      id: invitations.id,
      email: invitations.email,
      role: invitations.role,
      expiresAt: invitations.expiresAt,
      acceptedAt: invitations.acceptedAt,
      createdAt: invitations.createdAt,
    })
    .from(invitations)
    .where(
      and(
        eq(invitations.orgId, profile.orgId),
        isNull(invitations.acceptedAt)
      )
    );

  const pendingInvitations = allInvitations.filter(
    (inv) => inv.expiresAt > now
  );

  return Response.json({
    members,
    pendingInvitations,
    orgName: org?.name ?? null,
    currentUserId: profile.id,
    currentUserRole: profile.role,
  });
}
