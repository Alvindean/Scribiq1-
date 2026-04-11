"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Quick-start card data
const QUICK_START_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1e1b4b" />
        <path
          d="M12 14h16v2H12zm0 5h16v2H12zm0 5h10v2H12z"
          fill="#a78bfa"
        />
        <circle cx="30" cy="26" r="5" fill="#7c3aed" />
        <path d="M28 26l1.5 1.5L33 23.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
    label: "AI Course",
    description:
      "Generate a full structured course with AI-written scripts, slides, and voiceover.",
    href: "/projects/new?type=course",
    cta: "Start a Course",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1e1b4b" />
        {/* clapperboard */}
        <rect x="11" y="18" width="18" height="13" rx="2" fill="#4338ca" />
        <rect x="11" y="14" width="18" height="5" rx="2" fill="#6d28d9" />
        {/* clap sticks */}
        <line x1="15" y1="14" x2="14" y2="19" stroke="#a78bfa" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="20" y2="19" stroke="#a78bfa" strokeWidth="1.5" />
        <line x1="25" y1="14" x2="26" y2="19" stroke="#a78bfa" strokeWidth="1.5" />
        {/* play triangle */}
        <polygon points="17,22 17,28 24,25" fill="#a78bfa" />
      </svg>
    ),
    label: "VSL",
    description:
      "Build a high-converting Video Sales Letter with AI copy and auto-rendered video.",
    href: "/projects/new?type=vsl",
    cta: "Build a VSL",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#1e1b4b" />
        {/* music note */}
        <path
          d="M24 12v12.26A3.5 3.5 0 1 1 21 21V16l-6 1.5V25a3.5 3.5 0 1 1-3-3.45V14l12-2Z"
          fill="#8b5cf6"
        />
        {/* pencil */}
        <path d="M27 22l-4 4 1 1 4-4-1-1Z" fill="#c4b5fd" />
        <path d="M23 26l-1 2 2-1-1-1Z" fill="#c4b5fd" />
      </svg>
    ),
    label: "Lyric Editor",
    description:
      "Write, sync, and format lyrics for any track in your Music Library.",
    href: "/music",
    cta: "Open Lyric Editor",
  },
];

export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-dashed border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-transparent py-16 px-4 text-center">
      {/* Big icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-950/70 ring-1 ring-violet-700/40 shadow-lg shadow-violet-950/30">
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
          <path
            d="M8 40V16L24 8l16 8v24H8Z"
            fill="#312e81"
            stroke="#7c3aed"
            strokeWidth="2"
          />
          <path d="M16 40V28h16v12H16Z" fill="#4338ca" />
          <circle cx="24" cy="20" r="4" fill="#a78bfa" />
          <path d="M20 40h8" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-2xl font-bold tracking-tight text-white">
          Create your first project
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Pick a format below and the AI will do the heavy lifting — from
          outline to finished content in minutes.
        </p>
      </div>

      {/* Quick-start cards */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_START_CARDS.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-center transition-all hover:border-violet-700/60 hover:bg-zinc-900 hover:shadow-md hover:shadow-violet-950/30"
          >
            {card.icon}
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-sm">{card.label}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {card.description}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className="mt-auto w-full bg-violet-700 text-white hover:bg-violet-600"
            >
              <Link href={card.href}>{card.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
