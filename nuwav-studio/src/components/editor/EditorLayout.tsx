"use client";
import type { Project, Module, Lesson } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { useEditorStore } from "@/stores/editor-store";
import { Button } from "@/components/ui/button";
import { ModuleTree } from "./ModuleTree";
import { LessonPreview } from "./LessonPreview";
import { PropertyPanel } from "./PropertyPanel";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";

interface EditorLayoutProps {
  project: Project;
  modules: (Module & { lessons: Lesson[] })[];
}

export function EditorLayout({ project, modules }: EditorLayoutProps) {
  const { setProject, setModules } = useProjectStore();
  const { isGenerating } = useEditorStore();

  useEffect(() => {
    setProject(project);
    setModules(modules);
  }, [project, modules, setProject, setModules]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <span className="text-zinc-600 select-none">/</span>
          <h1 className="text-sm font-semibold text-white truncate max-w-xs">
            {project.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              project.status === "published"
                ? "bg-emerald-900 text-emerald-300"
                : project.status === "review"
                  ? "bg-amber-900 text-amber-300"
                  : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {project.status}
          </span>
          <Button
            size="sm"
            disabled={isGenerating}
            className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Video className="w-4 h-4" />
            {isGenerating ? "Rendering…" : "Render"}
          </Button>
        </div>
      </header>

      {/* 3-Panel Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Panel – Module Tree */}
        <aside
          className="shrink-0 border-r border-zinc-800 overflow-hidden flex flex-col"
          style={{ width: 280 }}
        >
          <ModuleTree />
        </aside>

        {/* Center Panel – Lesson Preview */}
        <main className="flex-1 min-w-0 overflow-auto bg-zinc-900">
          <LessonPreview />
        </main>

        {/* Right Panel – Property Panel */}
        <aside
          className="shrink-0 border-l border-zinc-800 overflow-hidden flex flex-col"
          style={{ width: 320 }}
        >
          <PropertyPanel />
        </aside>
      </div>
    </div>
  );
}
