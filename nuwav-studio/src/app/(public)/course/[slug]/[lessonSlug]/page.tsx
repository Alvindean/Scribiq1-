import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { publishedPages, projects, modules, lessons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
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

  if (!page) notFound();

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  if (!project) notFound();

  const projectModules = await db
    .select()
    .from(modules)
    .where(eq(modules.projectId, project.id))
    .orderBy(modules.order);

  const projectLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.projectId, project.id))
    .orderBy(lessons.order);

  const allLessons = projectLessons.sort((a, b) => a.order - b.order);

  // Suppress unused variable warning
  void projectModules;

  const lesson = allLessons.find((l) => l.id === lessonSlug);
  if (!lesson) notFound();

  const currentIdx = allLessons.indexOf(lesson);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/course/${slug}`} className="text-sm font-medium hover:text-violet-600 flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            {project.title}
          </Link>
          <span className="text-sm text-muted-foreground">
            {currentIdx + 1} / {allLessons.length}
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>

        {/* Video player */}
        {lesson.videoUrl ? (
          <video
            src={lesson.videoUrl}
            controls
            className="w-full rounded-xl aspect-video bg-black mb-6"
          />
        ) : (
          <div className="w-full aspect-video rounded-xl bg-muted flex items-center justify-center mb-6">
            <p className="text-muted-foreground text-sm">Video not yet rendered</p>
          </div>
        )}

        {/* Script / notes */}
        {lesson.script && (
          <div className="rounded-xl border p-6 mb-6">
            <h2 className="font-semibold mb-3 text-sm">Lesson Notes</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {lesson.script
                .replace(/\[TITLE CARD:[^\]]*\]/g, "")
                .replace(/\[SLIDE:[^\]]*\]/g, "")
                .replace(/\[VISUAL:[^\]]*\]/g, "")
                .replace(/\[CTA:[^\]]*\]/g, "")
                .replace(/\[PAUSE\]/g, "")
                .trim()}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevLesson ? (
            <Link href={`/course/${slug}/${prevLesson.id}`}>
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link href={`/course/${slug}/${nextLesson.id}`}>
              <Button className="bg-violet-600 hover:bg-violet-700">
                Next Lesson
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Link href={`/course/${slug}`}>
              <Button className="bg-violet-600 hover:bg-violet-700">
                Back to Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
