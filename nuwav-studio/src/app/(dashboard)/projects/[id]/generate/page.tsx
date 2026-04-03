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

function stageProgress(stage: GenerationStage): number {
  const idx = stageIndex(stage);
  return Math.round(((idx + 1) / STAGES.length) * 100);
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
  const [statusMessage, setStatusMessage] = useState<string>(
    "Starting generation…"
  );
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (started) return;
    setStarted(true);

    // Start generation and connect to SSE stream
    const start = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id }),
        });

        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        // Connect to SSE stream
        const es = new EventSource(`/api/generate/stream?projectId=${id}`);
        eventSourceRef.current = es;

        es.addEventListener("stage", (e: MessageEvent<string>) => {
          const data = JSON.parse(e.data) as {
            stage: GenerationStage;
            message: string;
          };
          setStage(data.stage);
          setStatusMessage(data.message);

          if (data.stage === "complete") {
            es.close();
          }
        });

        es.addEventListener("error_event", (e: MessageEvent<string>) => {
          const data = JSON.parse(e.data) as { message: string };
          setError(data.message);
          es.close();
        });

        es.onerror = () => {
          // SSE connection closed after complete — this is normal
          es.close();
        };
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to start generation"
        );
      }
    };

    start();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [id, started]);

  const progress = stageProgress(stage);
  const isComplete = stage === "complete";

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null);
                  setStarted(false);
                  setStage("outline");
                }}
              >
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
