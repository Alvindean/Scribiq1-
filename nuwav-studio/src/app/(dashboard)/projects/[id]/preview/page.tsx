import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectWithModules, LessonStatus } from "@/types/project";

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

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(
      `
      *,
      modules (
        *,
        lessons ( * )
      )
    `
    )
    .eq("id", id)
    .order("order", { referencedTable: "modules", ascending: true })
    .single();

  if (!project) notFound();

  const typedProject = project as unknown as ProjectWithModules;

  const firstLesson = typedProject.modules
    .flatMap((m) => m.lessons)
    .sort((a, b) => a.order - b.order)[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{typedProject.title}</h1>
          <p className="text-muted-foreground mt-1 capitalize">
            {typedProject.type} preview
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${id}/editor`}>Open Editor</Link>
        </Button>
      </div>

      {/* Video player placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="relative flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
            {firstLesson?.video_url ? (
              <video
                src={firstLesson.video_url}
                controls
                className="h-full w-full rounded-lg object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                <p className="text-sm">
                  {firstLesson
                    ? "No video rendered yet for the first lesson"
                    : "No lessons available yet"}
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/projects/${id}/generate`}>
                    Generate content
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Module & Lesson list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Content</h2>
        {typedProject.modules.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No modules yet.{" "}
            <Link
              href={`/projects/${id}/generate`}
              className="underline underline-offset-2"
            >
              Generate content
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {typedProject.modules.map((mod) => (
              <Card key={mod.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    {mod.order + 1}. {mod.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {mod.lessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No lessons in this module.
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {mod.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex items-center justify-between py-2.5"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {lesson.thumbnail_url ? (
                                <img
                                  src={lesson.thumbnail_url}
                                  alt={lesson.title}
                                  className="h-10 w-16 shrink-0 rounded object-cover"
                                />
                              ) : (
                                <div className="h-10 w-16 shrink-0 rounded bg-muted" />
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {lesson.order + 1}. {lesson.title}
                                </p>
                                {lesson.duration_seconds && (
                                  <p className="text-xs text-muted-foreground">
                                    {Math.floor(lesson.duration_seconds / 60)}m{" "}
                                    {lesson.duration_seconds % 60}s
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                              <Badge
                                variant={lessonStatusVariant(lesson.status)}
                                className="text-xs capitalize"
                              >
                                {lesson.status}
                              </Badge>
                              <Button asChild variant="ghost" size="sm">
                                <Link
                                  href={`/projects/${id}/editor?lesson=${lesson.id}`}
                                >
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
