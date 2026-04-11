import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { publishedPages, projects, modules, lessons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { LessonViewer } from "./LessonViewer";

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonSlug } = await params;

  const [page] = await db
    .select()
    .from(publishedPages)
    .where(
      and(
        eq(publishedPages.slug, slug),
        eq(publishedPages.pageType, "course_portal"),
        eq(publishedPages.isLive, true)
      )
    )
    .limit(1);

  if (!page) {
    return { title: "Lesson Not Found", robots: { index: false } };
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  if (!project) {
    return { title: "Lesson Not Found", robots: { index: false } };
  }

  const [lesson] = await db
    .select({ title: lessons.title })
    .from(lessons)
    .where(eq(lessons.id, lessonSlug))
    .limit(1);

  if (!lesson) {
    return { title: "Lesson Not Found", robots: { index: false } };
  }

  // noindex when the course portal is not live (safety check via isLive above,
  // but keep noindex on all individual lesson pages to avoid thin-content issues)
  return {
    title: `${lesson.title} — ${project.title}`,
    robots: { index: false, follow: true },
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;

  // 1. Resolve the published course portal
  const [page] = await db
    .select()
    .from(publishedPages)
    .where(
      and(
        eq(publishedPages.slug, slug),
        eq(publishedPages.pageType, "course_portal"),
        eq(publishedPages.isLive, true)
      )
    )
    .limit(1);

  if (!page) notFound();

  // 2. Load the project
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  if (!project) notFound();

  // 3. Load modules (for sidebar grouping + breadcrumb)
  const projectModules = await db
    .select()
    .from(modules)
    .where(eq(modules.projectId, project.id))
    .orderBy(modules.order);

  // 4. Load lessons ordered globally
  const projectLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.projectId, project.id))
    .orderBy(lessons.order);

  const allLessons = [...projectLessons].sort((a, b) => a.order - b.order);

  // 5. Find the current lesson (lessonSlug == lesson.id)
  const lesson = allLessons.find((l) => l.id === lessonSlug);
  if (!lesson) notFound();

  // 6. Compute prev / next
  const currentIdx = allLessons.indexOf(lesson);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // 7. Resolve module for breadcrumb
  const currentModule = projectModules.find((m) => m.id === lesson.moduleId);

  return (
    <LessonViewer
      projectId={project.id}
      courseSlug={slug}
      courseTitle={project.title}
      moduleTitle={currentModule?.title ?? ""}
      lesson={{
        id: lesson.id,
        title: lesson.title,
        videoUrl: lesson.videoUrl ?? null,
        thumbnailUrl: lesson.thumbnailUrl ?? null,
        script: lesson.script ?? null,
      }}
      allModules={projectModules.map((m) => ({
        id: m.id,
        title: m.title,
        order: m.order,
      }))}
      allLessons={allLessons.map((l) => ({
        id: l.id,
        title: l.title,
        order: l.order,
        moduleId: l.moduleId,
      }))}
      prevLesson={
        prevLesson
          ? {
              id: prevLesson.id,
              title: prevLesson.title,
              order: prevLesson.order,
              moduleId: prevLesson.moduleId,
            }
          : null
      }
      nextLesson={
        nextLesson
          ? {
              id: nextLesson.id,
              title: nextLesson.title,
              order: nextLesson.order,
              moduleId: nextLesson.moduleId,
            }
          : null
      }
      currentIndex={currentIdx}
      totalCount={allLessons.length}
    />
  );
}
