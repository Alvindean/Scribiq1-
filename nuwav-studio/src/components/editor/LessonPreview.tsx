"use client";
import dynamic from "next/dynamic";
import { useEditorStore } from "@/stores/editor-store";
import { useProjectStore } from "@/stores/project-store";
import { Button } from "@/components/ui/button";
import { Play, Video, Clock, FileText } from "lucide-react";
import type { LessonVideoProps } from "@/remotion/compositions/LessonVideo";

// Player must be loaded client-side only — it uses browser APIs
const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false }
);

// LessonVideo is also loaded dynamically to keep the SSR bundle clean
const LessonVideo = dynamic(
  () =>
    import("@/remotion/compositions/LessonVideo").then((m) => m.LessonVideo),
  { ssr: false }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Estimate total Remotion frames from a script string (5 s / slide at 30fps). */
function estimateTotalFrames(script: string): number {
  const FRAMES_PER_SLIDE = 150;
  // 1 title + content slides (~200 chars each) + 1 outro
  const contentSlides = Math.max(1, Math.ceil(script.length / 200));
  return (1 + contentSlides + 1) * FRAMES_PER_SLIDE;
}

/** Build LessonVideoProps for in-editor preview from a lesson. */
function buildPreviewProps(
  title: string,
  script: string | null,
): LessonVideoProps {
  return {
    title,
    script: script ?? "",
    modules: "",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonPreview() {
  const { selectedLesson, isGenerating, setIsGenerating } = useEditorStore();
  const { project } = useProjectStore();

  if (!selectedLesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-3">
        <Video className="w-10 h-10 opacity-30" />
        <p className="text-sm">Select a lesson to preview</p>
      </div>
    );
  }

  const previewProps = buildPreviewProps(
    selectedLesson.title,
    selectedLesson.script,
  );

  const totalFrames = estimateTotalFrames(previewProps.script);

  const scriptPreview = selectedLesson.script
    ? selectedLesson.script.slice(0, 200) +
      (selectedLesson.script.length > 200 ? "…" : "")
    : null;

  const handleRender = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      {/* Remotion Player / Video Player */}
      <div className="relative w-full rounded-xl overflow-hidden bg-zinc-800 aspect-video">
        {selectedLesson.videoUrl ? (
          <video
            src={selectedLesson.videoUrl}
            controls
            className="w-full h-full object-contain"
            poster={selectedLesson.thumbnailUrl ?? undefined}
          />
        ) : (
          <>
            <Player
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              component={LessonVideo as any}
              inputProps={previewProps}
              durationInFrames={totalFrames}
              fps={30}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{ width: "100%", height: "100%" }}
              controls
              loop
            />
            {/* No thumbnail placeholder: show lesson title centred */}
            {!selectedLesson.thumbnailUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white/20 text-xl font-semibold text-center px-6 select-none">
                  {selectedLesson.title}
                </span>
              </div>
            )}
          </>
        )}
        {/* Quick-access Render Video button — top-right of the video container */}
        <button
          onClick={handleRender}
          disabled={isGenerating}
          title="Render Video"
          className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600/80 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white backdrop-blur-sm transition-colors"
        >
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* Lesson Meta */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">
          {selectedLesson.title}
        </h2>

        <div className="flex items-center gap-4 text-zinc-500 text-sm">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(selectedLesson.durationSeconds)}
          </span>
          <span
            className={`capitalize text-xs px-2 py-0.5 rounded-full font-medium ${
              selectedLesson.status === "published"
                ? "bg-violet-900/50 text-violet-300"
                : selectedLesson.status === "rendered"
                  ? "bg-emerald-900/50 text-emerald-300"
                  : selectedLesson.status === "voiced"
                    ? "bg-amber-900/50 text-amber-300"
                    : selectedLesson.status === "scripted"
                      ? "bg-blue-900/50 text-blue-300"
                      : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {selectedLesson.status}
          </span>
        </div>
      </div>

      {/* Script Preview */}
      {scriptPreview && (
        <div className="rounded-lg bg-zinc-800/60 border border-zinc-700/50 p-4">
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <FileText className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Script Preview
            </span>
          </div>
          <div className="relative overflow-hidden">
            <p className="text-sm text-zinc-300 leading-relaxed">{scriptPreview}</p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-800/60 to-transparent rounded-b-lg pointer-events-none" />
          </div>
        </div>
      )}

      {!scriptPreview && (
        <div className="rounded-lg bg-zinc-800/40 border border-dashed border-zinc-700 p-4 text-center">
          <p className="text-sm text-zinc-600">No script written yet.</p>
        </div>
      )}

      {/* Render Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleRender}
          disabled={isGenerating}
          className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Video className="w-4 h-4" />
          {isGenerating ? "Rendering…" : "Render Video"}
        </Button>
      </div>
    </div>
  );
}
