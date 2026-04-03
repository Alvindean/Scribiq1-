"use client";
import { useEditorStore } from "@/stores/editor-store";
import { Button } from "@/components/ui/button";
import { Play, Video, Clock, FileText } from "lucide-react";

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function LessonPreview() {
  const { selectedLesson, isGenerating, setIsGenerating } = useEditorStore();

  if (!selectedLesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-3">
        <Video className="w-10 h-10 opacity-30" />
        <p className="text-sm">Select a lesson to preview</p>
      </div>
    );
  }

  const scriptPreview = selectedLesson.script
    ? selectedLesson.script.slice(0, 200) +
      (selectedLesson.script.length > 200 ? "…" : "")
    : null;

  const handleRender = () => {
    setIsGenerating(true);
    // Render action wired up externally via API route
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      {/* Video Player */}
      <div className="relative w-full rounded-xl overflow-hidden bg-zinc-800 aspect-video flex items-center justify-center">
        {selectedLesson.video_url ? (
          <video
            src={selectedLesson.video_url}
            controls
            className="w-full h-full object-contain"
            poster={selectedLesson.thumbnail_url ?? undefined}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-zinc-600">
            {selectedLesson.thumbnail_url && (
              <img
                src={selectedLesson.thumbnail_url}
                alt="Thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-zinc-700/80 flex items-center justify-center">
                <Play className="w-7 h-7 text-zinc-400 ml-1" />
              </div>
              <p className="text-xs text-zinc-500">No video rendered yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Meta */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">
          {selectedLesson.title}
        </h2>

        <div className="flex items-center gap-4 text-zinc-500 text-sm">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(selectedLesson.duration_seconds)}
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
          <p className="text-sm text-zinc-300 leading-relaxed">{scriptPreview}</p>
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
