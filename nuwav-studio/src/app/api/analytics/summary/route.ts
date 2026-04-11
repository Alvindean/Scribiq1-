import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyticsEvents, profiles, projects } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export const runtime = "nodejs";

// GET /api/analytics/summary?projectId=xxx&days=30
export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId")?.trim() ?? "";
  const daysRaw = searchParams.get("days");
  const days = daysRaw ? Math.max(1, Math.min(365, parseInt(daysRaw, 10) || 30)) : 30;

  if (!projectId) {
    return Response.json({ error: "projectId is required" }, { status: 400 });
  }

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
    .where(and(eq(projects.id, projectId), eq(projects.orgId, profile.orgId)))
    .limit(1);

  if (!project) {
    return Response.json({ error: "Project not found or access denied" }, { status: 404 });
  }

  // Time window
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Fetch all events for the project in the window
  const events = await db
    .select({
      event: analyticsEvents.event,
      lessonId: analyticsEvents.lessonId,
      studentEmail: analyticsEvents.studentEmail,
      createdAt: analyticsEvents.createdAt,
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.projectId, projectId),
        gte(analyticsEvents.createdAt, since)
      )
    );

  // Aggregate top-level counts
  let totalViews = 0;
  let totalCompletions = 0;
  let enrollments = 0;
  const studentEmails = new Set<string>();
  const lessonViews = new Map<string, number>();
  const lessonCompletions = new Map<string, number>();
  const viewsByDate = new Map<string, number>();

  for (const ev of events) {
    // Track unique students
    if (ev.studentEmail) {
      studentEmails.add(ev.studentEmail);
    }

    if (ev.event === "lesson_view") {
      totalViews++;
      if (ev.lessonId) {
        lessonViews.set(ev.lessonId, (lessonViews.get(ev.lessonId) ?? 0) + 1);
      }
      // Daily aggregation
      if (ev.createdAt) {
        const dateKey = ev.createdAt.toISOString().slice(0, 10);
        viewsByDate.set(dateKey, (viewsByDate.get(dateKey) ?? 0) + 1);
      }
    } else if (ev.event === "lesson_complete") {
      totalCompletions++;
      if (ev.lessonId) {
        lessonCompletions.set(ev.lessonId, (lessonCompletions.get(ev.lessonId) ?? 0) + 1);
      }
    } else if (ev.event === "enrollment") {
      enrollments++;
    }
  }

  // Top lessons — union of all lesson IDs seen, sorted by views desc
  const allLessonIds = new Set([...lessonViews.keys(), ...lessonCompletions.keys()]);
  const topLessons = [...allLessonIds]
    .map((lessonId) => ({
      lessonId,
      views: lessonViews.get(lessonId) ?? 0,
      completions: lessonCompletions.get(lessonId) ?? 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Daily views — fill in every day in the range (0 if no views)
  const dailyViews: Array<{ date: string; views: number }> = [];
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    dailyViews.push({ date, views: viewsByDate.get(date) ?? 0 });
  }

  return Response.json({
    totalViews,
    totalCompletions,
    enrollments,
    uniqueStudents: studentEmails.size,
    topLessons,
    dailyViews,
  });
}
