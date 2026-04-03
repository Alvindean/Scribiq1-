import Link from "next/link";
import { MoreHorizontal, Video, BookOpen, Layers } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Project } from "@/types/project";
import { formatDuration } from "@/lib/utils/duration";

interface ProjectCardProps {
  project: Project;
}

const typeIcons = {
  course: BookOpen,
  vsl: Video,
  hybrid: Layers,
};

const statusVariants: Record<
  Project["status"],
  "default" | "secondary" | "success" | "warning" | "outline"
> = {
  draft: "outline",
  generating: "warning",
  review: "secondary",
  published: "success",
  archived: "outline",
};

const statusLabels: Record<Project["status"], string> = {
  draft: "Draft",
  generating: "Generating...",
  review: "In Review",
  published: "Published",
  archived: "Archived",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const Icon = typeIcons[project.type];

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
        <Icon className="h-12 w-12 text-violet-400" />
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-sm leading-tight">
              {project.title}
            </h3>
            {project.niche && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {project.niche}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-1">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant={statusVariants[project.status]}>
            {statusLabels[project.status]}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {project.type}
          </Badge>
          {project.duration_target && (
            <span className="text-xs text-muted-foreground ml-auto">
              {formatDuration(project.duration_target)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            Open Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
