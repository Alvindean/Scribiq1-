import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");
  const email = searchParams.get("email");

  if (!courseSlug || !email) {
    return Response.json(
      { error: "courseSlug and email query params are required" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.courseSlug, courseSlug),
        eq(enrollments.studentEmail, email.toLowerCase().trim())
      )
    )
    .limit(1);

  return Response.json({ enrolled: !!existing });
}
