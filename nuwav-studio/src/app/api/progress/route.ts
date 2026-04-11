/**
 * /api/progress — lesson progress sync endpoint.
 *
 * Authenticated users can read/write progress server-side.
 * Progress is stored in the organization's `settings` JSONB column under
 * the key `progress.<courseSlug>` as an array of completed lesson slugs.
 *
 * This is a stub that can be upgraded to a dedicated DB table later.
 * Unauthenticated requests receive a 401 so the client falls back gracefully
 * to localStorage-only mode.
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { organizations, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ProgressMap = Record<string, string[]>;

function getProgressMap(settings: unknown): ProgressMap {
  if (
    settings !== null &&
    typeof settings === "object" &&
    "progress" in settings &&
    typeof (settings as Record<string, unknown>).progress === "object" &&
    (settings as Record<string, unknown>).progress !== null
  ) {
    return (settings as { progress: ProgressMap }).progress;
  }
  return {};
}

async function getOrgForUser(userId: string) {
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!profile?.orgId) return null;

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, profile.orgId))
    .limit(1);

  return org ?? null;
}

// ---------------------------------------------------------------------------
// GET /api/progress?courseSlug=xxx
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseSlug = request.nextUrl.searchParams.get("courseSlug");
  if (!courseSlug) {
    return Response.json({ error: "Missing courseSlug" }, { status: 400 });
  }

  try {
    const org = await getOrgForUser(session.user.id);
    if (!org) {
      // No org — return empty progress; client uses localStorage
      return Response.json({ courseSlug, completedLessons: [] });
    }

    const progressMap = getProgressMap(org.settings);
    const completedLessons = progressMap[courseSlug] ?? [];

    return Response.json({ courseSlug, completedLessons });
  } catch (err) {
    console.error("[GET /api/progress]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/progress
// Body: { courseSlug: string; lessonSlug: string; completed: boolean }
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      courseSlug?: string;
      lessonSlug?: string;
      completed?: boolean;
    };

    const { courseSlug, lessonSlug, completed } = body;

    if (!courseSlug || !lessonSlug || typeof completed !== "boolean") {
      return Response.json(
        { error: "Missing required fields: courseSlug, lessonSlug, completed" },
        { status: 400 }
      );
    }

    const org = await getOrgForUser(session.user.id);
    if (!org) {
      // No org found — echo the request back (client continues with localStorage)
      return Response.json({ courseSlug, lessonSlug, completed });
    }

    const existingSettings =
      typeof org.settings === "object" && org.settings !== null
        ? (org.settings as Record<string, unknown>)
        : {};

    const progressMap = getProgressMap(org.settings);
    const current = progressMap[courseSlug] ?? [];

    const next = completed
      ? current.includes(lessonSlug)
        ? current
        : [...current, lessonSlug]
      : current.filter((s) => s !== lessonSlug);

    const updatedSettings = {
      ...existingSettings,
      progress: {
        ...progressMap,
        [courseSlug]: next,
      },
    };

    await db
      .update(organizations)
      .set({ settings: updatedSettings })
      .where(eq(organizations.id, org.id));

    return Response.json({
      courseSlug,
      lessonSlug,
      completed,
      completedLessons: next,
    });
  } catch (err) {
    console.error("[POST /api/progress]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
