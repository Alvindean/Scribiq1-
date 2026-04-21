import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Project } from "@/types/project";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [profile] = userId
    ? await db
        .select({ orgId: profiles.orgId })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1)
    : [null];

  const projectList = profile?.orgId
    ? await db
        .select()
        .from(projects)
        .where(eq(projects.orgId, profile.orgId))
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All your AI-powered courses and VSLs in one place
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects grid or empty state */}
      {projectList.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <EmptyState
            icon={BookOpen}
            title="No projects yet"
            description="Create your first AI-powered course or VSL to get started."
          />
          <Link href="/projects/new">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(projectList as Project[]).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
