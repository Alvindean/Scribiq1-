import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, projects, modules, lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getTemplateById } from "@/lib/templates";

// ─── Module type mapping ───────────────────────────────────────────────────────
// CourseTemplate uses "core" which is not in the DB enum — map to "lesson".
const VALID_MODULE_TYPES = [
  "intro",
  "lesson",
  "cta",
  "testimonial",
  "bonus",
  "outro",
] as const;
type DbModuleType = (typeof VALID_MODULE_TYPES)[number];

function toDbModuleType(t: string): DbModuleType {
  if ((VALID_MODULE_TYPES as readonly string[]).includes(t)) {
    return t as DbModuleType;
  }
  return "lesson";
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type: "course" | "vsl" | "hybrid";
      title: string;
      niche?: string | null;
      targetAudience?: string | null;
      tone?: string;
      durationTarget?: number | null;
      templateId?: string | null;
    };

    const [profile] = await db
      .select({ orgId: profiles.orgId })
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);

    if (!profile?.orgId) {
      return Response.json({ error: "No organisation found" }, { status: 400 });
    }

    const [project] = await db
      .insert(projects)
      .values({
        orgId: profile.orgId,
        createdBy: session.user.id,
        type: body.type,
        title: body.title,
        niche: body.niche ?? null,
        targetAudience: body.targetAudience ?? null,
        tone: body.tone ?? "professional",
        durationTarget: body.durationTarget ?? null,
        templateId: body.templateId ?? null,
        status: "draft",
      })
      .returning({ id: projects.id });

    if (!project) {
      return Response.json({ error: "Failed to create project" }, { status: 500 });
    }

    // ── Apply template if one was selected ──────────────────────────────────
    const templateId = body.templateId;
    if (templateId && templateId !== "blank") {
      const template = getTemplateById(templateId);
      if (template && template.modules.length > 0) {
        for (
          let moduleIdx = 0;
          moduleIdx < template.modules.length;
          moduleIdx++
        ) {
          const tplModule = template.modules[moduleIdx];

          const [newModule] = await db
            .insert(modules)
            .values({
              projectId: project.id,
              title: tplModule.title,
              type: toDbModuleType(tplModule.type),
              order: moduleIdx,
            })
            .returning({ id: modules.id });

          if (!newModule) continue;

          for (
            let lessonIdx = 0;
            lessonIdx < tplModule.lessons.length;
            lessonIdx++
          ) {
            const tplLesson = tplModule.lessons[lessonIdx];
            await db.insert(lessons).values({
              moduleId: newModule.id,
              projectId: project.id,
              title: tplLesson.title,
              order: lessonIdx,
              status: "draft",
            });
          }
        }
      }
    }

    return Response.json({ id: project.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/projects]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
