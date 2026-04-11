"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Eye,
  CheckCircle,
  Users,
  User,
  BarChart2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── Types ──────────────────────────────────────────────────────────────── //

interface DailyView {
  date: string; // ISO date string "YYYY-MM-DD"
  count: number;
}

interface TopLesson {
  lessonId: string;
  title: string;
  views: number;
  completions: number;
}

interface AnalyticsSummary {
  totalViews: number;
  totalCompletions: number;
  enrollments: number;
  uniqueStudents: number;
  topLessons: TopLesson[];
  dailyViews: DailyView[];
}

// ─── Date range options ──────────────────────────────────────────────────── //

const DATE_RANGES = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────── //

function abbrevDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function completionRate(views: number, completions: number): string {
  if (views === 0) return "—";
  return `${Math.round((completions / views) * 100)}%`;
}

// ─── Sparkline bar chart ─────────────────────────────────────────────────── //

interface SparklineProps {
  data: DailyView[];
}

function SparklineChart({ data }: SparklineProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    count: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (data.length === 0) return null;

  const W = 600;
  const H = 120;
  const PADDING_TOP = 10;
  const PADDING_BOTTOM = 24; // room for x-axis labels
  const PADDING_X = 4;

  const chartH = H - PADDING_TOP - PADDING_BOTTOM;
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barCount = data.length;
  const totalSlotW = (W - PADDING_X * 2) / barCount;
  const barW = Math.max(totalSlotW * 0.65, 2);
  const barGap = totalSlotW - barW;

  // Which indices to label on the x-axis (at most 7 ticks regardless of range)
  const labelEvery = Math.ceil(barCount / 7);

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 140 }}
        onMouseLeave={() => setTooltip(null)}
      >
        {data.map((d, i) => {
          const barH = Math.max((d.count / maxCount) * chartH, d.count > 0 ? 3 : 0);
          const x = PADDING_X + i * totalSlotW + barGap / 2;
          const y = PADDING_TOP + chartH - barH;

          const showLabel = i === 0 || i === barCount - 1 || i % labelEvery === 0;

          return (
            <g key={d.date}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={2}
                className="fill-violet-500 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onMouseEnter={(e) => {
                  const svgRect = svgRef.current?.getBoundingClientRect();
                  if (!svgRect) return;
                  setTooltip({
                    x: x + barW / 2,
                    y: y,
                    label: abbrevDate(d.date),
                    count: d.count,
                  });
                }}
              />
              {/* X-axis label */}
              {showLabel && (
                <text
                  x={x + barW / 2}
                  y={H - 4}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 9 }}
                >
                  {abbrevDate(d.date)}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x - 36, W - 80)}
              y={Math.max(tooltip.y - 30, 2)}
              width={72}
              height={22}
              rx={4}
              className="fill-popover stroke-border"
              strokeWidth={1}
            />
            <text
              x={Math.min(tooltip.x - 36, W - 80) + 36}
              y={Math.max(tooltip.y - 30, 2) + 14}
              textAnchor="middle"
              className="fill-foreground"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {tooltip.label}: {tooltip.count}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────── //

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

function StatCard({ label, value, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${iconBg}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
        <p className="text-2xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Main component ──────────────────────────────────────────────────────── //

interface AnalyticsDashboardProps {
  projectId: string;
}

export function AnalyticsDashboard({ projectId }: AnalyticsDashboardProps) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/analytics/summary?projectId=${projectId}&days=${days}`
      );
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `Request failed (HTTP ${res.status})`);
      }
      const json = (await res.json()) as AnalyticsSummary;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [projectId, days]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const isEmpty =
    !loading &&
    !error &&
    data !== null &&
    data.totalViews === 0 &&
    data.enrollments === 0;

  // Sort top lessons by views descending
  const sortedLessons = data
    ? [...data.topLessons].sort((a, b) => b.views - a.views)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-violet-500" />
            <h1 className="text-3xl font-bold">Analytics</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Engagement metrics for your course.
          </p>
        </div>

        {/* Date range selector */}
        <div className="flex items-center gap-1 rounded-lg border bg-muted p-1 self-start sm:self-auto">
          {DATE_RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              onClick={() => setDays(range.days)}
              className={[
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                days === range.days
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-4 pb-4">
                  <div className="h-4 w-20 rounded bg-muted animate-pulse mb-3" />
                  <div className="h-7 w-12 rounded bg-muted animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="h-36 rounded bg-muted animate-pulse" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <BarChart2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-base">No analytics data yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Share your course to start tracking views.
            </p>
          </div>
        </div>
      )}

      {/* ── Data views ── */}
      {!loading && !error && data && !isEmpty && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="Total Lesson Views"
              value={data.totalViews}
              icon={Eye}
              iconBg="bg-violet-100 dark:bg-violet-900/40"
              iconColor="text-violet-600 dark:text-violet-400"
            />
            <StatCard
              label="Completions"
              value={data.totalCompletions}
              icon={CheckCircle}
              iconBg="bg-emerald-100 dark:bg-emerald-900/40"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label="Enrollments"
              value={data.enrollments}
              icon={Users}
              iconBg="bg-blue-100 dark:bg-blue-900/40"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              label="Unique Students"
              value={data.uniqueStudents}
              icon={User}
              iconBg="bg-amber-100 dark:bg-amber-900/40"
              iconColor="text-amber-600 dark:text-amber-400"
            />
          </div>

          {/* Views over time chart */}
          {data.dailyViews.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Views Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SparklineChart data={data.dailyViews} />
              </CardContent>
            </Card>
          )}

          {/* Top lessons table */}
          {sortedLessons.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Top Lessons</h2>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                        Lesson Title
                      </th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                        Views
                      </th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground hidden sm:table-cell">
                        Completions
                      </th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground hidden sm:table-cell">
                        Completion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sortedLessons.map((lesson) => (
                      <tr
                        key={lesson.lessonId}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">{lesson.title}</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {lesson.views.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                          {lesson.completions.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell">
                          <span
                            className={
                              lesson.views > 0
                                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {completionRate(lesson.views, lesson.completions)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
