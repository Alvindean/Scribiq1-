"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface Props {
  slug: string;
  totalLessons: number;
}

export default function CourseProgress({ slug, totalLessons }: Props) {
  const [completed, setCompleted] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`soniq:progress:${slug}`);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        // Support both a plain string[] (our format) and the legacy { completed: string[] } shape
        let ids: string[] = [];
        if (Array.isArray(parsed)) {
          ids = parsed as string[];
        } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as Record<string, unknown>).completed)) {
          ids = (parsed as { completed: string[] }).completed;
        }
        setCompleted(Math.min(ids.length, totalLessons));
      }
    } catch {
      // localStorage unavailable or malformed — silently skip
    }
    setMounted(true);
  }, [slug, totalLessons]);

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted || completed === 0) return null;

  const pct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  return (
    <div className="mb-6 rounded-xl border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Your progress</span>
        <span className="text-muted-foreground">
          {completed} of {totalLessons} lessons completed
        </span>
      </div>
      <Progress value={pct} className="h-2" />
      {pct === 100 && (
        <p className="text-xs text-primary font-semibold">
          You have completed this course!
        </p>
      )}
    </div>
  );
}
