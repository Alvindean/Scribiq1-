import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { modules, projects, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;

  const body = (await request.json()) as { orderedIds?: unknown };
  const orderedIds = body.orderedIds;

  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((x) => typeof x !== "string")
  ) {
    return Response.json(
      { error: "orderedIds must be an array of strings" },
      { status: 400 }
    );
  }

  // Verify the project belongs to the caller's org
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return Response.json({ error: "No organisation found" }, { status: 400 });
  }

  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  // Update each module's order in parallel
  await Promise.all(
    (orderedIds as string[]).map((moduleId, index) =>
      db
        .update(modules)
        .set({ order: index })
        .where(eq(modules.id, moduleId))
    )
  );

  return Response.json({ ok: true });
}
