import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/types/project";

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("published_pages")
    .select("*, projects(*, modules(*, lessons(*)))")
    .eq("slug", slug)
    .eq("page_type", "course_portal")
    .eq("is_live", true)
    .single();

  if (!page) notFound();

  const pageData = page as unknown as { projects: unknown };
  const project = pageData.projects as {
    title: string;
    modules: Array<{ id: string; title: string; order: number; lessons: Lesson[] }>;
  };

  const allLessons = project.modules
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => m.lessons)
    .sort((a, b) => a.order - b.order);

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
        {lesson.video_url ? (
          <video
            src={lesson.video_url}
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
