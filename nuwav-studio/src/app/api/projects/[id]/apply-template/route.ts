import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { modules, lessons, projects, profiles } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { getTemplateById } from "@/lib/templates";

// Map template module types → DB-valid module types
type DbModuleType = "intro" | "lesson" | "cta" | "testimonial" | "bonus" | "outro";

function toDbModuleType(type: "intro" | "core" | "outro" | "bonus"): DbModuleType {
  if (type === "core") return "lesson";
  return type;
}

// POST /api/projects/[id]/apply-template
// Body: { templateId: string }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;

  const body = (await request.json()) as { templateId?: unknown };
  const templateId =
    typeof body.templateId === "string" ? body.templateId.trim() : "";

  if (!templateId) {
    return Response.json({ error: "templateId is required" }, { status: 400 });
  }

  // Resolve caller's org
  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return Response.json({ error: "No organisation found" }, { status: 400 });
  }

  // Verify project ownership
  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.orgId, profile.orgId)))
    .limit(1);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  // Look up template
  const template = getTemplateById(templateId);
  if (!template) {
    return Response.json({ error: "Template not found" }, { status: 404 });
  }

  // Blank template — nothing to create
  if (template.modules.length === 0) {
    return Response.json({ success: true, modulesCreated: 0, lessonsCreated: 0 });
  }

  // Guard: reject if the project already has modules
  const [{ value: existingModuleCount }] = await db
    .select({ value: count() })
    .from(modules)
    .where(eq(modules.projectId, projectId));

  if (existingModuleCount > 0) {
    return Response.json(
      { error: "Project already has content" },
      { status: 400 }
    );
  }

  try {
    // Insert modules and lessons
    let totalLessonsCreated = 0;

    for (let moduleOrder = 0; moduleOrder < template.modules.length; moduleOrder++) {
      const templateModule = template.modules[moduleOrder];

      const [newModule] = await db
        .insert(modules)
        .values({
          projectId,
          title: templateModule.title,
          type: toDbModuleType(templateModule.type),
          order: moduleOrder,
        })
        .returning({ id: modules.id });

      if (!newModule) continue;

      for (
        let lessonOrder = 0;
        lessonOrder < templateModule.lessons.length;
        lessonOrder++
      ) {
        const templateLesson = templateModule.lessons[lessonOrder];

        await db.insert(lessons).values({
          moduleId: newModule.id,
          projectId,
          title: templateLesson.title,
          order: lessonOrder,
          status: "draft",
        });

        totalLessonsCreated++;
      }
    }

    return Response.json({
      success: true,
      modulesCreated: template.modules.length,
      lessonsCreated: totalLessonsCreated,
    });
  } catch (err) {
    console.error("[POST /api/projects/[id]/apply-template]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
