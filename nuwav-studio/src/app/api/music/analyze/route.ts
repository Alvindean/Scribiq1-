import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/ai/claude";
import { checkUserRateLimit } from "@/lib/ratelimit/upstash";

export interface AudioFeatures {
  tempo: number | null;       // BPM
  key: string | null;         // e.g. "C Major"
  energy: number | null;      // 0–1
  danceability: number | null; // 0–1
  valence: number | null;     // 0–1 (sadness → happiness)
  loudness: number | null;    // dB
}

export interface SongAnalysis {
  track: {
    title: string;
    artist: string;
    album: string | null;
    genre: string | null;
    releaseYear: string | null;
    artworkUrl: string | null;
    previewUrl: string | null;
    durationSeconds: number | null;
  };
  audioFeatures: AudioFeatures;
  aiAnalysis: {
    structure: string;       // verse/chorus/bridge breakdown
    mood: string;            // emotional description
    energy: string;          // energy level description
    suggestedTone: string;   // how to match course tone to this song
    teachingInsights: string; // how this song structure informs lesson pacing
  };
  sources: string[];
}

// ── Spotify client credentials token (cached in module scope) ─────────────
let _spotifyToken: { token: string; expiresAt: number } | null = null;

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (_spotifyToken && Date.now() < _spotifyToken.expiresAt) {
    return _spotifyToken.token;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;

  const data = await res.json() as { access_token: string; expires_in: number };
  _spotifyToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return _spotifyToken.token;
}

// ── Spotify search + audio features ──────────────────────────────────────────
async function getSpotifyFeatures(
  song: string,
  artist: string
): Promise<{ spotifyTrackId?: string; features?: AudioFeatures } | null> {
  const token = await getSpotifyToken();
  if (!token) return null;

  const q = artist ? `track:${song} artist:${artist}` : song;
  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!searchRes.ok) return null;

  const searchData = await searchRes.json() as {
    tracks: { items: Array<{ id: string }> };
  };
  const trackId = searchData.tracks?.items?.[0]?.id;
  if (!trackId) return null;

  const featRes = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!featRes.ok) return { spotifyTrackId: trackId };

  const feat = await featRes.json() as {
    tempo: number;
    key: number;
    mode: number;
    energy: number;
    danceability: number;
    valence: number;
    loudness: number;
  };

  const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const keyName = feat.key >= 0
    ? `${KEYS[feat.key]} ${feat.mode === 1 ? "Major" : "Minor"}`
    : null;

  return {
    spotifyTrackId: trackId,
    features: {
      tempo: Math.round(feat.tempo),
      key: keyName,
      energy: Math.round(feat.energy * 100) / 100,
      danceability: Math.round(feat.danceability * 100) / 100,
      valence: Math.round(feat.valence * 100) / 100,
      loudness: Math.round(feat.loudness * 10) / 10,
    },
  };
}

// ── iTunes lookup ─────────────────────────────────────────────────────────────
async function lookupItunes(song: string, artist: string) {
  const q = artist ? `${song} ${artist}` : song;
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", q);
  url.searchParams.set("media", "music");
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json() as {
    results: Array<{
      trackName: string;
      artistName: string;
      collectionName?: string;
      primaryGenreName?: string;
      releaseDate?: string;
      artworkUrl100?: string;
      previewUrl?: string;
      trackTimeMillis?: number;
    }>;
  };

  const t = data.results?.[0];
  if (!t) return null;

  return {
    title: t.trackName,
    artist: t.artistName,
    album: t.collectionName ?? null,
    genre: t.primaryGenreName ?? null,
    releaseYear: t.releaseDate ? t.releaseDate.slice(0, 4) : null,
    artworkUrl: t.artworkUrl100?.replace("100x100", "600x600") ?? null,
    previewUrl: t.previewUrl ?? null,
    durationSeconds: t.trackTimeMillis ? Math.round(t.trackTimeMillis / 1000) : null,
  };
}

// ── AI structure analysis ─────────────────────────────────────────────────────
async function generateAiAnalysis(
  song: string,
  artist: string,
  genre: string | null,
  features: AudioFeatures
): Promise<SongAnalysis["aiAnalysis"]> {
  const featuresText = [
    features.tempo ? `BPM: ${features.tempo}` : null,
    features.key ? `Key: ${features.key}` : null,
    features.energy !== null ? `Energy: ${(features.energy * 100).toFixed(0)}%` : null,
    features.danceability !== null ? `Danceability: ${(features.danceability * 100).toFixed(0)}%` : null,
    features.valence !== null ? `Valence (happiness): ${(features.valence * 100).toFixed(0)}%` : null,
  ].filter(Boolean).join(", ");

  // Genre-specific structural hints so the AI returns accurate section names
  const GENRE_STRUCTURE_HINTS: Record<string, string> = {
    "hip-hop": "Use [Verse] (16 bars), [Hook], [Outro] — not [Chorus]. Count bars if possible.",
    rap: "Use [Verse] (16 bars), [Hook], [Outro] — not [Chorus]. Count bars if possible.",
    blues: "Use 12-bar AAB verse structure. Label sections [Verse 1], [Verse 2], etc.",
    jazz: "Use AABA 32-bar form: [Head], [Verse A], [Bridge (B)], [Verse A], [Outro].",
    edm: "Include [Build-Up], [Drop], and [Breakdown] sections alongside [Verse] and [Outro].",
    electronic: "Include [Build-Up], [Drop], and [Breakdown] sections alongside [Verse] and [Outro].",
    dance: "Include [Build-Up], [Drop], and [Breakdown] sections alongside [Verse] and [Outro].",
    gospel: "Include [Vamp] or call-and-response section before [Outro].",
    "r&b": "Include [Pre-Chorus] and [Vamp/Outro] after the final chorus.",
    soul: "Include [Pre-Chorus] and [Vamp/Outro] after the final chorus.",
    pop: "Include [Pre-Chorus] between each [Verse] and [Chorus].",
    rock: "Include a [Guitar Solo] (instrumental) section between second chorus and bridge.",
    country: "Story-driven: label sections as [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Outro].",
    folk: "Narrative arc: typically 3–5 [Verse] sections with [Chorus] between each.",
    reggae: "One-drop feel: [Verse], [Chorus], [Bridge], [Outro] — note rhythmic offbeat emphasis.",
  };

  const genreKey = genre?.toLowerCase() ?? "";
  const structureHint = Object.entries(GENRE_STRUCTURE_HINTS).find(([k]) =>
    genreKey.includes(k)
  )?.[1] ?? "";

  const prompt = `You are a music and education expert. Analyze the song "${song}" by ${artist}${genre ? ` (genre: ${genre})` : ""}.
${featuresText ? `Audio data: ${featuresText}` : ""}
${structureHint ? `Genre structure guide: ${structureHint}` : ""}

Respond ONLY with a JSON object — no markdown, no explanation:
{
  "structure": "<concise breakdown using correct genre section names, e.g. Intro (0:00–0:15) → Verse 1 (0:15–0:45) → Chorus (0:45–1:15) → ...>",
  "mood": "<2–3 sentence emotional and atmospheric description of the song>",
  "energy": "<1–2 sentence description of the song's energy level and intensity arc>",
  "suggestedTone": "<1–2 sentences on how a course creator could match this song's tone in their teaching style>",
  "teachingInsights": "<2–3 sentences on how the song's structure (build-up, hooks, resolution) maps to good lesson pacing>"
}`;

  const raw = await generateText({ prompt, maxTokens: 800, temperature: 0.5 });
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    return JSON.parse(cleaned) as SongAnalysis["aiAnalysis"];
  } catch {
    return {
      structure: "Could not determine structure automatically.",
      mood: raw.slice(0, 200),
      energy: "",
      suggestedTone: "",
      teachingInsights: "",
    };
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkUserRateLimit(session.user.id, "music-analyze", 20, 3600);
  if (!rl.success) {
    return Response.json(
      { error: "Rate limit exceeded. Try again shortly." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  }

  let song: string;
  let artist: string;
  try {
    const body = await request.json() as { song: string; artist?: string };
    song = body.song?.trim();
    artist = body.artist?.trim() ?? "";
    if (!song || song.length < 1) throw new Error("Song name is required");
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Run iTunes lookup and Spotify lookup in parallel
  const [itunesTrack, spotifyData] = await Promise.allSettled([
    lookupItunes(song, artist),
    getSpotifyFeatures(song, artist),
  ]);

  const track = itunesTrack.status === "fulfilled" ? itunesTrack.value : null;
  const spotify = spotifyData.status === "fulfilled" ? spotifyData.value : null;

  const audioFeatures: AudioFeatures = spotify?.features ?? {
    tempo: null,
    key: null,
    energy: null,
    danceability: null,
    valence: null,
    loudness: null,
  };

  const resolvedSong = track?.title ?? song;
  const resolvedArtist = track?.artist ?? artist;

  const aiAnalysis = await generateAiAnalysis(
    resolvedSong,
    resolvedArtist,
    track?.genre ?? null,
    audioFeatures
  );

  const sources: string[] = ["iTunes"];
  if (spotify) sources.push("Spotify");
  sources.push("AI Analysis (Claude)");

  const result: SongAnalysis = {
    track: track ?? {
      title: song,
      artist: artist || "Unknown Artist",
      album: null,
      genre: null,
      releaseYear: null,
      artworkUrl: null,
      previewUrl: null,
      durationSeconds: null,
    },
    audioFeatures,
    aiAnalysis,
    sources,
  };

  return Response.json(result);
}
