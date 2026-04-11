import { Suspense } from "react";
import Link from "next/link";
import { MusicSearch } from "@/components/music/MusicSearch";
import { SongAnalyzer } from "@/components/music/SongAnalyzer";
import { ImageSearch } from "@/components/music/ImageSearch";
import { LyricEditor } from "@/components/music/LyricEditor";
import { InfoBanner } from "@/components/music/InfoBanner";

type Tab = "library" | "analyzer" | "images" | "lyrics";

export default async function MusicPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: Tab =
    tab === "analyzer" ? "analyzer"
    : tab === "images" ? "images"
    : tab === "lyrics" ? "lyrics"
    : "library";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Media Assets</h1>
        <p className="text-muted-foreground mt-1">
          Find background tracks, analyze song structure, or search royalty-free images for your courses and VSLs.
        </p>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto pb-1 -mb-1">
        <div className="flex gap-1 rounded-lg border bg-muted/40 p-1 w-max min-w-full sm:w-fit sm:min-w-0">
          <Link
            href="/music?tab=library"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "library"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Music Library
          </Link>
          <Link
            href="/music?tab=analyzer"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "analyzer"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Song Analyzer
          </Link>
          <Link
            href="/music?tab=images"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "images"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Visual Assets
          </Link>
          <Link
            href="/music?tab=lyrics"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "lyrics"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Lyric Editor
          </Link>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "library" ? (
        <div className="space-y-4">
          <InfoBanner storageKey="libraryInfoOpen">
            <p className="font-medium">Search across multiple sources simultaneously</p>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li><strong>iTunes</strong> — 30-second previews from Apple&apos;s full catalog (no API key needed)</li>
              <li><strong>Pixabay</strong> — Royalty-free tracks (add <code className="bg-muted px-1 rounded">PIXABAY_API_KEY</code> to env)</li>
              <li><strong>Freesound</strong> — Creative Commons audio (add <code className="bg-muted px-1 rounded">FREESOUND_API_KEY</code> to env)</li>
            </ul>
          </InfoBanner>
          <Suspense fallback={null}>
            <MusicSearch />
          </Suspense>
        </div>
      ) : activeTab === "analyzer" ? (
        <div className="space-y-4">
          <InfoBanner storageKey="analyzerInfoOpen">
            <p className="font-medium">Multi-source song intelligence</p>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li><strong>iTunes</strong> — Track metadata, artwork, 30-second preview (always available)</li>
              <li><strong>Spotify</strong> — BPM, musical key, energy, danceability, valence (add <code className="bg-muted px-1 rounded">SPOTIFY_CLIENT_ID</code> + <code className="bg-muted px-1 rounded">SPOTIFY_CLIENT_SECRET</code> to env)</li>
              <li><strong>Claude AI</strong> — Song structure breakdown, mood analysis, course creation insights (always available)</li>
            </ul>
          </InfoBanner>
          <Suspense fallback={null}>
            <SongAnalyzer />
          </Suspense>
        </div>
      ) : activeTab === "images" ? (
        <div className="space-y-4">
          <InfoBanner storageKey="imagesInfoOpen">
            <p className="font-medium">Royalty-free images for slides, thumbnails, and backgrounds</p>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li><strong>Pixabay</strong> — Photos, illustrations, and vectors (add <code className="bg-muted px-1 rounded">PIXABAY_API_KEY</code> to env)</li>
              <li>All Pixabay content is free for commercial use — no attribution required</li>
            </ul>
          </InfoBanner>
          <Suspense fallback={null}>
            <ImageSearch />
          </Suspense>
        </div>
      ) : (
        <div className="space-y-4">
          <InfoBanner storageKey="lyricsInfoOpen">
            <p className="font-medium">Write and edit your song lyrics</p>
            <p className="text-xs">Use section markers like <code className="bg-muted px-1 rounded">[Verse 1]</code>, <code className="bg-muted px-1 rounded">[Chorus]</code>, or <code className="bg-muted px-1 rounded">[Bridge]</code> to organize your lyrics. Copy to clipboard when ready.</p>
          </InfoBanner>
          <Suspense fallback={null}>
            <LyricEditor />
          </Suspense>
        </div>
      )}
    </div>
  );
}
