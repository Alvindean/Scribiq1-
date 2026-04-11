import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, projects, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let lessonId: string;
  let lyrics: string;

  try {
    const body = (await request.json()) as {
      lessonId?: string;
      lyrics?: string;
    };

    lessonId = body.lessonId?.trim() ?? "";
    lyrics = body.lyrics?.trim() ?? "";

    if (!lessonId) throw new Error("lessonId is required");
    if (!lyrics) throw new Error("lyrics is required");
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }

  // Resolve the user's org
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return Response.json({ error: "No organisation found" }, { status: 400 });
  }

  // Verify lesson exists and belongs to the user's org
  const [lesson] = await db
    .select({ id: lessons.id, projectId: lessons.projectId })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  const [project] = await db
    .select({ orgId: projects.orgId })
    .from(projects)
    .where(eq(projects.id, lesson.projectId))
    .limit(1);

  if (!project || project.orgId !== profile.orgId) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Save lyrics to the lesson's script field
  await db
    .update(lessons)
    .set({ script: lyrics })
    .where(eq(lessons.id, lessonId));

  return Response.json({ success: true });
}
