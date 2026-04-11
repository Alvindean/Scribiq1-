"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "soniq:onboarded";

// ── Illustrations ────────────────────────────────────────────────────────────

function IllustrationStudio() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
      <rect width="120" height="80" rx="10" fill="#1e1b4b" />
      {/* waveform bars */}
      {[14, 24, 34, 44, 54, 64, 74, 84, 94, 104].map((x, i) => {
        const heights = [20, 36, 28, 44, 32, 40, 24, 38, 30, 22];
        const h = heights[i];
        return (
          <rect
            key={x}
            x={x - 3}
            y={40 - h / 2}
            width={6}
            height={h}
            rx={3}
            fill={i % 2 === 0 ? "#7c3aed" : "#a78bfa"}
            opacity={0.9}
          />
        );
      })}
      {/* play button */}
      <circle cx="60" cy="68" r="7" fill="#7c3aed" />
      <polygon points="57,65 57,71 64,68" fill="white" />
    </svg>
  );
}

function IllustrationCourse() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
      <rect width="120" height="80" rx="10" fill="#1e1b4b" />
      {/* book */}
      <rect x="30" y="15" width="60" height="45" rx="4" fill="#312e81" />
      <rect x="30" y="15" width="30" height="45" rx="4" fill="#4338ca" />
      {/* lines */}
      <rect x="37" y="27" width="16" height="3" rx="1.5" fill="#a78bfa" />
      <rect x="37" y="34" width="16" height="3" rx="1.5" fill="#a78bfa" opacity="0.7" />
      <rect x="37" y="41" width="12" height="3" rx="1.5" fill="#a78bfa" opacity="0.5" />
      {/* right page lines */}
      <rect x="68" y="27" width="16" height="3" rx="1.5" fill="#6d28d9" opacity="0.6" />
      <rect x="68" y="34" width="12" height="3" rx="1.5" fill="#6d28d9" opacity="0.4" />
      {/* sparkle */}
      <circle cx="87" cy="20" r="5" fill="#7c3aed" opacity="0.8" />
      <polygon points="87,15 88.5,18.5 92,18.5 89.2,20.8 90.3,24.3 87,22.2 83.7,24.3 84.8,20.8 82,18.5 85.5,18.5" fill="#c4b5fd" />
    </svg>
  );
}

function IllustrationTips() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
      <rect width="120" height="80" rx="10" fill="#1e1b4b" />
      {/* three cards */}
      {[10, 42, 74].map((x, i) => (
        <g key={x}>
          <rect x={x} y="18" width="30" height="40" rx="4" fill={["#312e81", "#3730a3", "#2e1065"][i]} />
          <circle cx={x + 15} cy="30" r="6" fill={["#7c3aed", "#6d28d9", "#8b5cf6"][i]} opacity="0.9" />
          <rect x={x + 5} y="42" width="20" height="3" rx="1.5" fill="#a78bfa" opacity="0.7" />
          <rect x={x + 7} y="49" width="16" height="3" rx="1.5" fill="#a78bfa" opacity="0.4" />
        </g>
      ))}
      {/* checkmarks */}
      <polyline points="18,29 21,33 27,26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <polyline points="50,29 53,33 59,26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <polyline points="82,29 85,33 91,26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Steps data ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    illustration: <IllustrationStudio />,
    title: "Welcome to Soniq",
    description:
      "Soniq is your all-in-one AI-powered platform for building online courses, video sales letters, and music-backed content — from script to published, in minutes.",
    tip: null,
  },
  {
    illustration: <IllustrationCourse />,
    title: "Create your first course",
    description:
      "Start a new project, choose a type (Course, VSL, or Hybrid), and let the AI generate your script, slides, and voiceover. Then review, edit, and publish with one click.",
    tip: null,
  },
  {
    illustration: <IllustrationTips />,
    title: "Quick tips",
    description: "Three powerful tools to explore:",
    tip: (
      <ul className="mt-3 space-y-2 text-left text-sm">
        <li className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">
            ✍
          </span>
          <span>
            <strong className="text-white">Lyric Editor</strong> — write and
            sync lyrics to any track in the Music Library.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">
            🎬
          </span>
          <span>
            <strong className="text-white">VSL Builder</strong> — create
            high-converting video sales letters with AI-written scripts and
            auto-rendered video.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">
            🎵
          </span>
          <span>
            <strong className="text-white">Music Library</strong> — search,
            preview, and attach royalty-free music to any project or lesson.
          </span>
        </li>
      </ul>
    ),
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

// Lazily read localStorage once on first render (client-side only).
// Using a lazy initialiser avoids calling setState inside an effect.
function readShouldShow(): boolean {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

export function WelcomeModal() {
  const [open, setOpen] = useState<boolean>(readShouldShow);
  const [step, setStep] = useState(0);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!open) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      {/* Modal panel */}
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-violet-800/60 bg-[#0f0e1a] shadow-2xl shadow-violet-950/50">
        {/* Skip button */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="Skip onboarding"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12.78 4.78a.75.75 0 0 0-1.06-1.06L8 7.44 4.28 3.72a.75.75 0 0 0-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06L8 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L9.06 8l3.72-3.72Z" />
          </svg>
        </button>

        {/* Illustration */}
        <div className="mx-6 mt-8 overflow-hidden rounded-xl" style={{ height: 160 }}>
          {current.illustration}
        </div>

        {/* Body */}
        <div className="px-6 pb-2 pt-5 text-center">
          <h2
            id="welcome-modal-title"
            className="text-xl font-bold tracking-tight text-white"
          >
            {current.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {current.description}
          </p>
          {current.tip && (
            <div className="text-zinc-400">{current.tip}</div>
          )}
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 py-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}`}
              className={[
                "h-2 rounded-full transition-all duration-300",
                i === step
                  ? "w-6 bg-violet-500"
                  : "w-2 bg-zinc-700 hover:bg-zinc-500",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
          {/* Back / spacer */}
          {!isFirst ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
              className="text-zinc-400 hover:text-white"
            >
              ← Back
            </Button>
          ) : (
            <button
              onClick={dismiss}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Skip
            </button>
          )}

          {/* Next / Let's go */}
          {isLast ? (
            <Button
              size="sm"
              onClick={dismiss}
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              Let&apos;s go →
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setStep((s) => s + 1)}
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              Next →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
