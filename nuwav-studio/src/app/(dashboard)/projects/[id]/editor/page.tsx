import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projects, modules, lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { EditorLayout } from "@/components/editor/EditorLayout";
import type { ProjectWithModules } from "@/types/project";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) notFound();

  const projectModules = await db
    .select()
    .from(modules)
    .where(eq(modules.projectId, id))
    .orderBy(modules.order);

  const projectLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.projectId, id))
    .orderBy(lessons.order);

  const modulesWithLessons = projectModules.map((mod) => ({
    ...mod,
    lessons: projectLessons.filter((l) => l.moduleId === mod.id),
  }));

  const typedProject = {
    ...project,
    modules: modulesWithLessons,
  } as unknown as ProjectWithModules;

  return <EditorLayout project={typedProject} modules={modulesWithLessons} />;
}
