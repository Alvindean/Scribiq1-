import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import type { VisualSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return Response.json({ error: "Lesson ID is required" }, { status: 400 });
  }

  let visualSettings: VisualSettings;
  try {
    const body = (await request.json()) as { visualSettings?: unknown };
    if (!body.visualSettings || typeof body.visualSettings !== "object") {
      throw new Error("visualSettings object is required");
    }
    const raw = body.visualSettings as Record<string, unknown>;

    // Validate and sanitise each field
    visualSettings = {};

    if (typeof raw.backgroundColor === "string") {
      visualSettings.backgroundColor = raw.backgroundColor.slice(0, 20);
    }
    if (typeof raw.backgroundImageUrl === "string") {
      visualSettings.backgroundImageUrl = raw.backgroundImageUrl.slice(0, 1000);
    }
    if (typeof raw.backgroundImageThumb === "string") {
      visualSettings.backgroundImageThumb = raw.backgroundImageThumb.slice(0, 1000);
    }
    if (
      raw.titlePosition === "top" ||
      raw.titlePosition === "center" ||
      raw.titlePosition === "bottom"
    ) {
      visualSettings.titlePosition = raw.titlePosition;
    }
    if (raw.textColor === "light" || raw.textColor === "dark") {
      visualSettings.textColor = raw.textColor;
    }
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid request body" },
      { status: 400 }
    );
  }

  // Verify the lesson exists
  const [lesson] = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(eq(lessons.id, id))
    .limit(1);

  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  try {
    await db
      .update(lessons)
      .set({ visualSettings, updatedAt: new Date() })
      .where(eq(lessons.id, id));

    return Response.json({ success: true, visualSettings });
  } catch (err) {
    // Column may not exist yet (pre-migration) — return success so UI can fall back to localStorage
    console.error("[visuals PATCH] DB update failed:", err);
    return Response.json({ success: true, visualSettings, warning: "Persisted locally only" });
  }
}
