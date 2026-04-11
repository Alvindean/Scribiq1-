import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { modules, projects, profiles, lessons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Helper: verify the module belongs to the caller's org. Returns the module row
// (with projectId) or null.
async function resolveModule(
  moduleId: string,
  userId: string
): Promise<{ id: string; projectId: string } | null> {
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!profile?.orgId) return null;

  const [mod] = await db
    .select({ id: modules.id, projectId: modules.projectId })
    .from(modules)
    .where(eq(modules.id, moduleId))
    .limit(1);

  if (!mod) return null;

  // Confirm the project belongs to this org
  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(eq(projects.id, mod.projectId), eq(projects.orgId, profile.orgId))
    )
    .limit(1);

  return project ? mod : null;
}

// PATCH /api/modules/[id] — rename a module
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const body = (await request.json()) as { title?: unknown };
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return Response.json({ error: "title is required" }, { status: 400 });
    }

    const mod = await resolveModule(id, session.user.id);
    if (!mod) {
      return Response.json({ error: "Module not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(modules)
      .set({ title })
      .where(eq(modules.id, id))
      .returning();

    return Response.json({ module: updated });
  } catch (err) {
    console.error("[PATCH /api/modules/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/modules/[id] — delete a module and all its lessons
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

    const mod = await resolveModule(id, session.user.id);
    if (!mod) {
      return Response.json({ error: "Module not found" }, { status: 404 });
    }

    // Delete child lessons first (no cascade in schema)
    await db.delete(lessons).where(eq(lessons.moduleId, id));
    await db.delete(modules).where(eq(modules.id, id));

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/modules/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
