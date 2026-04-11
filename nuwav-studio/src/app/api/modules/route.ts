import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { modules, projects, profiles, lessons } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

// POST /api/modules — create a new module
export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      projectId?: unknown;
      title?: unknown;
      type?: unknown;
    };

    const projectId =
      typeof body.projectId === "string" ? body.projectId.trim() : "";
    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const type =
      typeof body.type === "string" ? body.type.trim() : "lesson";

    if (!projectId) {
      return Response.json({ error: "projectId is required" }, { status: 400 });
    }
    if (!title) {
      return Response.json({ error: "title is required" }, { status: 400 });
    }

    const validTypes = ["intro", "lesson", "cta", "testimonial", "bonus", "outro"] as const;
    const safeType = (validTypes as readonly string[]).includes(type)
      ? (type as (typeof validTypes)[number])
      : "lesson";

    // Verify project belongs to the caller's org
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

    // Determine next order value
    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(modules)
      .where(eq(modules.projectId, projectId));

    const [newModule] = await db
      .insert(modules)
      .values({
        projectId,
        title,
        type: safeType,
        order: currentCount,
      })
      .returning();

    return Response.json({ module: { ...newModule, lessons: [] } }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/modules]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
