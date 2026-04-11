import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-lg bg-violet-600 p-1.5">
        <Waves className={cn("text-white", iconSize)} />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", textSize)}>
          So<span className="text-violet-500">niq</span>
        </span>
      )}
    </div>
  );
}
