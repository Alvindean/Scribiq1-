"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  FolderOpen,
  BookOpen,
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
interface EnvCheckItem { key: string; present: boolean; required: boolean }
interface EnvCheckGroup { name: string; checks: EnvCheckItem[] }
interface EnvCheckResponse { groups: EnvCheckGroup[] }

interface AdminStats {
  userCount: number;
  orgCount: number;
  projectCount: number;
  publishedCount: number;
  recentUsers: {
    id: string;
    name: string | null;
    email: string;
    plan: string;
    joinedAt: string | null;
    projectCount: number;
  }[];
  recentProjects: {
    id: string;
    title: string;
    type: string;
    org: string;
    status: string;
    createdAt: string | null;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  generating: "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-500",
};

const PLAN_COLORS: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  pro: "bg-violet-100 text-violet-700",
  agency: "bg-indigo-100 text-indigo-700",
  enterprise: "bg-amber-100 text-amber-700",
  "—": "bg-muted text-muted-foreground",
};

/** Determine the overall health of a group */
function groupStatus(group: EnvCheckGroup): "ok" | "warn" | "error" {
  const requiredMissing = group.checks.some((c) => c.required && !c.present);
  if (requiredMissing) return "error";
  const optionalMissing = group.checks.some((c) => !c.required && !c.present);
  if (optionalMissing) return "warn";
  return "ok";
}

function GroupStatusIcon({ status }: { status: "ok" | "warn" | "error" }) {
  if (status === "ok")
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />;
  if (status === "warn")
    return <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />;
  return <XCircle className="h-4 w-4 shrink-0 text-red-500" />;
}

function groupBorder(status: "ok" | "warn" | "error") {
  if (status === "ok") return "border-green-200 bg-green-50/40";
  if (status === "warn") return "border-amber-200 bg-amber-50/40";
  return "border-red-200 bg-red-50/40";
}

function fmt(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const cls = PLAN_COLORS[plan] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}
    >
      {plan}
    </span>
  );
}

// ── Env status section ───────────────────────────────────────────────────────

function EnvStatusSection({ groups }: { groups: EnvCheckGroup[] }) {
  const [copied, setCopied] = useState(false);

  const missingKeys = groups
    .flatMap((g) => g.checks)
    .filter((c) => !c.present)
    .map((c) => `${c.key}=`);

  const handleCopyMissing = useCallback(async () => {
    if (missingKeys.length === 0) return;
    try {
      await navigator.clipboard.writeText(missingKeys.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access may be blocked in some contexts
    }
  }, [missingKeys]);

  const overallStatus: "ok" | "warn" | "error" = (() => {
    const hasError = groups.some((g) => groupStatus(g) === "error");
    if (hasError) return "error";
    const hasWarn = groups.some((g) => groupStatus(g) === "warn");
    if (hasWarn) return "warn";
    return "ok";
  })();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Environment Variables</CardTitle>
            <CardDescription className="mt-0.5">
              Checks whether required service credentials are configured.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {overallStatus === "ok" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All required vars set
              </span>
            )}
            {overallStatus === "warn" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" />
                Some optional vars missing
              </span>
            )}
            {overallStatus === "error" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                <XCircle className="h-3.5 w-3.5" />
                Required vars missing
              </span>
            )}
            {missingKeys.length > 0 && (
              <button
                onClick={handleCopyMissing}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
                title="Copy missing var names to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy missing ({missingKeys.length})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const status = groupStatus(group);
            return (
              <div
                key={group.name}
                className={`rounded-lg border p-3 ${groupBorder(status)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GroupStatusIcon status={status} />
                  <span className="text-sm font-semibold">{group.name}</span>
                </div>
                <ul className="space-y-1">
                  {group.checks.map((check) => (
                    <li key={check.key} className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          check.present
                            ? "bg-green-500"
                            : check.required
                            ? "bg-red-400"
                            : "bg-amber-400"
                        }`}
                      />
                      <span
                        className={`font-mono text-xs ${
                          check.present
                            ? "text-foreground"
                            : check.required
                            ? "text-red-600 font-medium"
                            : "text-amber-600"
                        }`}
                      >
                        {check.key}
                      </span>
                      {!check.present && !check.required && (
                        <span className="ml-auto text-[10px] text-muted-foreground italic">
                          optional
                        </span>
                      )}
                      {!check.present && check.required && (
                        <span className="ml-auto text-[10px] text-red-500 font-semibold uppercase tracking-wide">
                          missing
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envGroups, setEnvGroups] = useState<EnvCheckGroup[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to load stats");
        }
        const data = (await res.json()) as AdminStats;
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();

    // Probe env via dedicated endpoint
    (async () => {
      try {
        const res = await fetch("/api/admin/env-check");
        if (res.ok) {
          const data = (await res.json()) as EnvCheckResponse;
          if (data.groups) {
            setEnvGroups(data.groups);
          }
        }
      } catch {
        // env check is best-effort
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-7 w-7 text-violet-600" />
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Platform overview and system status.
          </p>
        </div>
      </div>

      {/* ── Stats overview ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5 text-violet-600" />}
            label="Total Users"
            value={stats.userCount}
          />
          <StatCard
            icon={<Building2 className="h-5 w-5 text-indigo-600" />}
            label="Organizations"
            value={stats.orgCount}
          />
          <StatCard
            icon={<FolderOpen className="h-5 w-5 text-blue-600" />}
            label="Total Projects"
            value={stats.projectCount}
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-green-600" />}
            label="Published"
            value={stats.publishedCount}
          />
        </div>
      </section>

      {/* ── Recent Users ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Sign-ups</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Plan</Th>
                    <Th>Joined</Th>
                    <Th className="text-right">Projects</Th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    stats.recentUsers.map((u) => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                        <Td>{u.name ?? <span className="italic text-muted-foreground">—</span>}</Td>
                        <Td>{u.email}</Td>
                        <Td>
                          <PlanBadge plan={u.plan} />
                        </Td>
                        <Td>{fmt(u.joinedAt)}</Td>
                        <Td className="text-right tabular-nums">{u.projectCount}</Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Recent Projects ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <Th>Title</Th>
                    <Th>Type</Th>
                    <Th>Organization</Th>
                    <Th>Status</Th>
                    <Th>Created</Th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No projects yet.
                      </td>
                    </tr>
                  ) : (
                    stats.recentProjects.map((p) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <Td className="font-medium max-w-[16rem] truncate">{p.title}</Td>
                        <Td className="capitalize">{p.type}</Td>
                        <Td className="max-w-[12rem] truncate text-muted-foreground">{p.org}</Td>
                        <Td>
                          <StatusBadge status={p.status} />
                        </Td>
                        <Td>{fmt(p.createdAt)}</Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── System Status ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-4">System Status</h2>
        {envGroups.length > 0 ? (
          <EnvStatusSection groups={envGroups} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Loading environment check…
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

// ── Tiny helpers ─────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          {icon}
        </div>
        <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function Th({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>
  );
}
