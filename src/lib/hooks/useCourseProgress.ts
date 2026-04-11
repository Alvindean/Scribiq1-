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
  totalLessons?: number;
}

interface UseCourseProgressResult {
  completedLessons: string[];
  isCompleted: (slug: string) => boolean;
  markComplete: (slug: string) => void;
  markIncomplete: (slug: string) => void;
  progressPercent: number;
  totalCompleted: number;
}

export function useCourseProgress(
  courseSlug: string,
  options: UseCourseProgressOptions = {}
): UseCourseProgressResult {
  const { totalLessons = 0 } = options;

  const [completedLessons, setCompletedLessons] = useState<string[]>(() =>
    readStorage(courseSlug)
  );

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
