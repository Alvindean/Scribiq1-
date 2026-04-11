"use client";
import type { Project, Module, Lesson } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { useEditorStore } from "@/stores/editor-store";
import { Button } from "@/components/ui/button";
import { ModuleTree } from "./ModuleTree";
import { LessonPreview } from "./LessonPreview";
import { PropertyPanel } from "./PropertyPanel";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  List,
  Eye,
  Settings,
} from "lucide-react";

interface EditorLayoutProps {
  project: Project;
  modules: (Module & { lessons: Lesson[] })[];
}

type PollStatus = "queued" | "rendering" | "complete" | "failed";

type RenderStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "polling"; jobId: string; pollStatus: PollStatus }
  | { kind: "ready"; jobId: string; outputUrl: string | null }
  | { kind: "error"; message: string };

type ActivePanel = "outline" | "preview" | "properties";

const POLL_INTERVAL_MS = 5_000;

export function EditorLayout({ project, modules }: EditorLayoutProps) {
  const { setProject, setModules } = useProjectStore();
  const { isGenerating, selectedLessonId } = useEditorStore();
  const [renderStatus, setRenderStatus] = useState<RenderStatus>({
    kind: "idle",
  });
  const [activePanel, setActivePanel] = useState<ActivePanel>("preview");
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setProject(project);
    setModules(modules);
  }, [project, modules, setProject, setModules]);

  // Reset render status when selected lesson changes so stale state doesn't bleed across.
  useEffect(() => {
    setRenderStatus({ kind: "idle" });
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, [selectedLessonId]);

  // Clean up polling on unmount.
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current !== null) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const startPolling = useCallback((jobId: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/render/${jobId}`);
        if (!res.ok) return; // transient — keep polling

        const data = (await res.json()) as {
          id: string;
          status: PollStatus;
          outputUrl: string | null;
          error: string | null;
        };

        if (data.status === "complete") {
          if (pollIntervalRef.current !== null) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setRenderStatus({ kind: "ready", jobId, outputUrl: data.outputUrl });
        } else if (data.status === "failed") {
          if (pollIntervalRef.current !== null) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setRenderStatus({
            kind: "error",
            message: data.error ?? "Render failed",
          });
        } else {
          // "queued" | "rendering" — update display status but keep polling
          setRenderStatus({ kind: "polling", jobId, pollStatus: data.status });
        }
      } catch {
        // network hiccup — keep polling
      }
    };

    // Run once immediately, then on interval
    void poll();
    pollIntervalRef.current = setInterval(() => void poll(), POLL_INTERVAL_MS);
  }, []);

  const handleRender = useCallback(async () => {
    const lessonId = selectedLessonId;
    if (!lessonId) {
      setRenderStatus({
        kind: "error",
        message: "Select a lesson before rendering.",
      });
      return;
    }

    // Clear any existing poll
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
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
        setRenderStatus({
          kind: "error",
          message: data.error ?? `Server error (${res.status})`,
        });
        return;
      }

      const jobId = data.jobId ?? "";
      setRenderStatus({ kind: "polling", jobId, pollStatus: "queued" });
      startPolling(jobId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setRenderStatus({ kind: "error", message });
    }
  }, [selectedLessonId, startPolling]);

  const isRenderInFlight =
    renderStatus.kind === "loading" || renderStatus.kind === "polling";

  // ── Render status badge ────────────────────────────────────────────────────

  const renderBadge = (() => {
    if (renderStatus.kind === "polling") {
      const label =
        renderStatus.pollStatus === "rendering" ? "Rendering…" : "Queued";
      return (
        <span className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-900/50 px-2.5 py-1 rounded-full">
          <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
          {label}
        </span>
      );
    }
    if (renderStatus.kind === "ready") {
      return (
        <span className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-900/50 px-2.5 py-1 rounded-full">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          Ready
          {renderStatus.outputUrl && (
            <a
              href={renderStatus.outputUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 flex items-center gap-0.5 ml-1"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          )}
        </span>
      );
    }
    if (renderStatus.kind === "error") {
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-300 bg-red-900/50 px-2.5 py-1 rounded-full max-w-xs truncate">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {renderStatus.message}
        </span>
      );
    }
    return null;
  })();

  // ── Mobile tab definitions ─────────────────────────────────────────────────

  const tabs: { id: ActivePanel; label: string; icon: React.ReactNode }[] = [
    { id: "outline", label: "Outline", icon: <List className="w-4 h-4" /> },
    { id: "preview", label: "Preview", icon: <Eye className="w-4 h-4" /> },
    {
      id: "properties",
      label: "Properties",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

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
          {renderBadge}

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
            disabled={isGenerating || isRenderInFlight}
            onClick={handleRender}
            className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60"
          >
            {isRenderInFlight ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Video className="w-4 h-4" />
            )}
            {renderStatus.kind === "loading"
              ? "Queuing…"
              : renderStatus.kind === "polling" &&
                  renderStatus.pollStatus === "rendering"
                ? "Rendering…"
                : isGenerating
                  ? "Generating…"
                  : "Render"}
          </Button>
        </div>
      </header>

      {/* ── Desktop: 3-Panel Body (lg+) ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
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

      {/* ── Mobile: Single Panel + Bottom Tab Bar (below lg) ── */}
      <div className="flex lg:hidden flex-col flex-1 min-h-0 overflow-hidden">
        {/* Active panel */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activePanel === "outline" && (
            <div className="h-full overflow-hidden flex flex-col">
              <ModuleTree />
            </div>
          )}
          {activePanel === "preview" && (
            <main className="h-full overflow-auto bg-zinc-900">
              <LessonPreview />
            </main>
          )}
          {activePanel === "properties" && (
            <div className="h-full overflow-hidden flex flex-col">
              <PropertyPanel />
            </div>
          )}
        </div>

        {/* Bottom Tab Bar */}
        <nav className="shrink-0 border-t border-zinc-800 bg-zinc-950 flex items-stretch">
          {tabs.map((tab) => {
            const isActive = activePanel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePanel(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-violet-400 border-t-2 border-violet-500 -mt-px"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
