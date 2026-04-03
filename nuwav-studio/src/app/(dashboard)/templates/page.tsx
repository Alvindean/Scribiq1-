import Link from "next/link";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Template } from "@/types/template";

type FilterType = "all" | "course" | "vsl" | "hybrid";

function templateTypeBadge(
  type: Template["type"]
): "default" | "secondary" | "outline" {
  switch (type) {
    case "course":
      return "default";
    case "vsl":
      return "secondary";
    default:
      return "outline";
  }
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filterType = (type ?? "all") as FilterType;

  const query = db
    .select()
    .from(templates)
    .where(eq(templates.isPublic, true))
    .orderBy(asc(templates.name));

  const allTemplates = await query;

  const typedTemplates = (
    filterType === "all"
      ? allTemplates
      : allTemplates.filter((t) => t.type === filterType)
  ) as unknown as Template[];

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "course", label: "Course" },
    { value: "vsl", label: "VSL" },
    { value: "hybrid", label: "Hybrid" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Start your next project with a professionally designed template.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">New Project</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <Link key={opt.value} href={opt.value === "all" ? "/templates" : `/templates?type=${opt.value}`}>
            <Badge
              variant={filterType === opt.value ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm"
            >
              {opt.label}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Template grid */}
      {typedTemplates.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          <p className="text-lg font-medium">No templates found</p>
          <p className="text-sm mt-1">
            {filterType === "all"
              ? "No public templates are available yet."
              : `No public ${filterType} templates available.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {typedTemplates.map((tpl) => (
            <Card key={tpl.id} className="overflow-hidden flex flex-col">
              {tpl.thumbnail_url ? (
                <div className="overflow-hidden">
                  <img
                    src={tpl.thumbnail_url}
                    alt={tpl.name}
                    className="h-40 w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-muted text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">
                    {tpl.name}
                  </CardTitle>
                  <Badge
                    variant={templateTypeBadge(tpl.type)}
                    className="shrink-0 capitalize text-xs"
                  >
                    {tpl.type}
                  </Badge>
                </div>
                {tpl.niche_category && (
                  <p className="text-xs text-muted-foreground">
                    {tpl.niche_category}
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <CardDescription className="text-sm">
                  {tpl.description ?? "No description available."}
                </CardDescription>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link
                    href={`/projects/new?template=${tpl.id}&type=${tpl.type}`}
                  >
                    Use Template
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
