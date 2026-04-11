import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    variant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
      {action && (
        <Button asChild variant={action.variant ?? "default"} size={action.size ?? "lg"}>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
