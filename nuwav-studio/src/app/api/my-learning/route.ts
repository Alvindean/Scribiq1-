/**
 * GET /api/my-learning?email=xxx
 *
 * Returns the enrolled courses (with published page content) for a given
 * student email.  No authentication required — students don't have accounts.
 * The email is treated as the student identifier.
 */

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { enrollments, publishedPages, projects, lessons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface CoursePortalContent {
  checkout_slug?: string;
  instructor_name?: string;
  description?: string;
  hero_image?: string;
}

export async function GET(request: NextRequest): Promise<Response> {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return Response.json({ error: "Missing email parameter" }, { status: 400 });
  }

  // 1. Fetch all enrollments for this student
  const studentEnrollments = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.studentEmail, email));

  if (studentEnrollments.length === 0) {
    return Response.json({ courses: [] });
  }

  // 2. For each enrollment, look up the published course_portal page + project
  const courses = await Promise.all(
    studentEnrollments.map(async (enrollment) => {
      // Find the published page for this course slug & project
      const [page] = await db
        .select()
        .from(publishedPages)
        .where(
          and(
            eq(publishedPages.slug, enrollment.courseSlug),
            eq(publishedPages.projectId, enrollment.projectId),
            eq(publishedPages.pageType, "course_portal"),
            eq(publishedPages.isLive, true)
          )
        )
        .limit(1);

      if (!page) return null;

      // Fetch the project title
      const [project] = await db
        .select({ title: projects.title, niche: projects.niche })
        .from(projects)
        .where(eq(projects.id, enrollment.projectId))
        .limit(1);

      if (!project) return null;

      // Count lessons in this project
      const projectLessons = await db
        .select({ id: lessons.id, thumbnailUrl: lessons.thumbnailUrl })
        .from(lessons)
        .where(eq(lessons.projectId, enrollment.projectId));

      const lessonCount = projectLessons.length;

      // Pick the first available thumbnail as the course thumbnail
      const thumbnail =
        (page.content as CoursePortalContent).hero_image ??
        projectLessons.find((l) => l.thumbnailUrl)?.thumbnailUrl ??
        null;

      return {
        courseSlug: enrollment.courseSlug,
        projectId: enrollment.projectId,
        projectTitle: project.title,
        niche: project.niche,
        content: page.content,
        enrolledAt: enrollment.enrolledAt,
        lessonCount,
        thumbnail,
      };
    })
  );

  // Filter nulls (pages that are no longer live, etc.)
  const liveCourses = courses.filter(Boolean);

  return Response.json({ courses: liveCourses });
}
