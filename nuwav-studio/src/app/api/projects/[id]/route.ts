import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, modules, lessons, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Resolve org from profile
    const [profile] = await db
      .select({ orgId: profiles.orgId })
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);

    if (!profile?.orgId) {
      return Response.json({ error: "No organisation found" }, { status: 400 });
    }

    // Verify project belongs to this org
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.orgId, profile.orgId)))
      .limit(1);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete lessons → modules → project (no cascade defined in schema)
    await db.delete(lessons).where(eq(lessons.projectId, id));
    await db.delete(modules).where(eq(modules.projectId, id));
    await db.delete(projects).where(eq(projects.id, id));

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/projects/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
