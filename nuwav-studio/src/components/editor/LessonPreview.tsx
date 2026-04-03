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

/** Build minimal Remotion slide data from a lesson for in-editor preview. */
function buildPreviewProps(
  title: string,
  script: string | null,
  durationSeconds: number | null,
  primaryColor: string,
  companyName: string
): LessonVideoProps {
  const fps = 30;
  const scriptSeconds = Math.max(30, durationSeconds ?? 120);

  const slides: LessonVideoProps["slides"] = [
    {
      type: "title",
      title,
      durationInFrames: 90,
    },
  ];

  if (script) {
    // Show up to 300 chars as body; the rest as a second content slide
    const first = script.slice(0, 300);
    const rest = script.length > 300 ? script.slice(300, 600) : null;

    slides.push({
      type: "content",
      heading: title,
      body: first,
      durationInFrames: Math.round((scriptSeconds * fps) / (rest ? 2 : 1)),
    });

    if (rest) {
      slides.push({
        type: "content",
        heading: "Continued",
        body: rest,
        durationInFrames: Math.round((scriptSeconds * fps) / 2),
      });
    }
  } else {
    slides.push({
      type: "content",
      heading: title,
      body: "No script yet — write one in the Script panel.",
      durationInFrames: 120,
    });
  }

  const totalFrames = slides.reduce((s, sl) => s + sl.durationInFrames, 0);

  return {
    title,
    slides,
    brandSettings: {
      primaryColor,
      backgroundColor: "#0d0d1a",
      companyName,
    },
    totalFrames,
  } as LessonVideoProps & { totalFrames: number };
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

  const primaryColor =
    (project?.brand_settings as { colors?: { primary?: string } } | null)
      ?.colors?.primary ?? "#6366f1";
  const companyName = project?.title ?? "NuWav Studio";

  const previewProps = buildPreviewProps(
    selectedLesson.title,
    selectedLesson.script,
    selectedLesson.duration_seconds,
    primaryColor,
    companyName
  );

  const totalFrames =
    (previewProps as LessonVideoProps & { totalFrames: number }).totalFrames;

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
        {selectedLesson.video_url ? (
          <video
            src={selectedLesson.video_url}
            controls
            className="w-full h-full object-contain"
            poster={selectedLesson.thumbnail_url ?? undefined}
          />
        ) : (
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
