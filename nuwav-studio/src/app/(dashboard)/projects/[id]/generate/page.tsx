"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2, Sparkles, Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type GenerationStage = "outline" | "scripts" | "voiceover" | "complete";

interface StageInfo {
  key: GenerationStage;
  label: string;
  description: string;
  emoji: string;
}

interface SSEEvent {
  step: string;
  message: string;
  progress: number;
}

const STAGES: StageInfo[] = [
  { key: "outline",   label: "Building Outline",   description: "Structuring modules and lessons…",      emoji: "🗂️" },
  { key: "scripts",   label: "Writing Scripts",    description: "AI crafting scripts for each lesson…",  emoji: "✍️" },
  { key: "voiceover", label: "Voiceover",          description: "Generating audio tracks…",              emoji: "🎙️" },
  { key: "complete",  label: "Done!",              description: "Your content is ready.",                emoji: "🎉" },
];

const STAGE_ORDER: GenerationStage[] = ["outline", "scripts", "voiceover", "complete"];

const TIPS = [
  "NuWav AI writes scripts optimized for engagement and retention.",
  "Your voiceover is generated using human-like ElevenLabs voices.",
  "Each lesson script is tailored to your target audience's language level.",
  "You can edit any script in the editor before rendering video.",
  "Remotion renders your lessons as full 1080p MP4 videos.",
  "You can publish your course as a hosted page with one click.",
  "Add your brand colors and logo in Settings → Brand.",
  "VSL scripts follow the proven AIDA persuasion framework.",
];

function stepToStage(step: string): GenerationStage {
  if (["outline", "outline_done", "modules_created"].includes(step)) return "outline";
  if (step === "lesson_scripted") return "scripts";
  if (step === "voiceover_generated") return "voiceover";
  if (step === "complete") return "complete";
  return "outline";
}

// ─── Elapsed timer ────────────────────────────────────────────────────────────

function ElapsedTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <span className="font-mono text-sm text-muted-foreground tabular-nums">
      {m > 0 ? `${m}m ` : ""}{String(s).padStart(2, "0")}s
    </span>
  );
}

// ─── Rotating tips ────────────────────────────────────────────────────────────

function RotatingTip() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % TIPS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-start gap-2 rounded-lg bg-violet-50 border border-violet-100 px-4 py-3 min-h-[56px]">
      <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
      <p
        className="text-sm text-violet-700 leading-snug transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {TIPS[idx]}
      </p>
    </div>
  );
}

// ─── Activity log ─────────────────────────────────────────────────────────────

function ActivityLog({ entries }: { entries: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
    <div className="rounded-lg border bg-zinc-950 text-zinc-300 font-mono text-xs p-3 h-36 overflow-y-auto space-y-1">
      {entries.map((entry, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-zinc-600 shrink-0 select-none">›</span>
          <span>{entry}</span>
        </div>
      ))}
      {entries.length === 0 && (
        <span className="text-zinc-600">Starting generation…</span>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

// ─── Stage list ───────────────────────────────────────────────────────────────

function StageList({ currentStage }: { currentStage: GenerationStage }) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="space-y-2">
      {STAGES.map((stage, i) => {
        const isDone    = i < currentIdx;
        const isActive  = i === currentIdx;
        const isPending = i > currentIdx;

        return (
          <div
            key={stage.key}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 border transition-all duration-500 ${
              isDone    ? "border-violet-200 bg-violet-50" :
              isActive  ? "border-violet-400 bg-violet-50 shadow-sm shadow-violet-100" :
                          "border-border opacity-40"
            }`}
          >
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0" />
            ) : isActive ? (
              <Loader2 className="w-5 h-5 text-violet-500 shrink-0 animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}

            <span className="text-lg">{stage.emoji}</span>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${isActive ? "text-violet-700" : isDone ? "text-violet-600" : "text-muted-foreground"}`}>
                {stage.label}
              </p>
              {(isActive || isDone) && (
                <p className="text-xs text-muted-foreground truncate">
                  {isDone ? "Completed" : stage.description}
                </p>
              )}
            </div>

            {isDone && (
              <span className="text-xs text-violet-500 font-medium shrink-0">✓</span>
            )}
            {isActive && (
              <span className="flex gap-0.5 shrink-0">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [stage, setStage] = useState<GenerationStage>("outline");
  const [apiProgress, setApiProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Starting generation…");
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [startTime] = useState(() => Date.now());
  const abortRef = useRef<AbortController | null>(null);

  const progress = stage === "complete" ? 100 : apiProgress > 0 ? apiProgress : 5;
  const isComplete = stage === "complete";

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
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6)) as SSEEvent;
              if (event.step === "error") { setError(event.message); return; }
              setStage(stepToStage(event.step));
              setApiProgress(event.progress);
              setStatusMessage(event.message);
              setLog((prev) => [...prev, event.message]);
            } catch { /* ignore malformed */ }
          }
        }

        setStage("complete");
        setApiProgress(100);
        setStatusMessage("Generation complete!");
        setLog((prev) => [...prev, "✓ All content generated successfully!"]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to start generation");
      }
    };

    run();
    return () => { abortRef.current?.abort(); };
  }, [id, started]);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 space-y-5">

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">
          {isComplete ? "Your content is ready! 🎉" : "AI is building your content"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isComplete
            ? "Head to the editor to review and refine."
            : "Sit tight — this usually takes 1–3 minutes."}
        </p>
      </div>

      {/* Progress bar + timer */}
      {!isComplete && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{statusMessage}</span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <ElapsedTimer startTime={startTime} />
            </div>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2.5 rounded-full" />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-500 border-2 border-white shadow transition-all duration-500"
              style={{ right: `${100 - progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-semibold text-violet-600">{progress}%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Stage list */}
      <StageList currentStage={stage} />

      {/* Live activity log */}
      {!isComplete && !error && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Activity</p>
          <ActivityLog entries={log} />
        </div>
      )}

      {/* Rotating tips */}
      {!isComplete && !error && <RotatingTip />}

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-destructive">Generation failed</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setError(null); setStarted(false); setStage("outline"); setApiProgress(0); setLog([]); }}>
              Retry
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${id}`}>Back to project</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Complete CTA */}
      {isComplete && !error && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700 w-full">
            <Link href={`/projects/${id}/editor`}>Open Editor →</Link>
          </Button>
          <button type="button" onClick={() => router.push("/dashboard")} className="text-xs text-muted-foreground hover:underline">
            Back to dashboard
          </button>
        </div>
      )}

      {/* Safe to leave notice */}
      {!isComplete && !error && (
        <p className="text-center text-xs text-muted-foreground">
          Safe to leave — generation continues in the background.{" "}
          <button type="button" onClick={() => router.push("/dashboard")} className="underline underline-offset-2">
            Go to dashboard
          </button>
        </p>
      )}
    </div>
  );
}
