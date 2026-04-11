import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { enrollments, publishedPages } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest): Promise<Response> {
  let body: {
    courseSlug?: string;
    studentEmail?: string;
    stripeSessionId?: string;
    studentName?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { courseSlug, studentEmail, stripeSessionId, studentName } = body;

  if (!courseSlug || !studentEmail) {
    return Response.json(
      { error: "courseSlug and studentEmail are required" },
      { status: 400 }
    );
  }

  // Resolve the course portal page to get the projectId
  const [portalPage] = await db
    .select({ projectId: publishedPages.projectId })
    .from(publishedPages)
    .where(
      and(
        eq(publishedPages.slug, courseSlug),
        eq(publishedPages.pageType, "course_portal")
      )
    )
    .limit(1);

  if (!portalPage) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }

  // Check if already enrolled
  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.courseSlug, courseSlug),
        eq(enrollments.studentEmail, studentEmail.toLowerCase().trim())
      )
    )
    .limit(1);

  if (existing) {
    return Response.json({ alreadyEnrolled: true, enrollmentId: existing.id });
  }

  // Insert new enrollment
  const [inserted] = await db
    .insert(enrollments)
    .values({
      courseSlug,
      projectId: portalPage.projectId,
      studentEmail: studentEmail.toLowerCase().trim(),
      studentName: studentName ?? null,
      stripeSessionId: stripeSessionId ?? null,
    })
    .returning({ id: enrollments.id });

  return Response.json({ success: true, enrollmentId: inserted.id });
}
