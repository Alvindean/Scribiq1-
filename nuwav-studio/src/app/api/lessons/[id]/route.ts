import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, projects, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Helper: verify the lesson belongs to the caller's org.
async function resolveLesson(
  lessonId: string,
  userId: string
): Promise<{ id: string; projectId: string } | null> {
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!profile?.orgId) return null;

  const [lesson] = await db
    .select({ id: lessons.id, projectId: lessons.projectId })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) return null;

  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(
        eq(projects.id, lesson.projectId),
        eq(projects.orgId, profile.orgId)
      )
    )
    .limit(1);

  return project ? lesson : null;
}

// PATCH /api/lessons/[id] — rename a lesson
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = (await request.json()) as { title?: unknown };
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }

  const lesson = await resolveLesson(id, session.user.id);
  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(lessons)
    .set({ title, updatedAt: new Date() })
    .where(eq(lessons.id, id))
    .returning();

  return Response.json({ lesson: updated });
}

// DELETE /api/lessons/[id] — delete a single lesson
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const lesson = await resolveLesson(id, session.user.id);
  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  await db.delete(lessons).where(eq(lessons.id, id));

  return new Response(null, { status: 204 });
}
