"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Menu,
  X,
  PlayCircle,
  Lock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types passed from the server page                                   */
/* ------------------------------------------------------------------ */

export interface LessonItem {
  id: string;
  title: string;
  order: number;
  moduleId: string;
}

export interface ModuleItem {
  id: string;
  title: string;
  order: number;
}

export interface LessonViewerProps {
  projectId: string;
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  lesson: {
    id: string;
    title: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    script: string | null;
  };
  allModules: ModuleItem[];
  allLessons: LessonItem[];
  prevLesson: LessonItem | null;
  nextLesson: LessonItem | null;
  currentIndex: number;
  totalCount: number;
  /** Whether this course requires payment */
  isPaidCourse?: boolean;
  /** The checkout page slug (used for the paywall CTA link) */
  checkoutSlug?: string | null;
}

/* ------------------------------------------------------------------ */
/* Script parser                                                        */
/* ------------------------------------------------------------------ */

interface ScriptBlock {
  type: "heading" | "paragraph";
  text: string;
}

const HEADING_RE = /^\[(SCENE|SLIDE|TITLE CARD|VISUAL|CTA|PAUSE)[:\s]?([^\]]*)\]/i;

function parseScript(raw: string): ScriptBlock[] {
  const blocks: ScriptBlock[] = [];
  const lines = raw.split("\n");
  let pendingLines: string[] = [];

  const flush = () => {
    const text = pendingLines.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    pendingLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(HEADING_RE);
    if (match) {
      flush();
      const tag = match[1].toUpperCase();
      const label = match[2].trim();
      const heading = label ? `${tag}: ${label}` : tag;
      blocks.push({ type: "heading", text: heading });
    } else if (trimmed === "") {
      flush();
    } else {
      pendingLines.push(trimmed);
    }
  }
  flush();
  return blocks;
}

/* ------------------------------------------------------------------ */
/* Progress hook (localStorage)                                        */
/* ------------------------------------------------------------------ */

function useProgress(courseSlug: string) {
  const key = `soniq:progress:${courseSlug}`;

  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        setCompleted(new Set(arr));
      }
    } catch {
      // ignore corrupt data
    }
  }, [key]);

  const markComplete = useCallback(
    (lessonId: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(lessonId);
        try {
          localStorage.setItem(key, JSON.stringify([...next]));
        } catch {
          // ignore storage errors (private browsing quota etc.)
        }
        return next;
      });
    },
    [key]
  );

  const unmarkComplete = useCallback(
    (lessonId: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.delete(lessonId);
        try {
          localStorage.setItem(key, JSON.stringify([...next]));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [key]
  );

  return { completed, markComplete, unmarkComplete };
}

/* ------------------------------------------------------------------ */
/* Analytics                                                            */
/* ------------------------------------------------------------------ */

function fireAnalyticsEvent(payload: {
  projectId: string;
  courseSlug: string;
  lessonId: string;
  event: string;
  studentEmail?: string | null;
}) {
  // Fire-and-forget — never blocks the UI
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: payload.projectId,
      courseSlug: payload.courseSlug,
      lessonId: payload.lessonId,
      event: payload.event,
      studentEmail: payload.studentEmail ?? undefined,
    }),
  }).catch(() => {
    // Silently ignore network errors
  });
}

function useAnalytics(projectId: string, courseSlug: string, lessonId: string) {
  useEffect(() => {
    let studentEmail: string | null = null;
    try {
      studentEmail = localStorage.getItem("soniq:student-email");
    } catch {
      // ignore
    }
    fireAnalyticsEvent({ projectId, courseSlug, lessonId, event: "lesson_view", studentEmail });
    // Only fire on mount (lesson change) — intentionally no re-fire on prop identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, courseSlug, lessonId]);

  const trackComplete = useCallback(() => {
    let studentEmail: string | null = null;
    try {
      studentEmail = localStorage.getItem("soniq:student-email");
    } catch {
      // ignore
    }
    fireAnalyticsEvent({ projectId, courseSlug, lessonId, event: "lesson_complete", studentEmail });
  }, [projectId, courseSlug, lessonId]);

  return { trackComplete };
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export function LessonViewer({
  projectId,
  courseSlug,
  courseTitle,
  moduleTitle,
  lesson,
  allModules,
  allLessons,
  prevLesson,
  nextLesson,
  currentIndex,
  totalCount,
}: LessonViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { completed, markComplete, unmarkComplete } = useProgress(courseSlug);
  const { trackComplete } = useAnalytics(projectId, courseSlug, lesson.id);

  const isDone = completed.has(lesson.id);

  // Group lessons by module for the sidebar
  const lessonsByModule = allModules.map((mod) => ({
    ...mod,
    lessons: allLessons.filter((l) => l.moduleId === mod.id),
  }));

  const scriptBlocks = lesson.script ? parseScript(lesson.script) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Sticky header ─────────────────────────────────────────── */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
            <Link
              href={`/course/${courseSlug}`}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              {courseTitle}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate hidden sm:inline">
              {moduleTitle}
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:inline" />
            <span className="font-medium truncate">{lesson.title}</span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {/* Lesson counter */}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {currentIndex + 1} / {totalCount}
            </span>

            {/* Mobile sidebar toggle */}
            <button
              className="lg:hidden p-1.5 rounded-md hover:bg-muted"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle lesson list"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 container mx-auto px-0 sm:px-4 py-0 sm:py-6 gap-6 max-w-6xl">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        {/* Desktop: always visible */}
        {/* Mobile: slides in as overlay */}
        <aside
          className={cn(
            // Base layout
            "flex-shrink-0 w-72 bg-background border-r sm:border sm:rounded-xl overflow-y-auto",
            // Desktop: always shown, sticky
            "hidden lg:block lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5rem)]",
          )}
        >
          <SidebarContent
            courseSlug={courseSlug}
            currentLessonId={lesson.id}
            lessonsByModule={lessonsByModule}
            completed={completed}
          />
        </aside>

        {/* Mobile drawer overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-30 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Panel */}
            <aside className="relative w-72 max-w-[85vw] bg-background h-full overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-semibold text-sm">Course Contents</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded hover:bg-muted"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent
                courseSlug={courseSlug}
                currentLessonId={lesson.id}
                lessonsByModule={lessonsByModule}
                completed={completed}
              />
            </aside>
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-4 sm:px-0 py-6 sm:py-0">
          <h1 className="text-2xl font-bold mb-5">{lesson.title}</h1>

          {/* ── Video player ─────────────────────────────────────────── */}
          {lesson.videoUrl ? (
            <>
              <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video shadow-lg">
                <video
                  src={lesson.videoUrl}
                  controls
                  playsInline
                  poster={lesson.thumbnailUrl ?? undefined}
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>

              {/* Script shown as supplementary notes when a video is present */}
              {scriptBlocks.length > 0 && (
                <section className="rounded-xl border p-6 mb-6">
                  <h2 className="font-semibold text-sm mb-4 text-foreground">
                    Lesson Notes
                  </h2>
                  <div className="space-y-3">
                    {scriptBlocks.map((block, i) =>
                      block.type === "heading" ? (
                        <h3
                          key={i}
                          className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mt-6 first:mt-0"
                        >
                          {block.text}
                        </h3>
                      ) : (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                          {block.text}
                        </p>
                      )
                    )}
                  </div>
                </section>
              )}
            </>
          ) : scriptBlocks.length > 0 ? (
            /* ── No video: script is the primary content ──────────── */
            <section className="rounded-xl border bg-muted/20 p-6 mb-6">
              <h2 className="font-semibold text-sm mb-4 text-foreground">
                Lesson Script
              </h2>
              <div className="space-y-3">
                {scriptBlocks.map((block, i) =>
                  block.type === "heading" ? (
                    <h3
                      key={i}
                      className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mt-6 first:mt-0"
                    >
                      {block.text}
                    </h3>
                  ) : (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                      {block.text}
                    </p>
                  )
                )}
              </div>
            </section>
          ) : (
            /* ── No video AND no script: placeholder ──────────────── */
            <div className="mb-6 rounded-xl bg-muted/50 border border-dashed aspect-video flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Video not yet rendered</p>
            </div>
          )}

          {/* Progress + Navigation row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
            {/* Mark complete */}
            <Button
              variant={isDone ? "secondary" : "outline"}
              className={cn(
                "gap-2",
                isDone && "text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-950/60"
              )}
              onClick={() => {
                if (isDone) {
                  unmarkComplete(lesson.id);
                } else {
                  markComplete(lesson.id);
                  trackComplete();
                }
              }}
            >
              {isDone ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              {isDone ? "Completed" : "Mark as Complete"}
            </Button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Previous */}
            {prevLesson ? (
              <Link
                href={`/course/${courseSlug}/${prevLesson.id}`}
                title={prevLesson.title}
              >
                <Button variant="outline" className="w-full sm:w-auto gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Previous Lesson
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {/* Next */}
            {nextLesson ? (
              <Link
                href={`/course/${courseSlug}/${nextLesson.id}`}
                title={nextLesson.title}
              >
                <Button className="bg-violet-600 hover:bg-violet-700 w-full sm:w-auto gap-1">
                  Next Lesson
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/course/${courseSlug}`}>
                <Button className="bg-violet-600 hover:bg-violet-700 w-full sm:w-auto">
                  Back to Course
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar content (shared between desktop & mobile drawer)           */
/* ------------------------------------------------------------------ */

interface SidebarContentProps {
  courseSlug: string;
  currentLessonId: string;
  lessonsByModule: (ModuleItem & { lessons: LessonItem[] })[];
  completed: Set<string>;
}

function SidebarContent({
  courseSlug,
  currentLessonId,
  lessonsByModule,
  completed,
}: SidebarContentProps) {
  return (
    <div className="py-2">
      {lessonsByModule.map((mod) => (
        <div key={mod.id}>
          {/* Module header */}
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40 sticky top-0 z-10">
            {mod.title}
          </div>

          {/* Lessons in module */}
          {mod.lessons
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((lesson) => {
              const isCurrent = lesson.id === currentLessonId;
              const isDone = completed.has(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  href={`/course/${courseSlug}/${lesson.id}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    isCurrent
                      ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-medium border-r-2 border-violet-600"
                      : "hover:bg-muted/50 text-foreground"
                  )}
                >
                  {isDone ? (
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  ) : isCurrent ? (
                    <PlayCircle className="h-4 w-4 text-violet-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="truncate leading-snug">{lesson.title}</span>
                </Link>
              );
            })}
        </div>
      ))}
    </div>
  );
}
