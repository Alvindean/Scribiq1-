"use client";

import { useState } from "react";
import {
  GraduationCap,
  Star,
  Zap,
  CalendarDays,
  Dumbbell,
  Wrench,
  Play,
  FileText,
  type LucideProps,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  COURSE_TEMPLATES,
  templateLessonCount,
  type CourseTemplate,
} from "@/lib/templates";

// ─── Icon map ─────────────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  GraduationCap,
  Star,
  Zap,
  CalendarDays,
  Dumbbell,
  Wrench,
  Play,
  FileText,
};

function TemplateIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon className={cn("h-6 w-6", className)} strokeWidth={1.75} />;
}

// ─── Badge colour map ──────────────────────────────────────────────────────────

const BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Popular: "default",
  New: "secondary",
};

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: CourseTemplate;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const lessonCount = templateLessonCount(template);
  const moduleCount = template.modules.length;
  const isBlank = template.id === "blank";

  return (
    <Card
      onClick={() => onSelect(template.id)}
      className={cn(
        "relative cursor-pointer border-2 transition-all duration-200",
        "hover:shadow-lg",
        selected
          ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
          : "border-border hover:border-primary/60",
        // Glow effect on hover
        "hover:[box-shadow:0_0_0_2px_hsl(var(--primary)/0.15),0_4px_16px_hsl(var(--primary)/0.12)]"
      )}
    >
      {/* Badge */}
      {template.badge && (
        <div className="absolute -top-2.5 right-3 z-10">
          <Badge
            variant={BADGE_VARIANT[template.badge] ?? "default"}
            className="text-[10px] px-2 py-0.5"
          >
            {template.badge}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        {/* Icon + type pill row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              selected
                ? "bg-primary/15 text-primary"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <TemplateIcon name={template.icon} />
          </div>

          {!isBlank && (
            <span className="mt-0.5 text-[10px] uppercase tracking-wide font-semibold text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
              {template.type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CardTitle className="text-base leading-tight">{template.name}</CardTitle>
          {selected && (
            <span className="text-primary text-sm font-bold leading-none">✓</span>
          )}
        </div>

        <CardDescription className="text-sm leading-relaxed">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Module / lesson counts */}
        {!isBlank && (
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{moduleCount}</span>
              {moduleCount === 1 ? "module" : "modules"}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{lessonCount}</span>
              {lessonCount === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        )}

        {/* Use Template button */}
        <Button
          size="sm"
          variant={selected ? "default" : "outline"}
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(template.id);
          }}
        >
          {isBlank ? "Start Blank" : selected ? "Selected" : "Use Template"}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── TemplateSelector ─────────────────────────────────────────────────────────

export interface TemplateSelectorProps {
  /** The currently selected template id, or null for blank. */
  selected: string | null;
  /** Called with the template id when the user picks one, or "blank". */
  onSelect: (id: string | null) => void;
  /** Optional className for the outer container. */
  className?: string;
}

export function TemplateSelector({
  selected,
  onSelect,
  className,
}: TemplateSelectorProps) {
  // Internal selected state — null means blank template
  const [localSelected, setLocalSelected] = useState<string | null>(selected);

  function handleSelect(id: string) {
    const next = id === "blank" ? null : id;
    setLocalSelected(next);
    onSelect(next);
  }

  // Sort so "blank" is always last
  const sorted = [...COURSE_TEMPLATES].sort((a, b) => {
    if (a.id === "blank") return 1;
    if (b.id === "blank") return -1;
    return 0;
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={
              template.id === "blank"
                ? localSelected === null
                : localSelected === template.id
            }
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center pt-2">
        You can always add, remove, and reorder modules after the project is created.
      </p>
    </div>
  );
}

export default TemplateSelector;
