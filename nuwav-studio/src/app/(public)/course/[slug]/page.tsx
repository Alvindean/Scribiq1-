import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { publishedPages, projects, modules, lessons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { PlayCircle, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils/duration";
import type { Lesson } from "@/types/project";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CoursePortalPage({ params }: Props) {
  const { slug } = await params;

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

  const modulesWithLessons = projectModules.map((mod) => ({
    ...mod,
    lessons: projectLessons.filter((l) => l.moduleId === mod.id),
  }));

  const allLessons = modulesWithLessons.flatMap((m) => m.lessons) as unknown as Lesson[];
  const totalDuration = allLessons.reduce(
    (acc, l) => acc + (l.durationSeconds ?? 0),
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
            <span>{modulesWithLessons.length} modules</span>
          </div>
        </div>

        {/* Modules and lessons */}
        <div className="space-y-4">
          {modulesWithLessons.map((module) => (
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
                      {lesson.durationSeconds && (
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(lesson.durationSeconds)}
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
