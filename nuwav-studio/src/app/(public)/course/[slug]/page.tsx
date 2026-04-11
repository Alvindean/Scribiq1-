import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import {
  publishedPages,
  projects,
  modules,
  lessons,
  organizations,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  PlayCircle,
  Clock,
  BookOpen,
  Users,
  CalendarDays,
  Unlock,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration, formatMinutes } from "@/lib/utils/duration";
import type { Lesson } from "@/types/project";
import CourseProgress from "./CourseProgress";

interface Props {
  params: Promise<{ slug: string }>;
}

interface CoursePortalContent {
  checkout_slug?: string;
  instructor_name?: string;
  description?: string;
  /** Optional OG / hero image URL set by the course publisher */
  hero_image?: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

  if (!page) {
    return { title: "Course Not Found" };
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  if (!project) {
    return { title: "Course Not Found" };
  }

  const content = page.content as CoursePortalContent;
  const description =
    content.description ??
    (project.niche
      ? `Free course on ${project.niche}${project.targetAudience ? ` for ${project.targetAudience}` : ""}.`
      : `Enroll in ${project.title} — a free online course.`);

  // Prefer an explicit hero_image set in the page content, then fall back to
  // the thumbnail of the first lesson in this project.
  let ogImage: string | undefined = content.hero_image;
  if (!ogImage) {
    const [firstLesson] = await db
      .select({ thumbnailUrl: lessons.thumbnailUrl })
      .from(lessons)
      .where(eq(lessons.projectId, project.id))
      .orderBy(lessons.order)
      .limit(1);
    ogImage = firstLesson?.thumbnailUrl ?? undefined;
  }

  const title = `${project.title} — Free Course`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
      }),
    },
  };
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

  // Fetch org name to use as instructor / creator name
  const [org] = await db
    .select({ name: organizations.name })
    .from(organizations)
    .where(eq(organizations.id, project.orgId))
    .limit(1);

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
    lessons: projectLessons
      .filter((l) => l.moduleId === mod.id)
      .sort((a, b) => a.order - b.order),
  }));

  const allLessons = modulesWithLessons.flatMap((m) => m.lessons) as unknown as Lesson[];
  const totalDuration = allLessons.reduce(
    (acc, l) => acc + (l.durationSeconds ?? 0),
    0
  );

  const content = page.content as CoursePortalContent;

  const checkoutSlug = content.checkout_slug ?? null;
  const instructorName =
    content.instructor_name ?? org?.name ?? null;
  const description =
    content.description ??
    (project.targetAudience ? `Designed for ${project.targetAudience}` : null);

  const firstLesson = allLessons[0] ?? null;

  // Last updated: prefer page.updatedAt, fall back to project.updatedAt
  const lastUpdated = page.updatedAt ?? project.updatedAt ?? null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top nav */}
      <header className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <span className="font-bold text-base truncate">{project.title}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress bar — rendered client-side from localStorage */}
        {allLessons.length > 0 && (
          <CourseProgress slug={slug} totalLessons={allLessons.length} />
        )}

        {/* Course hero */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3 capitalize">
            {project.niche ?? "Online Course"}
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
            {project.title}
          </h1>

          {description && (
            <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {instructorName && (
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0" />
                {instructorName}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              {allLessons.length} lesson{allLessons.length !== 1 ? "s" : ""}
              {modulesWithLessons.length > 1 &&
                ` across ${modulesWithLessons.length} modules`}
            </span>
            {totalDuration > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {formatMinutes(totalDuration)} total
              </span>
            )}
            {lastUpdated && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                Updated{" "}
                {new Date(lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* CTA — enroll or start */}
        {checkoutSlug ? (
          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold"
            >
              <Link href={`/checkout/${checkoutSlug}`}>
                Enroll Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {firstLesson && (
              <Button asChild size="lg" variant="outline">
                <Link href={`/course/${slug}/${firstLesson.id}`}>
                  Preview First Lesson
                </Link>
              </Button>
            )}
          </div>
        ) : firstLesson ? (
          <div className="mb-8">
            <Button
              asChild
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold"
            >
              <Link href={`/course/${slug}/${firstLesson.id}`}>
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}

        {/* Module accordion */}
        <div className="space-y-3">
          {modulesWithLessons.map((module, idx) => (
            <details
              key={module.id}
              className="group rounded-xl border overflow-hidden"
              open={idx === 0}
            >
              <summary className="flex items-center justify-between px-4 py-3 bg-muted/50 cursor-pointer select-none list-none hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {module.title}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {module.lessons.length} lesson
                    {module.lessons.length !== 1 ? "s" : ""}
                    {module.lessons.some((l) => (l as unknown as Lesson).durationSeconds) &&
                      ` · ${formatDuration(
                        module.lessons.reduce(
                          (acc, l) => acc + ((l as unknown as Lesson).durationSeconds ?? 0),
                          0
                        )
                      )}`}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
              </summary>

              <div className="divide-y">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/course/${slug}/${lesson.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group/lesson"
                  >
                    <PlayCircle className="h-5 w-5 text-violet-500 shrink-0" />
                    <span className="flex-1 text-sm font-medium group-hover/lesson:text-violet-600 dark:group-hover/lesson:text-violet-400 truncate">
                      {lesson.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {(lesson as unknown as Lesson).durationSeconds ? (
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(
                            (lesson as unknown as Lesson).durationSeconds!
                          )}
                        </span>
                      ) : null}
                      {/* Lock icon placeholder for future enrollment gating — shows unlocked for now */}
                      <Unlock className="h-3.5 w-3.5 text-muted-foreground/50" />
                    </div>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA repeat for long pages */}
        {allLessons.length > 5 && (
          <div className="mt-10 rounded-xl border bg-muted/30 p-6 text-center">
            <p className="font-semibold mb-1">Ready to start?</p>
            <p className="text-sm text-muted-foreground mb-4">
              {allLessons.length} lessons ·{" "}
              {totalDuration > 0 ? formatMinutes(totalDuration) : "Self-paced"}
            </p>
            {checkoutSlug ? (
              <Button
                asChild
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold"
              >
                <Link href={`/checkout/${checkoutSlug}`}>
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : firstLesson ? (
              <Button
                asChild
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold"
              >
                <Link href={`/course/${slug}/${firstLesson.id}`}>
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
