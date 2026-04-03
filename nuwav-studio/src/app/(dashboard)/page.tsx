import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { UsageStats } from "@/components/dashboard/UsageStats";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Project } from "@/types/project";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [profile] = userId
    ? await db.select({ name: profiles.name }).from(profiles).where(eq(profiles.id, userId)).limit(1)
    : [null];

  const firstName = profile?.name?.split(" ")[0] ?? "there";

  // Get org_id from profile for filtering
  const [profileFull] = userId
    ? await db.select({ orgId: profiles.orgId }).from(profiles).where(eq(profiles.id, userId)).limit(1)
    : [null];

  const projectList = profileFull?.orgId
    ? await db
        .select()
        .from(projects)
        .where(eq(projects.orgId, profileFull.orgId))
        .limit(20)
    : [];

  // Mock usage for MVP
  const usageStats = {
    projects: { used: projectList.length, limit: 3 },
    renders: { used: 0, limit: 10 },
    generations: { used: 0, limit: 50 },
    storage: { used: 0, limit: 5 },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Good morning, {firstName}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build and publish AI-powered courses and VSLs
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
            <EmptyState
              icon={BookOpen}
              title="No projects yet"
              description="Create your first AI-powered course or VSL to get started."
              action={{
                label: "Create Project",
                onClick: () => { window.location.href = "/projects/new"; },
              }}
            />
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

          <div className="rounded-xl border p-4 space-y-3">
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
    </div>
  );
}
