import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, projects, lessons, renderJobs } from "@/lib/db/schema";
import { eq, count, and, gte } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { UsageStats } from "@/components/dashboard/UsageStats";
import { DashboardEmptyState } from "@/components/onboarding/DashboardEmptyState";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import type { Project } from "@/types/project";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [profileFull] = userId
    ? await db
        .select({ name: profiles.name, orgId: profiles.orgId })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1)
    : [null];

  const firstName = profileFull?.name?.split(" ")[0] ?? null;
  const orgId = profileFull?.orgId;

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Recent projects for display (limited to 20)
  const projectList = orgId
    ? await db.select().from(projects).where(eq(projects.orgId, orgId)).limit(20)
    : [];

  // Start of current month for monthly stats
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Accurate counts via COUNT queries
  const [projectCount, lessonCount, renderCount] = await Promise.all([
    orgId
      ? db.select({ value: count() }).from(projects).where(eq(projects.orgId, orgId))
          .then((r) => r[0]?.value ?? 0)
      : Promise.resolve(0),

    orgId
      ? db
          .select({ value: count() })
          .from(lessons)
          .innerJoin(projects, eq(lessons.projectId, projects.id))
          .where(eq(projects.orgId, orgId))
          .then((r) => r[0]?.value ?? 0)
      : Promise.resolve(0),

    orgId
      ? db
          .select({ value: count() })
          .from(renderJobs)
          .innerJoin(projects, eq(renderJobs.projectId, projects.id))
          .where(
            and(
              eq(projects.orgId, orgId),
              gte(renderJobs.createdAt, monthStart)
            )
          )
          .then((r) => r[0]?.value ?? 0)
      : Promise.resolve(0),
  ]);

  const usageStats = {
    projects:    { used: projectCount,  limit: -1 },
    lessons:     { used: lessonCount,   limit: -1 },
    renders:     { used: renderCount,   limit: -1 },
    generations: { used: lessonCount,   limit: -1 },
    storage:     { used: 0,             limit: -1 },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {timeGreeting} — build and publish AI-powered courses and VSLs
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Projects grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Projects</h2>
            {projectList.length > 0 && (
              <Link href="/projects" className="text-sm text-violet-600 hover:underline">
                View all
              </Link>
            )}
          </div>

          {projectList.length === 0 ? (
            <DashboardEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(projectList as Project[]).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          <UsageStats stats={usageStats} />

          <div className="rounded-xl border p-4 space-y-3 hover:shadow-sm transition-shadow">
            <h3 className="text-sm font-medium">Quick Start</h3>
            <div className="space-y-2">
              {[
                { href: "/projects/new", label: "Create a Course" },
                { href: "/projects/new?type=vsl", label: "Build a VSL" },
                { href: "/templates", label: "Browse Templates" },
                { href: "/settings/billing", label: "Upgrade Plan" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                  <span className="text-xs">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding welcome modal — self-shows on first visit via localStorage */}
      <WelcomeModal />
    </div>
  );
}
