"use client";

import { useState, useEffect, useCallback } from "react";

function storageKey(courseSlug: string): string {
  return `soniq:progress:${courseSlug}`;
}

function readStorage(courseSlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(courseSlug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(courseSlug: string, completed: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(courseSlug), JSON.stringify(completed));
  } catch {
    // Storage write failures are non-fatal
  }
}

interface UseCourseProgressOptions {
  /** Total number of lessons in the course — used to compute progressPercent. */
  totalLessons?: number;
}

interface UseCourseProgressResult {
  /** Slugs of all lessons the user has marked complete. */
  completedLessons: string[];
  /** Returns true when the given lesson slug is in the completed set. */
  isCompleted: (slug: string) => boolean;
  /** Marks a lesson as complete and persists to localStorage. */
  markComplete: (slug: string) => void;
  /** Removes a lesson from the completed set and persists to localStorage. */
  markIncomplete: (slug: string) => void;
  /** 0-100 based on totalLessons. Returns 0 when totalLessons is not provided or is 0. */
  progressPercent: number;
  /** Number of completed lessons. */
  totalCompleted: number;
}

/**
 * Reads and writes lesson-completion progress for a single course.
 * Data is persisted in localStorage under the key `soniq:progress:${courseSlug}`.
 */
export function useCourseProgress(
  courseSlug: string,
  options: UseCourseProgressOptions = {}
): UseCourseProgressResult {
  const { totalLessons = 0 } = options;

  const [completedLessons, setCompletedLessons] = useState<string[]>(() =>
    readStorage(courseSlug)
  );

  // Re-sync from storage whenever courseSlug changes (e.g. navigation between courses)
  useEffect(() => {
    setCompletedLessons(readStorage(courseSlug));
  }, [courseSlug]);

  const isCompleted = useCallback(
    (slug: string) => completedLessons.includes(slug),
    [completedLessons]
  );

  const markComplete = useCallback(
    (slug: string) => {
      setCompletedLessons((prev) => {
        if (prev.includes(slug)) return prev;
        const next = [...prev, slug];
        writeStorage(courseSlug, next);
        return next;
      });
    },
    [courseSlug]
  );

  const markIncomplete = useCallback(
    (slug: string) => {
      setCompletedLessons((prev) => {
        const next = prev.filter((s) => s !== slug);
        writeStorage(courseSlug, next);
        return next;
      });
    },
    [courseSlug]
  );

  const totalCompleted = completedLessons.length;
  const progressPercent =
    totalLessons > 0
      ? Math.round((totalCompleted / totalLessons) * 100)
      : 0;

  return {
    completedLessons,
    isCompleted,
    markComplete,
    markIncomplete,
    progressPercent,
    totalCompleted,
  };
}
