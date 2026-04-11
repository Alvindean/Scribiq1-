import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Number of completed lessons. */
  completed: number;
  /** Total number of lessons in the course. */
  total: number;
  className?: string;
}

/**
 * Displays "X of Y lessons completed" with a filled progress bar.
 * Uses a violet fill on a zinc background.
 */
export function ProgressBar({ completed, total, className }: ProgressBarProps) {
  const safeTotal = Math.max(total, 0);
  const safeCompleted = Math.min(Math.max(completed, 0), safeTotal);
  const percent =
    safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {safeCompleted} of {safeTotal} lessons completed
        </span>
        <span className="font-medium text-violet-600">{percent}%</span>
      </div>

      {/* Track */}
      <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
        {/* Fill */}
        <div
          role="progressbar"
          aria-valuenow={safeCompleted}
          aria-valuemin={0}
          aria-valuemax={safeTotal}
          aria-label={`${percent}% of course completed`}
          className="h-full rounded-full bg-violet-600 transition-all duration-300 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
