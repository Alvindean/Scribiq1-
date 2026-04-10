import { Suspense } from "react";
import Link from "next/link";
import { MusicSearch } from "@/components/music/MusicSearch";
import { SongAnalyzer } from "@/components/music/SongAnalyzer";

type Tab = "library" | "analyzer";

export default async function MusicPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: Tab = tab === "analyzer" ? "analyzer" : "library";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Music</h1>
        <p className="text-muted-foreground mt-1">
          Find background tracks or analyze any song&apos;s structure to inform your course tone and pacing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/40 p-1 w-fit">
        <Link
          href="/music?tab=library"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "library"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Music Library
        </Link>
        <Link
          href="/music?tab=analyzer"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "analyzer"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Song Analyzer
        </Link>
      </div>

      {/* Tab content */}
      {activeTab === "library" ? (
        <div className="space-y-4">
          <div className="rounded-lg border bg-amber-50/60 px-4 py-3 text-sm text-amber-800 space-y-1">
            <p className="font-medium">Search across multiple sources simultaneously</p>
            <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
              <li><strong>iTunes</strong> — 30-second previews from Apple&apos;s full catalog (no API key needed)</li>
              <li><strong>Pixabay</strong> — Royalty-free tracks (add <code className="bg-amber-100 px-1 rounded">PIXABAY_API_KEY</code> to env)</li>
              <li><strong>Freesound</strong> — Creative Commons audio (add <code className="bg-amber-100 px-1 rounded">FREESOUND_API_KEY</code> to env)</li>
            </ul>
          </div>
          <Suspense fallback={null}>
            <MusicSearch />
          </Suspense>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border bg-violet-50/60 px-4 py-3 text-sm text-violet-800 space-y-1">
            <p className="font-medium">Multi-source song intelligence</p>
            <ul className="text-xs text-violet-700 space-y-0.5 list-disc list-inside">
              <li><strong>iTunes</strong> — Track metadata, artwork, 30-second preview (always available)</li>
              <li><strong>Spotify</strong> — BPM, musical key, energy, danceability, valence (add <code className="bg-violet-100 px-1 rounded">SPOTIFY_CLIENT_ID</code> + <code className="bg-violet-100 px-1 rounded">SPOTIFY_CLIENT_SECRET</code> to env)</li>
              <li><strong>Claude AI</strong> — Song structure breakdown, mood analysis, course creation insights (always available)</li>
            </ul>
          </div>
          <Suspense fallback={null}>
            <SongAnalyzer />
          </Suspense>
        </div>
      )}
    </div>
  );
}
