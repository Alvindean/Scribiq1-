import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, modules, projects, profiles } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

// POST /api/lessons — create a new lesson inside a module
export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      moduleId?: unknown;
      projectId?: unknown;
      title?: unknown;
    };

    const moduleId =
      typeof body.moduleId === "string" ? body.moduleId.trim() : "";
    const projectId =
      typeof body.projectId === "string" ? body.projectId.trim() : "";
    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    if (!moduleId) {
      return Response.json({ error: "moduleId is required" }, { status: 400 });
    }
    if (!projectId) {
      return Response.json({ error: "projectId is required" }, { status: 400 });
    }
    if (!title) {
      return Response.json({ error: "title is required" }, { status: 400 });
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

    // Verify the module belongs to this project
    const [mod] = await db
      .select({ id: modules.id })
      .from(modules)
      .where(eq(modules.id, moduleId))
      .limit(1);

    if (!mod) {
      return Response.json({ error: "Module not found" }, { status: 404 });
    }

    // Determine next order value within this module
    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId));

    const [newLesson] = await db
      .insert(lessons)
      .values({
        moduleId,
        projectId,
        title,
        order: currentCount,
        status: "draft",
      })
      .returning();

    return Response.json({ lesson: newLesson }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/lessons]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
