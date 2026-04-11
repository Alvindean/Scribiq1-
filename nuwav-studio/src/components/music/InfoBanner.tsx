"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InfoBannerProps {
  storageKey: string;
  children: React.ReactNode;
}

export function InfoBanner({ storageKey, children }: InfoBannerProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <div className="flex items-start justify-between gap-2">
        <div className={`space-y-1 overflow-hidden transition-all ${open ? "max-h-96" : "max-h-0"}`}>
          {children}
        </div>
        <button
          type="button"
          aria-label={open ? "Collapse info" : "Expand info"}
          onClick={() => setOpen((v) => !v)}
          className="mt-0.5 shrink-0 rounded p-0.5 hover:bg-muted transition-colors"
        >
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
