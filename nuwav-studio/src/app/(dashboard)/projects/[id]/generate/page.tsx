"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// ─── Types ────────────────────────────────────────────────────────────────────

type GenerationStage = "outline" | "scripts" | "voiceover" | "complete";

interface StageInfo {
  key: GenerationStage;
  label: string;
  description: string;
}

interface SSEEvent {
  step: string;
  message: string;
  progress: number;
}

const STAGES: StageInfo[] = [
  {
    key: "outline",
    label: "Outline",
    description: "Building module and lesson structure…",
  },
  {
    key: "scripts",
    label: "Scripts",
    description: "Writing AI-powered scripts for each lesson…",
  },
  {
    key: "voiceover",
    label: "Voiceover",
    description: "Generating voiceover audio tracks…",
  },
  {
    key: "complete",
    label: "Complete",
    description: "All content has been generated.",
  },
];

const STAGE_ORDER: GenerationStage[] = ["outline", "scripts", "voiceover", "complete"];

function stageIndex(stage: GenerationStage): number {
  return STAGE_ORDER.indexOf(stage);
}

function stageProgress(stage: GenerationStage, apiProgress: number): number {
  if (stage === "complete") return 100;
  if (apiProgress > 0) return apiProgress;
  const idx = stageIndex(stage);
  return Math.round(((idx + 1) / STAGES.length) * 100);
}

/** Map API `step` strings to display stages */
function stepToStage(step: string): GenerationStage {
  if (step === "outline" || step === "outline_done" || step === "modules_created") {
    return "outline";
  }
  if (step === "lesson_scripted") return "scripts";
  if (step === "voiceover_generated") return "voiceover";
  if (step === "complete") return "complete";
  return "outline";
}

// ─── Stage indicator ──────────────────────────────────────────────────────────

function StageIndicator({
  stage,
  currentStage,
}: {
  stage: StageInfo;
  currentStage: GenerationStage;
}) {
  const current = stageIndex(currentStage);
  const mine = stageIndex(stage.key);
  const isDone = mine < current;
  const isActive = mine === current;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
        isDone
          ? "border-primary/30 bg-primary/5"
          : isActive
          ? "border-primary bg-primary/10"
          : "border-border opacity-50"
      }`}
    >
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isDone
            ? "bg-primary text-primary-foreground"
            : isActive
            ? "border-2 border-primary text-primary animate-pulse"
            : "border-2 border-muted text-muted-foreground"
        }`}
      >
        {isDone ? "✓" : stageIndex(stage.key) + 1}
      </div>
      <div>
        <p
          className={`font-medium text-sm ${
            isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {stage.label}
        </p>
        {isActive && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {stage.description}
          </p>
        )}
        {isDone && (
          <p className="text-xs text-muted-foreground mt-0.5">Done</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [stage, setStage] = useState<GenerationStage>("outline");
  const [apiProgress, setApiProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Starting generation…"
  );
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (started) return;
    setStarted(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE messages are delimited by double newline
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6)) as SSEEvent;

              if (event.step === "error") {
                setError(event.message);
                return;
              }

              const newStage = stepToStage(event.step);
              setStage(newStage);
              setApiProgress(event.progress);
              setStatusMessage(event.message);
            } catch {
              // Ignore malformed SSE lines
            }
          }
        }

        // Stream ended — mark complete if not already
        setStage("complete");
        setApiProgress(100);
        setStatusMessage("Generation complete!");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Failed to start generation"
        );
      }
    };

    run();

    return () => {
      abortRef.current?.abort();
    };
  }, [id, started]);

  const progress = stageProgress(stage, apiProgress);
  const isComplete = stage === "complete";

  const handleRetry = () => {
    setError(null);
    setStarted(false);
    setStage("outline");
    setApiProgress(0);
    setStatusMessage("Starting generation…");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Generating your project</h1>
        <p className="text-muted-foreground">
          AI is building your content. This usually takes 1–3 minutes.
        </p>
      </div>

      {/* Progress bar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              {isComplete ? "Generation complete!" : statusMessage}
            </CardTitle>
            <span className="text-sm font-semibold text-primary">
              {progress}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Stage indicators */}
      <div className="grid gap-3">
        {STAGES.map((s) => (
          <StageIndicator key={s.key} stage={s} currentStage={stage} />
        ))}
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive font-medium">
              Generation failed
            </p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Retry
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${id}`}>Back to project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete state */}
      {isComplete && !error && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-sm text-muted-foreground text-center">
            Your scripts, outlines, and voiceovers are ready. Head to the editor
            to review and refine.
          </p>
          <Button asChild size="lg">
            <Link href={`/projects/${id}/editor`}>Go to Editor</Link>
          </Button>
        </div>
      )}

      {/* Back link when not yet complete */}
      {!isComplete && !error && (
        <p className="text-center text-xs text-muted-foreground">
          You can safely leave this page — generation will continue in the
          background.{" "}
          <button
            type="button"
            onClick={() => router.push(`/projects/${id}`)}
            className="underline underline-offset-2"
          >
            Go back
          </button>
        </p>
      )}
    </div>
  );
}
