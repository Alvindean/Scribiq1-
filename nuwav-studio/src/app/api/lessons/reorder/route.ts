import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, modules, projects, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    moduleId?: unknown;
    orderedIds?: unknown;
  };

  const { moduleId, orderedIds } = body;

  if (typeof moduleId !== "string" || !moduleId) {
    return Response.json({ error: "moduleId is required" }, { status: 400 });
  }

  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((x) => typeof x !== "string")
  ) {
    return Response.json(
      { error: "orderedIds must be an array of strings" },
      { status: 400 }
    );
  }

  // Resolve the org from the caller's profile
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return Response.json({ error: "No organisation found" }, { status: 400 });
  }

  // Verify the module exists and its project belongs to the caller's org
  const [mod] = await db
    .select({ projectId: modules.projectId })
    .from(modules)
    .where(eq(modules.id, moduleId))
    .limit(1);

  if (!mod) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }

  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(eq(projects.id, mod.projectId), eq(projects.orgId, profile.orgId))
    )
    .limit(1);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  // Update each lesson's order in parallel
  await Promise.all(
    (orderedIds as string[]).map((id, index) =>
      db.update(lessons).set({ order: index }).where(eq(lessons.id, id))
    )
  );

  return Response.json({ success: true });
}
