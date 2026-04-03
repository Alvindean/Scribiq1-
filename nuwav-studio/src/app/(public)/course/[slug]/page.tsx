import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PlayCircle, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils/duration";
import type { Lesson } from "@/types/project";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CoursePortalPage({ params }: Props) {
  const { slug } = await params;
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
    niche: string;
    modules: Array<{
      id: string;
      title: string;
      order: number;
      lessons: Lesson[];
    }>;
  };

  const allLessons = project.modules
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => m.lessons);

  const totalDuration = allLessons.reduce(
    (acc, l) => acc + (l.duration_seconds ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <span className="font-bold text-lg">{project.title}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Course hero */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3 capitalize">
            {project.niche ?? "Online Course"}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(totalDuration)}
            </span>
            <span>{allLessons.length} lessons</span>
            <span>{project.modules.length} modules</span>
          </div>
        </div>

        {/* Modules and lessons */}
        <div className="space-y-4">
          {project.modules
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <div key={module.id} className="rounded-xl border overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 font-semibold text-sm">
                  {module.title}
                </div>
                <div className="divide-y">
                  {module.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/course/${slug}/${lesson.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group"
                      >
                        <PlayCircle className="h-5 w-5 text-violet-500 shrink-0" />
                        <span className="flex-1 text-sm font-medium group-hover:text-violet-700">
                          {lesson.title}
                        </span>
                        {lesson.duration_seconds && (
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(lesson.duration_seconds)}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
