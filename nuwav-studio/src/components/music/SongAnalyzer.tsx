"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Music2, Play, Pause, Zap, Heart, Activity, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SongAnalysis } from "@/app/api/music/analyze/route";

function FeatureBar({
  label,
  value,
  color = "bg-violet-500",
}: {
  label: string;
  value: number | null;
  color?: string;
}) {
  if (value === null) return null;
  const pct = Math.round(value * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SongAnalyzer() {
  const router = useRouter();
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SongAnalysis | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function getGenreScaffoldSections(genre: string | null): string[] {
    const g = (genre ?? "").toLowerCase();
    if (g.includes("hip") || g.includes("rap") || g.includes("trap")) {
      return [
        "[Verse 1]", "", "[Hook]", "",
        "[Verse 2]", "", "[Hook]", "",
        "[Verse 3]", "", "[Hook]", "", "[Outro]",
      ];
    }
    if (g.includes("blues")) {
      return ["[Verse 1]", "", "[Verse 2]", "", "[Verse 3]"];
    }
    if (
      g.includes("edm") || g.includes("electronic") ||
      g.includes("house") || g.includes("techno") || g.includes("dance")
    ) {
      return [
        "[Verse 1]", "", "[Build-Up]", "", "[Drop]", "",
        "[Verse 2]", "", "[Build-Up]", "", "[Drop]", "",
        "[Breakdown]", "", "[Build-Up]", "", "[Drop]", "", "[Outro]",
      ];
    }
    if (g.includes("jazz")) {
      return [
        "[Intro]", "",
        "[Head]", "", "[Verse A]", "", "[Verse A]", "",
        "[Bridge]", "", "[Verse A]", "", "[Outro]",
      ];
    }
    if (g.includes("r&b") || g.includes("rnb") || g.includes("soul")) {
      return [
        "[Verse 1]", "", "[Pre-Chorus]", "", "[Chorus]", "",
        "[Verse 2]", "", "[Pre-Chorus]", "", "[Chorus]", "",
        "[Bridge]", "", "[Chorus]", "", "[Vamp/Outro]",
      ];
    }
    if (g.includes("gospel")) {
      return [
        "[Verse 1]", "", "[Chorus]", "",
        "[Verse 2]", "", "[Chorus]", "",
        "[Bridge]", "", "[Vamp]", "", "[Outro]",
      ];
    }
    if (g.includes("folk") || g.includes("acoustic") || g.includes("country")) {
      return [
        "[Verse 1]", "", "[Chorus]", "",
        "[Verse 2]", "", "[Chorus]", "",
        "[Verse 3]", "", "[Chorus]", "", "[Outro]",
      ];
    }
    // Default: Pop / Rock
    return [
      "[Verse 1]", "", "[Pre-Chorus]", "", "[Chorus]", "",
      "[Verse 2]", "", "[Pre-Chorus]", "", "[Chorus]", "",
      "[Bridge]", "", "[Chorus]", "", "[Outro]",
    ];
  }

  function handleStartLyrics() {
    if (!result) return;
    const sections = getGenreScaffoldSections(result.track.genre);
    const scaffold = [
      result.aiAnalysis.structure ? `# Structure: ${result.aiAnalysis.structure}` : "",
      result.aiAnalysis.mood ? `# Mood: ${result.aiAnalysis.mood}` : "",
      result.track.genre ? `# Genre: ${result.track.genre}` : "",
      "",
      ...sections,
    ].filter(Boolean).join("\n");
    localStorage.setItem("soniq:lyric-editor-draft", scaffold);
    // Pre-select the genre in the lyric editor AI panel
    if (result.track.genre) {
      localStorage.setItem("soniq:lyric-editor-genre", result.track.genre);
    } else {
      localStorage.removeItem("soniq:lyric-editor-genre");
    }
    router.push("/music?tab=lyrics");
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!song.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/music/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song: song.trim(), artist: artist.trim() }),
        signal: controller.signal,
      });
      const data = await res.json() as SongAnalysis & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function togglePreview() {
    if (!result?.track.previewUrl) return;
    if (playing && audio) {
      audio.pause();
      setPlaying(false);
      return;
    }
    const a = new Audio(result.track.previewUrl);
    a.onended = () => setPlaying(false);
    a.play().catch(() => setPlaying(false));
    setAudio(a);
    setPlaying(true);
  }

  const feat = result?.audioFeatures;

  return (
    <div className="space-y-8">
      {/* Input form */}
      <form onSubmit={handleAnalyze} className="rounded-xl border bg-card p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="song-title">Song Title *</Label>
            <div className="relative">
              <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="song-title"
                placeholder="e.g. Blinding Lights"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist-name">Artist (optional)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="artist-name"
                placeholder="e.g. The Weeknd"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading || !song.trim()}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {loading ? "Analyzing…" : "Analyze Song Structure"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Uses iTunes, Spotify audio features (if configured), and AI to break down the song.
        </p>
      </form>

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <div className="flex gap-1 items-end h-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1.5 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s`, height: `${[12, 20, 16, 24, 14][i]}px` }}
              />
            ))}
          </div>
          <p className="text-sm">Pulling data from iTunes, Spotify, and AI…</p>
          <button onClick={handleCancel} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">Cancel</button>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Track card */}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:gap-4">
            {result.track.artworkUrl ? (
              <img
                src={result.track.artworkUrl}
                alt={result.track.title}
                className="h-20 w-20 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Music2 className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
            <div className="flex flex-col justify-between min-w-0">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{result.track.title}</h3>
                <p className="text-muted-foreground text-sm">{result.track.artist}</p>
                {result.track.album && (
                  <p className="text-xs text-muted-foreground/70">{result.track.album}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {result.track.genre && (
                  <span className="rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-xs font-medium">
                    {result.track.genre}
                  </span>
                )}
                {result.track.releaseYear && (
                  <span className="text-xs text-muted-foreground">{result.track.releaseYear}</span>
                )}
                {result.track.previewUrl && (
                  <button
                    onClick={togglePreview}
                    className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/80 transition-colors"
                  >
                    {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    {playing ? "Pause preview" : "Play preview"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Audio features */}
            {(feat?.tempo || feat?.energy !== null || feat?.danceability !== null || feat?.valence !== null) && (
              <div className="rounded-xl border bg-card p-5 space-y-5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-violet-600" />
                  <h4 className="font-semibold text-sm">Audio Features</h4>
                  <span className="text-xs text-muted-foreground ml-auto">via Spotify</span>
                </div>

                {feat?.tempo && (
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-2xl font-bold leading-none">{feat.tempo}</p>
                      <p className="text-xs text-muted-foreground">BPM{feat.key ? ` · ${feat.key}` : ""}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <FeatureBar label="Energy" value={feat?.energy ?? null} color="bg-rose-500" />
                  <FeatureBar label="Danceability" value={feat?.danceability ?? null} color="bg-violet-500" />
                  <FeatureBar
                    label="Mood (Valence)"
                    value={feat?.valence ?? null}
                    color="bg-emerald-500"
                  />
                </div>

                {feat?.loudness !== null && feat?.loudness !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Loudness: {feat.loudness} dB
                  </p>
                )}
              </div>
            )}

            {/* AI Analysis */}
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-violet-600" />
                <h4 className="font-semibold text-sm">AI Analysis</h4>
                <span className="text-xs text-muted-foreground ml-auto">via Claude</span>
              </div>

              {result.aiAnalysis.structure && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Song Structure</p>
                  <p className="text-sm font-mono bg-muted rounded-md px-3 py-2 leading-relaxed">
                    {result.aiAnalysis.structure}
                  </p>
                </div>
              )}

              {result.aiAnalysis.mood && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mood & Atmosphere</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.aiAnalysis.mood}</p>
                </div>
              )}
            </div>
          </div>

          {/* Start Lyrics button */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleStartLyrics}
              className="gap-2 w-full sm:w-auto"
            >
              <PenLine className="h-4 w-4" />
              Start Lyrics from This Song
            </Button>
          </div>

          {/* Teaching insights */}
          {(result.aiAnalysis.suggestedTone || result.aiAnalysis.teachingInsights) && (
            <div className="rounded-xl border bg-violet-50/50 p-5 space-y-4">
              <h4 className="font-semibold text-sm text-violet-800">Course Creation Insights</h4>
              {result.aiAnalysis.suggestedTone && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-violet-600 uppercase tracking-wide">Suggested Tone</p>
                  <p className="text-sm text-muted-foreground">{result.aiAnalysis.suggestedTone}</p>
                </div>
              )}
              {result.aiAnalysis.teachingInsights && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-violet-600 uppercase tracking-wide">Lesson Pacing Parallels</p>
                  <p className="text-sm text-muted-foreground">{result.aiAnalysis.teachingInsights}</p>
                </div>
              )}
            </div>
          )}

          {/* Sources */}
          <p className="text-xs text-muted-foreground">
            Data sources: {result.sources.join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
