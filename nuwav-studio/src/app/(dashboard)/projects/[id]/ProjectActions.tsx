"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, Clapperboard, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectActionsProps {
  id: string;
}

export function ProjectActions({ id }: ProjectActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* More dropdown */}
      <div className="relative" ref={ref}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <MoreHorizontal className="h-4 w-4 mr-1" />
          More
        </Button>
        {open && (
          <div
            role="menu"
            className="absolute right-0 mt-1 z-50 min-w-[140px] bg-background border rounded-md shadow-md py-1"
          >
            <Link
              href={`/projects/${id}/editor`}
              role="menuitem"
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Edit
            </Link>
            <Link
              href={`/projects/${id}/preview`}
              role="menuitem"
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Preview
            </Link>
            <Link
              href={`/projects/${id}/export`}
              role="menuitem"
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Export
            </Link>
          </div>
        )}
      </div>

      {/* Analytics */}
      <Button asChild variant="outline" size="sm" className="gap-1.5">
        <Link href={`/projects/${id}/analytics`}>
          <BarChart2 className="h-4 w-4" />
          Analytics
        </Link>
      </Button>

      {/* VSL Builder */}
      <Button asChild variant="outline" size="sm" className="gap-1.5">
        <Link href={`/projects/${id}/vsl`}>
          <Clapperboard className="h-4 w-4" />
          VSL Builder
        </Link>
      </Button>

      {/* Publish */}
      <Button asChild variant="outline" size="sm">
        <Link href={`/projects/${id}/publish`}>Publish</Link>
      </Button>

      {/* Generate — primary CTA */}
      <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
        <Link href={`/projects/${id}/generate`}>Generate</Link>
      </Button>
    </div>
  );
}
