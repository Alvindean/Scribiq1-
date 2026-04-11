import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projects, modules, lessons } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  LayoutList,
  FileText,
  Clock,
  CheckCircle2,
  Circle,
  PencilLine,
  Sparkles,
  Globe,
  Mic,
} from "lucide-react";
import type {
  ProjectWithModules,
  ProjectStatus,
  LessonStatus,
} from "@/types/project";
import { ProjectActions } from "./ProjectActions";
import { DangerZone } from "./DangerZone";

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

function lessonScriptStatus(lesson: { script: string | null }): {
  label: string;
  color: string;
} {
  if (!lesson.script || lesson.script.trim() === "") {
    return { label: "Empty", color: "text-zinc-400" };
  }
  const words = lesson.script.trim().split(/\s+/).length;
  if (words < 50) return { label: "Draft", color: "text-amber-500" };
  return { label: "Complete", color: "text-emerald-500" };
}

function lessonVoiceoverStatus(lesson: { voiceoverUrl: string | null }): {
  label: string;
  color: string;
} {
  if (!lesson.voiceoverUrl) {
    return { label: "None", color: "text-zinc-400" };
  }
  return { label: "Ready", color: "text-emerald-500" };
}

function relativeTime(date: Date | null | string): string {
  if (!date) return "unknown";
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}

// ─── Status timeline config ───────────────────────────────────────────────────

type TimelineStep = {
  key: ProjectStatus | string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const TIMELINE_STEPS: TimelineStep[] = [
  { key: "draft", label: "Draft", icon: PencilLine },
  { key: "generating", label: "Generated", icon: Sparkles },
  { key: "review", label: "Voiceover Ready", icon: Mic },
  { key: "published", label: "Published", icon: Globe },
];

function timelineStepIndex(status: ProjectStatus): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
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
    lessons: projectLessons
      .filter((l) => l.moduleId === mod.id)
      .sort((a, b) => a.order - b.order),
  }));

  const typedProject = {
    ...project,
    modules: modulesWithLessons,
  } as unknown as ProjectWithModules;

  // ── Derived metrics ──────────────────────────────────────────────────────────
  const totalLessons = projectLessons.length;
  const totalModules = projectModules.length;

  const totalWords = projectLessons.reduce((sum, l) => {
    if (!l.script?.trim()) return sum;
    return sum + l.script.trim().split(/\s+/).length;
  }, 0);

  const lessonsWithScript = projectLessons.filter(
    (l) => l.script && l.script.trim() !== ""
  ).length;

  const completionPct =
    totalLessons === 0 ? 0 : Math.round((lessonsWithScript / totalLessons) * 100);

  // Estimate: ~130 words per minute narration
  const estDurationMin =
    totalWords > 0 ? Math.round(totalWords / 130) : typedProject.durationTarget ?? 0;

  // ── Recent activity: last 3 lesson saves ─────────────────────────────────────
  const recentActivity = [...projectLessons]
    .filter((l) => l.updatedAt)
    .sort(
      (a, b) =>
        new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
    )
    .slice(0, 3);

  // ── Last edited lesson (for Continue Editing card) ────────────────────────────
  const lastEditedLesson = recentActivity[0] ?? null;

  // ── Timeline ──────────────────────────────────────────────────────────────────
  const currentStepIdx = timelineStepIndex(typedProject.status);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{typedProject.title}</h1>
            <Badge variant={statusVariant(typedProject.status)}>
              {typedProject.status}
            </Badge>
          </div>
          <p className="text-muted-foreground capitalize">
            {typedProject.type} · {typedProject.niche ?? "No niche"} ·{" "}
            {typedProject.targetAudience ?? "General audience"}
          </p>
        </div>
        <ProjectActions id={id} />
      </div>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Modules",
            value: totalModules,
            icon: LayoutList,
          },
          {
            label: "Lessons",
            value: totalLessons,
            icon: BookOpen,
          },
          {
            label: "Word Count",
            value: totalWords > 0 ? totalWords.toLocaleString() : "—",
            icon: FileText,
          },
          {
            label: "Est. Duration",
            value: estDurationMin > 0 ? `${estDurationMin} min` : "—",
            icon: Clock,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Completion progress ─────────────────────────────────────────────── */}
      {totalLessons > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Script completion</span>
            <span className="font-medium">
              {lessonsWithScript}/{totalLessons} lessons · {completionPct}%
            </span>
          </div>
          <Progress
            value={completionPct}
            className="h-2 [&>div]:bg-violet-500"
          />
        </div>
      )}

      {/* ── Status timeline ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Project Lifecycle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex items-center gap-0">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = idx === currentStepIdx;
              const isDone = idx < currentStepIdx;
              const isLast = idx === TIMELINE_STEPS.length - 1;

              return (
                <li key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5 min-w-0">
                    <div
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        isCurrent
                          ? "border-violet-500 bg-violet-500 text-white"
                          : isDone
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800",
                      ].join(" ")}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={[
                        "text-xs font-medium text-center leading-tight",
                        isCurrent
                          ? "text-violet-600 dark:text-violet-400"
                          : isDone
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400 dark:text-zinc-500",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>
                  </div>

                  {!isLast && (
                    <div
                      className={[
                        "h-0.5 flex-1 mx-2 rounded transition-colors",
                        idx < currentStepIdx
                          ? "bg-emerald-400"
                          : "bg-zinc-200 dark:bg-zinc-700",
                      ].join(" ")}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* ── Two-column: Quick actions + Recent activity ─────────────────────── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Quick action cards */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            {/* Continue Editing */}
            <Link
              href={
                lastEditedLesson
                  ? `/projects/${id}/editor?lesson=${lastEditedLesson.id}`
                  : `/projects/${id}/editor`
              }
              className="group block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                  <PencilLine className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium group-hover:text-violet-600">
                    Continue Editing
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {lastEditedLesson
                      ? `Last: ${lastEditedLesson.title}`
                      : "Open editor"}
                  </p>
                </div>
              </div>
            </Link>

            {/* Generate / Regenerate */}
            <Link
              href={`/projects/${id}/generate`}
              className="group block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-violet-600">
                    {totalModules > 0 ? "Regenerate Content" : "Generate Content"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {totalModules > 0
                      ? `${totalModules} module${totalModules !== 1 ? "s" : ""} already generated`
                      : "Build modules & scripts with AI"}
                  </p>
                </div>
              </div>
            </Link>

            {/* Publish */}
            <Link
              href={`/projects/${id}/publish`}
              className="group block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-violet-600">
                    Publish
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                    Current status:{" "}
                    <span
                      className={
                        typedProject.status === "published"
                          ? "text-emerald-500 font-medium"
                          : "text-zinc-400"
                      }
                    >
                      {typedProject.status === "published" ? "Live" : "Draft"}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Recent Activity</h2>
          <Card>
            <CardContent className="pt-4 pb-2">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No edits yet.
                </p>
              ) : (
                <ul className="divide-y">
                  {recentActivity.map((lesson) => (
                    <li key={lesson.id} className="flex items-center gap-3 py-3">
                      <Circle className="h-2 w-2 shrink-0 fill-violet-400 text-violet-400" />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/projects/${id}/editor?lesson=${lesson.id}`}
                          className="text-sm font-medium truncate hover:underline underline-offset-2"
                        >
                          {lesson.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Updated {relativeTime(lesson.updatedAt)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={[
                          "text-xs capitalize shrink-0",
                          lesson.status === "published" ||
                          lesson.status === "rendered"
                            ? "border-emerald-400 text-emerald-500"
                            : lesson.status === "voiced" ||
                              lesson.status === "scripted"
                            ? "border-amber-400 text-amber-500"
                            : "",
                        ].join(" ")}
                      >
                        {lesson.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Module / lesson overview table ──────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Modules &amp; Lessons</h2>
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
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-8">
                    #
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Module / Lesson
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">
                    Script
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">
                    Voiceover
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {modulesWithLessons.map((mod) => (
                  <>
                    {/* Module row */}
                    <tr
                      key={`mod-${mod.id}`}
                      className="bg-muted/20"
                    >
                      <td className="px-4 py-2.5 text-muted-foreground font-medium">
                        {mod.order + 1}
                      </td>
                      <td
                        colSpan={4}
                        className="px-4 py-2.5 font-semibold flex items-center gap-2"
                      >
                        {mod.title}
                        <Badge
                          variant="outline"
                          className="capitalize text-xs ml-1"
                        >
                          {mod.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-normal">
                          {mod.lessons.length} lesson
                          {mod.lessons.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                    </tr>

                    {/* Lesson rows */}
                    {mod.lessons.map((lesson) => {
                      const scriptSt = lessonScriptStatus(lesson);
                      const voiceSt = lessonVoiceoverStatus(lesson);
                      return (
                        <tr
                          key={`lesson-${lesson.id}`}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-2.5 text-muted-foreground pl-8">
                            {lesson.order + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <Link
                              href={`/projects/${id}/editor?lesson=${lesson.id}`}
                              className="hover:underline underline-offset-2 font-medium"
                            >
                              {lesson.title}
                            </Link>
                          </td>
                          <td className="px-4 py-2.5 hidden sm:table-cell">
                            <span
                              className={`text-xs font-medium ${scriptSt.color}`}
                            >
                              {scriptSt.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 hidden sm:table-cell">
                            <span
                              className={`text-xs font-medium ${voiceSt.color}`}
                            >
                              {voiceSt.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={[
                                "text-xs capitalize",
                                lesson.status === "published" ||
                                lesson.status === "rendered"
                                  ? "border-emerald-400 text-emerald-500"
                                  : lesson.status === "voiced" ||
                                    lesson.status === "scripted"
                                  ? "border-amber-400 text-amber-500"
                                  : "",
                              ].join(" ")}
                            >
                              {lesson.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Danger zone ─────────────────────────────────────────────────────── */}
      <DangerZone projectId={id} projectTitle={typedProject.title} />
    </div>
  );
}
