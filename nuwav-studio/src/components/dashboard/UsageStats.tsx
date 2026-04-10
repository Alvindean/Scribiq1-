import { Video, Cpu, HardDrive, FolderOpen, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UsageStat {
  label: string;
  used: number;
  limit: number;
  icon: React.ComponentType<{ className?: string }>;
  unit?: string;
}

interface UsageStatsProps {
  stats: {
    projects: { used: number; limit: number };
    lessons: { used: number; limit: number };
    renders: { used: number; limit: number };
    generations: { used: number; limit: number };
    storage: { used: number; limit: number };
  };
}

export function UsageStats({ stats }: UsageStatsProps) {
  const items: UsageStat[] = [
    {
      label: "Projects",
      used: stats.projects.used,
      limit: stats.projects.limit,
      icon: FolderOpen,
    },
    {
      label: "Lessons Created",
      used: stats.lessons.used,
      limit: stats.lessons.limit,
      icon: BookOpen,
    },
    {
      label: "Video Renders",
      used: stats.renders.used,
      limit: stats.renders.limit,
      icon: Video,
      unit: "/ month",
    },
    {
      label: "AI Generations",
      used: stats.generations.used,
      limit: stats.generations.limit,
      icon: Cpu,
      unit: "/ month",
    },
    {
      label: "Storage",
      used: stats.storage.used,
      limit: stats.storage.limit,
      icon: HardDrive,
      unit: "GB",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Usage This Month</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          const pct = item.limit === -1 ? 0 : Math.round((item.used / item.limit) * 100);
          const isUnlimited = item.limit === -1;

          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </div>
                <span className="font-medium tabular-nums">
                  {item.used}
                  {isUnlimited ? "" : ` / ${item.limit}`}
                  {item.unit ? ` ${item.unit}` : ""}
                </span>
              </div>
              {!isUnlimited && (
                <Progress value={pct} className="h-1.5" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
