"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  GraduationCap,
  PlayCircle,
  ArrowRight,
  Mail,
  LogOut,
  BookMarked,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface EnrolledCourse {
  courseSlug: string;
  projectId: string;
  projectTitle: string;
  niche: string | null;
  content: Record<string, unknown>;
  enrolledAt: string | null;
  lessonCount: number;
  thumbnail: string | null;
}

interface RecentlyViewed {
  courseSlug: string;
  lessonSlug: string;
  title: string;
  viewedAt: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const STUDENT_EMAIL_KEY = "soniq:student-email";
const RECENTLY_VIEWED_KEY = "soniq:recently-viewed";

function readStudentEmail(): string | null {
  try {
    return localStorage.getItem(STUDENT_EMAIL_KEY);
  } catch {
    return null;
  }
}

function saveStudentEmail(email: string): void {
  try {
    localStorage.setItem(STUDENT_EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    // ignore
  }
}

function clearStudentEmail(): void {
  try {
    localStorage.removeItem(STUDENT_EMAIL_KEY);
  } catch {
    // ignore
  }
}

function readRecentlyViewed(): RecentlyViewed[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentlyViewed[]) : [];
  } catch {
    return [];
  }
}

function readCourseProgress(courseSlug: string): number {
  try {
    const raw = localStorage.getItem(`soniq:progress:${courseSlug}`);
    if (!raw) return 0;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return (parsed as string[]).length;
    return 0;
  } catch {
    return 0;
  }
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                       */
/* ------------------------------------------------------------------ */

interface CourseCardProps {
  course: EnrolledCourse;
  completedCount: number;
}

function CourseCard({ course, completedCount }: CourseCardProps) {
  const pct =
    course.lessonCount > 0
      ? Math.round((completedCount / course.lessonCount) * 100)
      : 0;

  return (
    <div className="rounded-xl border bg-card overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      {course.thumbnail ? (
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.projectTitle}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center">
          <BookMarked className="h-10 w-10 text-violet-400" />
        </div>
      )}

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {course.niche && (
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            {course.niche}
          </span>
        )}
        <h3 className="font-semibold leading-snug line-clamp-2">
          {course.projectTitle}
        </h3>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {completedCount} / {course.lessonCount} lessons
            </span>
            <span className="font-medium tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-1">
          <Button
            asChild
            size="sm"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
          >
            <Link href={`/course/${course.courseSlug}`}>
              {pct === 0 ? "Start Course" : pct === 100 ? "Review Course" : "Continue"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                            */
/* ------------------------------------------------------------------ */

export default function MyLearningPage() {
  const [mounted, setMounted] = useState(false);
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewed[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    const email = readStudentEmail();
    setStudentEmail(email);
    setRecentlyViewed(readRecentlyViewed().slice(0, 3));
    setMounted(true);
  }, []);

  // Fetch enrolled courses whenever email is known
  const fetchCourses = useCallback(async (email: string) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(
        `/api/my-learning?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error("Failed to load courses");
      const data = (await res.json()) as { courses: EnrolledCourse[] };
      setCourses(data.courses ?? []);

      // Read per-course progress from localStorage
      const pm: Record<string, number> = {};
      for (const c of data.courses ?? []) {
        pm[c.courseSlug] = readCourseProgress(c.courseSlug);
      }
      setProgressMap(pm);
    } catch {
      setFetchError("Could not load your courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (studentEmail) {
      fetchCourses(studentEmail);
    }
  }, [studentEmail, fetchCourses]);

  /* -- Email gate submit -------------------------------------------- */
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    saveStudentEmail(trimmed);
    setStudentEmail(trimmed);
    setEmailError("");
  }

  function handleSignOut() {
    clearStudentEmail();
    setStudentEmail(null);
    setCourses([]);
    setProgressMap({});
    setEmailInput("");
  }

  /* -- Avoid hydration mismatch ------------------------------------- */
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  /* -- Email gate ---------------------------------------------------- */
  if (!studentEmail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border bg-card p-8 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-xl font-bold">My Learning</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to view your enrolled courses and track your
                progress.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="you@example.com"
                    className="pl-9"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* -- Main dashboard ----------------------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-violet-600 shrink-0" />
            <span className="font-bold text-base">My Learning</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[200px]">
              {studentEmail}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-10">
        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-muted-foreground" />
              Continue Watching
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {recentlyViewed.map((item) => (
                <Link
                  key={`${item.courseSlug}-${item.lessonSlug}`}
                  href={`/course/${item.courseSlug}/${item.lessonSlug}`}
                  className="flex-1 rounded-xl border bg-card p-4 hover:shadow-md transition-shadow flex items-center gap-3 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
                    <PlayCircle className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(item.viewedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-violet-600 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Enrolled Courses */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-muted-foreground" />
            My Courses
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-4/5" />
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-8 bg-muted rounded w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : fetchError ? (
            <div className="rounded-xl border bg-destructive/10 p-6 text-center">
              <p className="text-sm text-destructive">{fetchError}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fetchCourses(studentEmail)}
              >
                Retry
              </Button>
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-xl border bg-muted/30 p-10 text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                <BookMarked className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium">No enrolled courses yet</p>
              <p className="text-sm text-muted-foreground">
                Browse courses to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <CourseCard
                  key={course.courseSlug}
                  course={course}
                  completedCount={progressMap[course.courseSlug] ?? 0}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
