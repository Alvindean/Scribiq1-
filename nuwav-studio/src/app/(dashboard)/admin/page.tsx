"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

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

interface EnvCheck {
  label: string;
  vars: string[];
}

const ENV_CHECKS: EnvCheck[] = [
  { label: "Stripe", vars: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"] },
  { label: "ElevenLabs", vars: ["ELEVENLABS_API_KEY"] },
  { label: "R2 Storage", vars: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"] },
  { label: "Database", vars: ["DATABASE_URL"] },
  { label: "Auth Secret", vars: ["NEXTAUTH_SECRET", "AUTH_SECRET"] },
  { label: "OpenAI / Anthropic", vars: ["ANTHROPIC_API_KEY", "OPENAI_API_KEY"] },
];

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

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // System status — checked client-side via a small API helper
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({});

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
          const data = (await res.json()) as Record<string, boolean>;
          setEnvStatus(data);
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Environment Variables</CardTitle>
            <CardDescription>
              Checks whether required service credentials are configured.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {ENV_CHECKS.map((check) => {
                // A service is "configured" when at least one of its vars is present
                const configured = check.vars.some(
                  (v) => envStatus[v] === true
                );
                return (
                  <div
                    key={check.label}
                    className="flex items-center gap-2 rounded-md border px-3 py-2"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        configured ? "bg-green-500" : "bg-red-400"
                      }`}
                    />
                    <span className="text-sm font-medium">{check.label}</span>
                    <span
                      className={`text-xs ${
                        configured ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {configured ? "configured" : "missing"}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
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
