"use client";
import type { Project, Module, Lesson } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { useEditorStore } from "@/stores/editor-store";
import { Button } from "@/components/ui/button";
import { ModuleTree } from "./ModuleTree";
import { LessonPreview } from "./LessonPreview";
import { PropertyPanel } from "./PropertyPanel";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Video, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface EditorLayoutProps {
  project: Project;
  modules: (Module & { lessons: Lesson[] })[];
}

type RenderStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "queued"; jobId: string }
  | { kind: "error"; message: string };

export function EditorLayout({ project, modules }: EditorLayoutProps) {
  const { setProject, setModules } = useProjectStore();
  const { isGenerating, selectedLessonId } = useEditorStore();
  const [renderStatus, setRenderStatus] = useState<RenderStatus>({ kind: "idle" });

  useEffect(() => {
    setProject(project);
    setModules(modules);
  }, [project, modules, setProject, setModules]);

  // Reset status when the selected lesson changes so stale state doesn't bleed across.
  useEffect(() => {
    setRenderStatus({ kind: "idle" });
  }, [selectedLessonId]);

  const handleRender = useCallback(async () => {
    const lessonId = selectedLessonId;
    if (!lessonId) {
      setRenderStatus({ kind: "error", message: "Select a lesson before rendering." });
      return;
    }

    setRenderStatus({ kind: "loading" });

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, compositionId: "lesson-video" }),
      });

      const data = (await res.json()) as { jobId?: string; error?: string };

      if (!res.ok) {
        setRenderStatus({ kind: "error", message: data.error ?? `Server error (${res.status})` });
        return;
      }

      setRenderStatus({ kind: "queued", jobId: data.jobId ?? "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setRenderStatus({ kind: "error", message });
    }
  }, [selectedLessonId]);

  const isRenderInFlight = renderStatus.kind === "loading";

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
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <span className="text-zinc-600 select-none">/</span>
          <h1
            className="text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-xs"
            title={project.title}
          >
            {project.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Render status inline badge */}
          {renderStatus.kind === "queued" && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-900/50 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              Render queued — this may take a few minutes
            </span>
          )}
          {renderStatus.kind === "error" && (
            <span className="flex items-center gap-1.5 text-xs text-red-300 bg-red-900/50 px-2.5 py-1 rounded-full max-w-xs truncate">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {renderStatus.message}
            </span>
          )}

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
            disabled={isGenerating || isRenderInFlight || renderStatus.kind === "queued"}
            onClick={handleRender}
            className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60"
          >
            {isRenderInFlight ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Video className="w-4 h-4" />
            )}
            {isRenderInFlight ? "Queuing…" : isGenerating ? "Generating…" : "Render"}
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
