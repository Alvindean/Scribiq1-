import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons, projects, profiles, renderJobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadToR2 } from "@/lib/media/r2";

// This route uses Node.js-only packages (@remotion/renderer, @remotion/bundler).
export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let jobId: string;
  try {
    const body = (await request.json()) as { jobId?: string };
    if (!body.jobId) throw new Error("Missing jobId");
    jobId = body.jobId;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Look up caller's org ──────────────────────────────────────────────────
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return Response.json({ error: "No organisation found" }, { status: 400 });
  }
  const orgId = profile.orgId;

  // ── Look up the render job ────────────────────────────────────────────────
  const [renderJob] = await db
    .select({
      id: renderJobs.id,
      lessonId: renderJobs.lessonId,
      projectId: renderJobs.projectId,
      compositionId: renderJobs.compositionId,
      status: renderJobs.status,
    })
    .from(renderJobs)
    .where(eq(renderJobs.id, jobId))
    .limit(1);

  if (!renderJob) {
    return Response.json({ error: "Render job not found" }, { status: 404 });
  }

  // Verify the job belongs to a project in the caller's org
  const [project] = await db
    .select({ id: projects.id, orgId: projects.orgId, title: projects.title, niche: projects.niche })
    .from(projects)
    .where(eq(projects.id, renderJob.projectId))
    .limit(1);

  if (!project || project.orgId !== orgId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Look up the lesson ────────────────────────────────────────────────────
  const lessonId = renderJob.lessonId;
  if (!lessonId) {
    return Response.json({ error: "Render job has no associated lesson" }, { status: 400 });
  }

  const [lesson] = await db
    .select({
      id: lessons.id,
      title: lessons.title,
      script: lessons.script,
      voiceoverUrl: lessons.voiceoverUrl,
    })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  // ── Mark job as rendering ─────────────────────────────────────────────────
  await db
    .update(renderJobs)
    .set({ status: "rendering", startedAt: new Date() })
    .where(eq(renderJobs.id, jobId));

  // ── Render ────────────────────────────────────────────────────────────────
  const outputPath = `/tmp/render-${jobId}.mp4`;
  const compositionId = renderJob.compositionId ?? "LessonVideo";

  try {
    // Dynamically import Node.js-only Remotion packages so the module can be
    // parsed at build time even when the edge runtime is active for other routes.
    const { bundle } = await import("@remotion/bundler");
    const { selectComposition, renderMedia } = await import("@remotion/renderer");

    // Build (or re-use a cached build of) the Remotion bundle.
    const entryPoint = path.join(process.cwd(), "src", "remotion", "index.ts");
    const bundleLocation = await bundle({
      entryPoint,
      onProgress: () => undefined,
    });

    // Resolve props that will be passed into the composition.
    const inputProps: Record<string, unknown> = {
      title: lesson.title,
      script: lesson.script ?? "",
      modules: project.title,
    };

    // selectComposition evaluates the composition and returns its VideoConfig
    // (including the resolved durationInFrames).
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });

    // Render the video to a local temp file.
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
    });

    // ── Upload to R2 ────────────────────────────────────────────────────────
    const r2Key = `${orgId}/${renderJob.projectId}/renders/${jobId}.mp4`;
    const fileBuffer = await fs.readFile(outputPath);

    const outputUrl = await uploadToR2({
      key: r2Key,
      body: fileBuffer,
      contentType: "video/mp4",
      metadata: {
        jobId,
        lessonId,
        projectId: renderJob.projectId,
        orgId,
      },
    });

    // ── Clean up temp file ──────────────────────────────────────────────────
    await fs.unlink(outputPath).catch(() => undefined);

    // ── Update job to complete ──────────────────────────────────────────────
    await db
      .update(renderJobs)
      .set({ status: "complete", outputUrl, completedAt: new Date() })
      .where(eq(renderJobs.id, jobId));

    // ── Update lesson with video URL ────────────────────────────────────────
    await db
      .update(lessons)
      .set({ videoUrl: outputUrl, status: "rendered" })
      .where(eq(lessons.id, lessonId));

    return Response.json({ jobId, status: "complete", outputUrl }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    // Mark job as failed
    await db
      .update(renderJobs)
      .set({ status: "failed", errorMessage, completedAt: new Date() })
      .where(eq(renderJobs.id, jobId));

    // Best-effort cleanup of temp file
    await fs.unlink(outputPath).catch(() => undefined);

    return Response.json(
      { error: "Render failed", details: errorMessage },
      { status: 500 }
    );
  }
}
