"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Play, Pause, ExternalLink, Music2, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { MusicTrack } from "@/app/api/music/search/route";

type Source = "all" | "itunes" | "pixabay" | "freesound";

const SOURCE_LABELS: Record<Source, string> = {
  all: "All Sources",
  itunes: "iTunes",
  pixabay: "Pixabay",
  freesound: "Freesound",
};

const LICENSE_COLORS: Record<MusicTrack["license"], string> = {
  "preview": "bg-amber-100 text-amber-800",
  "royalty-free": "bg-green-100 text-green-800",
  "cc": "bg-blue-100 text-blue-800",
};

const LICENSE_LABELS: Record<MusicTrack["license"], string> = {
  "preview": "Preview only",
  "royalty-free": "Royalty-free",
  "cc": "Creative Commons",
};

function formatDuration(seconds: number): string {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicSearch() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<Source>("all");
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const doSearch = useCallback(async (q: string, src: Source) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/music/search?q=${encodeURIComponent(q)}&source=${src}&limit=30`
      );
      const data = await res.json() as { tracks?: MusicTrack[]; sources?: Record<string, number>; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setTracks(data.tracks ?? []);
      setSourceCounts(data.sources ?? {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setTracks([]);
      setSourceCounts({});
      return;
    }
    const timer = setTimeout(() => {
      doSearch(query.trim(), source);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, source, doSearch]);

  function togglePlay(track: MusicTrack) {
    if (!track.previewUrl) return;

    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(track.previewUrl);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(track.id);
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by song title, artist, mood, or genre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
        {!loading && query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Source filter */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SOURCE_LABELS) as Source[]).map((s) => (
          <button
            key={s}
            onClick={() => setSource(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              source === s
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-background text-muted-foreground border-border hover:border-violet-400 hover:text-violet-600"
            }`}
          >
            {SOURCE_LABELS[s]}
            {s !== "all" && sourceCounts[s] !== undefined && (
              <span className="ml-1.5 opacity-70">({sourceCounts[s]})</span>
            )}
          </button>
        ))}
      </div>

      {/* License legend */}
      {tracks.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {(Object.entries(LICENSE_LABELS) as [MusicTrack["license"], string][]).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1">
              <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${LICENSE_COLORS[k]}`}>{v}</span>
            </span>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Empty state */}
      {!loading && tracks.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center text-muted-foreground">
          <Music2 className="mb-3 h-10 w-10 opacity-30" />
          {query.length > 0 ? (
            <>
              <p className="font-medium">No results</p>
              <p className="mt-1 text-sm">
                No tracks found for &ldquo;{query}&rdquo; — try a different search.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Search for music</p>
              <p className="mt-1 text-sm">
                Try &ldquo;upbeat corporate&rdquo;, &ldquo;lo-fi study&rdquo;, or an artist name
              </p>
            </>
          )}
        </div>
      )}

      {/* Results grid */}
      {tracks.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="group relative flex gap-3 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md"
            >
              {/* Artwork / play button */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {track.artworkUrl ? (
                  <img
                    src={track.artworkUrl}
                    alt={track.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music2 className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
                {track.previewUrl && (
                  <button
                    onClick={() => togglePlay(track)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 rounded-lg"
                  >
                    {playingId === track.id ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white" />
                    )}
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-tight">{track.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(track.durationSeconds)}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${LICENSE_COLORS[track.license]}`}
                  >
                    {track.source}
                  </span>
                  {track.externalUrl && (
                    <a
                      href={track.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-muted-foreground hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Playing indicator */}
              {playingId === track.id && (
                <div className="absolute right-2 top-2 flex gap-[2px] items-end h-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-violet-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s`, height: `${[8, 12, 6][i]}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags row */}
      {tracks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Array.from(new Set(tracks.flatMap((t) => t.tags).filter(Boolean)))
            .slice(0, 20)
            .map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground hover:border-violet-400 hover:text-violet-600 transition-colors"
              >
                {tag}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
