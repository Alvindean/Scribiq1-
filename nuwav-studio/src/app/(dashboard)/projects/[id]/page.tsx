import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projects, modules, lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectWithModules, ProjectStatus, LessonStatus } from "@/types/project";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusVariant(
  status: ProjectStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "published":
      return "default";
    case "generating":
    case "review":
      return "secondary";
    case "archived":
      return "destructive";
    default:
      return "outline";
  }
}

function lessonStatusVariant(
  status: LessonStatus
): "default" | "secondary" | "outline" {
  switch (status) {
    case "published":
    case "rendered":
      return "default";
    case "voiced":
    case "scripted":
      return "secondary";
    default:
      return "outline";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage({
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

  const totalLessons = modulesWithLessons.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );
  const publishedLessons = modulesWithLessons.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.status === "published").length,
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{typedProject.title}</h1>
            <Badge variant={statusVariant(typedProject.status)}>
              {typedProject.status}
            </Badge>
          </div>
          <p className="text-muted-foreground capitalize">
            {typedProject.type} ·{" "}
            {typedProject.niche ?? "No niche"} ·{" "}
            {publishedLessons}/{totalLessons} lessons published
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${id}/editor`}>Edit</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${id}/preview`}>Preview</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${id}/publish`}>Publish</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${id}/export`}>Export</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/projects/${id}/generate`}>Generate</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Modules", value: modulesWithLessons.length },
          { label: "Lessons", value: totalLessons },
          { label: "Published", value: publishedLessons },
          {
            label: "Duration",
            value: typedProject.durationTarget
              ? `${typedProject.durationTarget} min`
              : "—",
          },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules & Lessons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Modules</h2>
        {modulesWithLessons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No modules yet.{" "}
              <Link
                href={`/projects/${id}/generate`}
                className="underline underline-offset-2"
              >
                Generate content
              </Link>{" "}
              to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {modulesWithLessons.map((mod) => (
              <Card key={mod.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {mod.order + 1}. {mod.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {mod.lessons.length} lesson
                        {mod.lessons.length !== 1 ? "s" : ""}
                      </span>
                      <Badge variant="outline" className="capitalize text-xs">
                        {mod.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {mod.lessons.length > 0 && (
                  <CardContent className="pt-0">
                    <ul className="divide-y">
                      {mod.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex items-center justify-between py-2"
                          >
                            <Link
                              href={`/projects/${id}/editor?lesson=${lesson.id}`}
                              className="text-sm hover:underline underline-offset-2"
                            >
                              {lesson.order + 1}. {lesson.title}
                            </Link>
                            <Badge
                              variant={lessonStatusVariant(lesson.status)}
                              className="text-xs capitalize"
                            >
                              {lesson.status}
                            </Badge>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
