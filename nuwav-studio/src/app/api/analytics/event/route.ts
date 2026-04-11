import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";
import { memoryRateLimit } from "@/lib/ratelimit/memory";

export const runtime = "nodejs";

// POST /api/analytics/event — public, no auth required
export async function POST(request: NextRequest): Promise<Response> {
  // Rate-limit by IP: 60 events per minute per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = memoryRateLimit(`analytics:event:${ip}`, 60, 60_000);
  if (!rl.success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    projectId,
    courseSlug,
    lessonId,
    event,
    studentEmail,
    metadata,
  } = body as Record<string, unknown>;

  // Required fields
  if (typeof projectId !== "string" || !projectId.trim()) {
    return Response.json({ error: "projectId is required" }, { status: 400 });
  }
  if (typeof event !== "string" || !event.trim()) {
    return Response.json({ error: "event is required" }, { status: 400 });
  }

  // Whitelist valid event types
  const validEvents = ["lesson_view", "lesson_complete", "course_view", "enrollment"] as const;
  if (!(validEvents as readonly string[]).includes(event)) {
    return Response.json({ error: "Invalid event type" }, { status: 400 });
  }

  await db.insert(analyticsEvents).values({
    projectId: projectId.trim(),
    courseSlug: typeof courseSlug === "string" ? courseSlug.trim() || null : null,
    lessonId: typeof lessonId === "string" ? lessonId.trim() || null : null,
    event: event.trim(),
    studentEmail: typeof studentEmail === "string" ? studentEmail.trim() || null : null,
    metadata: metadata !== undefined && metadata !== null ? (metadata as object) : null,
  });

  return Response.json({ success: true }, { status: 201 });
}
