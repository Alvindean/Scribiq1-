import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, projects, profiles, lyrics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let lessonId: string;
  let lyricsContent: string;
  let projectId: string | undefined;

  try {
    const body = (await request.json()) as {
      lessonId?: string;
      lyrics?: string;
      projectId?: string;
    };

    lessonId = body.lessonId?.trim() ?? "";
    lyricsContent = body.lyrics?.trim() ?? "";
    projectId = body.projectId?.trim() || undefined;

    if (!lessonId) throw new Error("lessonId is required");
    if (!lyricsContent) throw new Error("lyrics is required");
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

  // Save lyrics to the lesson's script field (backward compat)
  await db
    .update(lessons)
    .set({ script: lyricsContent })
    .where(eq(lessons.id, lessonId));

  // Upsert into the lyrics table
  const resolvedProjectId = projectId ?? lesson.projectId;

  const [existingLyric] = await db
    .select({ id: lyrics.id, version: lyrics.version })
    .from(lyrics)
    .where(eq(lyrics.lessonId, lessonId))
    .limit(1);

  let lyricId: string;

  if (existingLyric) {
    await db
      .update(lyrics)
      .set({
        content: lyricsContent,
        version: existingLyric.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(lyrics.id, existingLyric.id));
    lyricId = existingLyric.id;
  } else {
    const [inserted] = await db
      .insert(lyrics)
      .values({
        projectId: resolvedProjectId,
        lessonId,
        content: lyricsContent,
        source: "manual",
      })
      .returning({ id: lyrics.id });
    lyricId = inserted.id;
  }

  return Response.json({ success: true, lyricId });
}
