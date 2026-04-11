import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitations, profiles } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify caller is admin/owner of the same org
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
      { error: "Only admins can cancel invitations" },
      { status: 403 }
    );
  }

  if (!profile.orgId) {
    return Response.json(
      { error: "You are not part of an organization" },
      { status: 400 }
    );
  }

  try {
    // Only delete invitations that belong to the caller's org
    const result = await db
      .delete(invitations)
      .where(and(eq(invitations.id, id), eq(invitations.orgId, profile.orgId)))
      .returning({ id: invitations.id });

    if (result.length === 0) {
      return Response.json({ error: "Invitation not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/team/invite/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
