import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { modules, projects, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    projectId?: unknown;
    orderedIds?: unknown;
  };

  const { projectId, orderedIds } = body;

  if (typeof projectId !== "string" || !projectId) {
    return Response.json({ error: "projectId is required" }, { status: 400 });
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

  try {
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
      .where(and(eq(projects.id, projectId), eq(projects.orgId, profile.orgId)))
      .limit(1);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    // Update each module's order in parallel
    await Promise.all(
      (orderedIds as string[]).map((id, index) =>
        db.update(modules).set({ order: index }).where(eq(modules.id, id))
      )
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/modules/reorder]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
