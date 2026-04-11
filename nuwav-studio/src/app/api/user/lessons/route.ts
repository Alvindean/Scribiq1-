import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, projects, modules, lessons } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [profile] = await db
      .select({ orgId: profiles.orgId })
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);

    if (!profile?.orgId) {
      return Response.json({ error: "No organisation found" }, { status: 400 });
    }

    const rows = await db
      .select({
        projectId: projects.id,
        projectTitle: projects.title,
        moduleId: modules.id,
        moduleTitle: modules.title,
        moduleOrder: modules.order,
        lessonId: lessons.id,
        lessonTitle: lessons.title,
        lessonOrder: lessons.order,
      })
      .from(projects)
      .innerJoin(modules, eq(modules.projectId, projects.id))
      .innerJoin(lessons, eq(lessons.moduleId, modules.id))
      .where(eq(projects.orgId, profile.orgId))
      .orderBy(asc(projects.title), asc(modules.order), asc(lessons.order));

    // Group into the expected shape
    const projectMap = new Map<
      string,
      { id: string; title: string; lessons: Array<{ id: string; title: string; moduleTitle: string }> }
    >();

    for (const row of rows) {
      if (!projectMap.has(row.projectId)) {
        projectMap.set(row.projectId, {
          id: row.projectId,
          title: row.projectTitle,
          lessons: [],
        });
      }
      projectMap.get(row.projectId)!.lessons.push({
        id: row.lessonId,
        title: row.lessonTitle,
        moduleTitle: row.moduleTitle,
      });
    }

    return Response.json({ projects: Array.from(projectMap.values()) });
  } catch (err) {
    console.error("[GET /api/user/lessons]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
