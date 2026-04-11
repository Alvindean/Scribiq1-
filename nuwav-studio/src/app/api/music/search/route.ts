import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  previewUrl: string | null;
  artworkUrl: string | null;
  genre: string | null;
  tags: string[];
  source: "itunes" | "pixabay" | "freesound";
  license: "preview" | "royalty-free" | "cc";
  externalUrl: string | null;
}

// ── iTunes Search (no API key, 30-second previews, massive catalog) ──────────
async function searchItunes(q: string, limit: number): Promise<MusicTrack[]> {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", q);
  url.searchParams.set("media", "music");
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", String(Math.min(limit, 50)));
  url.searchParams.set("explicit", "No");

  const res = await fetch(url.toString(), {
    headers: { "Accept": "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];

  const data = await res.json() as {
    results: Array<{
      trackId: number;
      trackName: string;
      artistName: string;
      trackTimeMillis?: number;
      previewUrl?: string;
      artworkUrl100?: string;
      primaryGenreName?: string;
      trackViewUrl?: string;
    }>;
  };

  return (data.results ?? []).map((t) => ({
    id: `itunes-${t.trackId}`,
    title: t.trackName,
    artist: t.artistName,
    durationSeconds: t.trackTimeMillis ? Math.round(t.trackTimeMillis / 1000) : 0,
    previewUrl: t.previewUrl ?? null,
    artworkUrl: t.artworkUrl100?.replace("100x100", "300x300") ?? null,
    genre: t.primaryGenreName ?? null,
    tags: t.primaryGenreName ? [t.primaryGenreName] : [],
    source: "itunes" as const,
    license: "preview" as const,
    externalUrl: t.trackViewUrl ?? null,
  }));
}

// ── Pixabay Music (requires PIXABAY_API_KEY, royalty-free) ──────────────────
async function searchPixabay(q: string, limit: number): Promise<MusicTrack[]> {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];

  const url = new URL("https://pixabay.com/api/videos/music/");
  url.searchParams.set("key", key);
  url.searchParams.set("q", q);
  url.searchParams.set("per_page", String(Math.min(limit, 50)));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const data = await res.json() as {
    hits: Array<{
      id: number;
      title: string;
      user: string;
      duration: number;
      audio: { preview: string; full: string };
      tags: string;
    }>;
  };

  return (data.hits ?? []).map((t) => ({
    id: `pixabay-${t.id}`,
    title: t.title,
    artist: t.user,
    durationSeconds: t.duration,
    previewUrl: t.audio?.preview ?? t.audio?.full ?? null,
    artworkUrl: null,
    genre: null,
    tags: t.tags ? t.tags.split(",").map((s) => s.trim()) : [],
    source: "pixabay" as const,
    license: "royalty-free" as const,
    externalUrl: `https://pixabay.com/music/id-${t.id}/`,
  }));
}

// ── Freesound (requires FREESOUND_API_KEY, CC-licensed) ─────────────────────
async function searchFreesound(q: string, limit: number): Promise<MusicTrack[]> {
  const key = process.env.FREESOUND_API_KEY;
  if (!key) return [];

  const url = new URL("https://freesound.org/apiv2/search/text/");
  url.searchParams.set("query", q);
  url.searchParams.set("token", key);
  url.searchParams.set("fields", "id,name,username,duration,previews,tags,url,license");
  url.searchParams.set("filter", "type:mp3");
  url.searchParams.set("page_size", String(Math.min(limit, 50)));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const data = await res.json() as {
    results: Array<{
      id: number;
      name: string;
      username: string;
      duration: number;
      previews: { "preview-hq-mp3"?: string };
      tags: string[];
      url: string;
    }>;
  };

  return (data.results ?? []).map((t) => ({
    id: `freesound-${t.id}`,
    title: t.name,
    artist: t.username,
    durationSeconds: Math.round(t.duration),
    previewUrl: t.previews?.["preview-hq-mp3"] ?? null,
    artworkUrl: null,
    genre: null,
    tags: t.tags ?? [],
    source: "freesound" as const,
    license: "cc" as const,
    externalUrl: t.url ?? null,
  }));
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim();
  const source = searchParams.get("source") ?? "all"; // all | itunes | pixabay | freesound
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  if (!q || q.length < 2) {
    return Response.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  try {
    const perSource = source === "all" ? Math.ceil(limit / 3) : limit;

    const [itunesResults, pixabayResults, freesoundResults] = await Promise.allSettled([
      source === "all" || source === "itunes" ? searchItunes(q, perSource) : Promise.resolve([]),
      source === "all" || source === "pixabay" ? searchPixabay(q, perSource) : Promise.resolve([]),
      source === "all" || source === "freesound" ? searchFreesound(q, perSource) : Promise.resolve([]),
    ]);

    // Interleave results so no single source dominates the list
    const itunes = itunesResults.status === "fulfilled" ? itunesResults.value : [];
    const pixabay = pixabayResults.status === "fulfilled" ? pixabayResults.value : [];
    const freesound = freesoundResults.status === "fulfilled" ? freesoundResults.value : [];

    const interleaved: MusicTrack[] = [];
    const maxLen = Math.max(itunes.length, pixabay.length, freesound.length);
    for (let i = 0; i < maxLen && interleaved.length < limit; i++) {
      if (i < itunes.length) interleaved.push(itunes[i]);
      if (i < pixabay.length) interleaved.push(pixabay[i]);
      if (i < freesound.length) interleaved.push(freesound[i]);
    }

    return Response.json({
      tracks: interleaved.slice(0, limit),
      sources: {
        itunes: itunes.length,
        pixabay: pixabay.length,
        freesound: freesound.length,
      },
    });
  } catch (err) {
    console.error("[GET /api/music/search]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
