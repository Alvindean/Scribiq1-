// api/analyze-url.js
// Fetches transcript/lyrics/metadata from YouTube, Suno, SoundCloud, or any URL
// Called by the frontend before running buildAnalyzePrompt so the AI has real content

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body || {};
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url required' });

  try {
    const result = await fetchURLContent(url.trim());
    return res.status(200).json(result);
  } catch (err) {
    // Always return a usable object even on failure so the AI can still try
    return res.status(200).json({
      error: err.message || 'Could not fetch URL content',
      platform: detectPlatform(url),
      title: '',
      author: '',
      transcript: '',
      thumbnail: ''
    });
  }
}

function detectPlatform(url) {
  try {
    const h = new URL(url).hostname.replace(/^www\./, '');
    if (h === 'youtube.com' || h === 'youtu.be' || h === 'm.youtube.com') return 'YouTube';
    if (h === 'suno.com' || h === 'app.suno.ai') return 'Suno';
    if (h === 'soundcloud.com') return 'SoundCloud';
    if (h === 'spotify.com' || h === 'open.spotify.com') return 'Spotify';
    if (h === 'tiktok.com' || h.endsWith('.tiktok.com')) return 'TikTok';
    if (h === 'instagram.com') return 'Instagram';
    if (h === 'twitter.com' || h === 'x.com') return 'X / Twitter';
    return h;
  } catch { return 'Unknown'; }
}

async function fetchURLContent(url) {
  const platform = detectPlatform(url);
  switch (platform) {
    case 'YouTube':    return fetchYouTube(url);
    case 'Suno':       return fetchSuno(url);
    case 'SoundCloud': return fetchSoundCloud(url);
    case 'Spotify':    return fetchSpotify(url);
    default:           return fetchGeneric(url, platform);
  }
}

// ── YOUTUBE ──────────────────────────────────────────────────────────────────

function extractYouTubeId(url) {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
    /shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function fetchYouTube(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error('Could not extract YouTube video ID from URL');

  // Fetch video page
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  const html = await pageRes.text();

  // Extract title + author from meta tags
  const titleMatch = html.match(/<meta name="title" content="([^"]+)"/);
  const authorMatch = html.match(/"ownerChannelName":"([^"]+)"/);
  const title  = decodeEntities(titleMatch?.[1] || '');
  const author = decodeEntities(authorMatch?.[1] || '');

  // Find caption track URL from ytInitialData
  let transcript = '';
  const captionMatch = html.match(/"captionTracks":\[\{"baseUrl":"([^"]+)"/);
  if (captionMatch) {
    const captionBase = captionMatch[1].replace(/\\u0026/g, '&');
    try {
      // Try JSON3 format first
      const capRes = await fetch(captionBase + '&lang=en&fmt=json3');
      if (capRes.ok) {
        const capData = await capRes.json();
        transcript = (capData.events || [])
          .filter(e => e.segs)
          .map(e => e.segs.map(s => (s.utf8 || '').replace(/\n/g, ' ')).join(''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    } catch {
      try {
        // Fallback: XML format
        const capRes = await fetch(captionBase);
        if (capRes.ok) {
          const xml = await capRes.text();
          transcript = xml
            .replace(/<[^>]+>/g, ' ')
            .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ').trim();
        }
      } catch { /* no captions */ }
    }
  }

  return {
    platform: 'YouTube',
    title,
    author,
    transcript,
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    videoId
  };
}

// ── SUNO ─────────────────────────────────────────────────────────────────────

async function fetchSuno(url) {
  const idMatch = url.match(/song\/([a-f0-9-]{36})/i);
  const songId = idMatch?.[1] || null;

  // Try Suno's unofficial API first
  if (songId) {
    try {
      const apiRes = await fetch(`https://studio-api.suno.ai/api/feed/?ids=${songId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        const song = Array.isArray(data) ? data[0] : data;
        if (song) {
          return {
            platform: 'Suno',
            title:     song.title || song.display_name || 'Suno Song',
            author:    song.handle || song.display_name || 'Suno Artist',
            transcript: song.lyric || song.metadata?.prompt || '',
            thumbnail: song.image_url || song.image_large_url || '',
            songId,
            tags:      song.metadata?.tags || ''
          };
        }
      }
    } catch { /* fall through */ }
  }

  // Fallback: scrape page for __NEXT_DATA__
  try {
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await pageRes.text();

    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
    if (nextDataMatch) {
      const nd = JSON.parse(nextDataMatch[1]);
      const song = nd?.props?.pageProps?.song || nd?.props?.pageProps?.clip;
      if (song) {
        return {
          platform: 'Suno',
          title:     song.title || 'Suno Song',
          author:    song.display_name || song.handle || 'Suno Artist',
          transcript: song.lyric || song.metadata?.prompt || '',
          thumbnail: song.image_url || '',
          songId
        };
      }
    }

    // Last resort: meta tags
    const titleM = html.match(/<meta property="og:title" content="([^"]+)"/);
    return {
      platform: 'Suno',
      title:  decodeEntities(titleM?.[1] || 'Suno Song').replace(' | Suno', '').trim(),
      author: 'Suno Artist',
      transcript: '',
      thumbnail: ''
    };
  } catch (err) {
    throw new Error('Could not fetch Suno song: ' + err.message);
  }
}

// ── SOUNDCLOUD ───────────────────────────────────────────────────────────────

async function fetchSoundCloud(url) {
  try {
    const oeRes = await fetch(
      `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!oeRes.ok) throw new Error('oEmbed failed');
    const d = await oeRes.json();
    return {
      platform: 'SoundCloud',
      title:     d.title || '',
      author:    d.author_name || '',
      transcript: '', // SoundCloud doesn't expose lyrics
      thumbnail: d.thumbnail_url || ''
    };
  } catch {
    return { platform: 'SoundCloud', title: '', author: '', transcript: '', thumbnail: '' };
  }
}

// ── SPOTIFY ──────────────────────────────────────────────────────────────────
// Spotify requires OAuth for lyrics — return metadata only via oEmbed

async function fetchSpotify(url) {
  try {
    const oeRes = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (!oeRes.ok) throw new Error();
    const d = await oeRes.json();
    return {
      platform: 'Spotify',
      title:     d.title || '',
      author:    d.artist_name || d.provider_name || '',
      transcript: '',
      thumbnail: d.thumbnail_url || '',
      note: 'Spotify does not expose lyrics publicly — paste lyrics manually in the text box for a full analysis.'
    };
  } catch {
    return {
      platform: 'Spotify',
      title: '', author: '', transcript: '', thumbnail: '',
      note: 'Could not fetch Spotify metadata. Paste lyrics manually.'
    };
  }
}

// ── GENERIC ──────────────────────────────────────────────────────────────────

async function fetchGeneric(url, platform) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000)
    });
    const html = await res.text();
    const titleM  = html.match(/<title>([^<]+)<\/title>/);
    const authorM = html.match(/<meta name="author" content="([^"]+)"/);
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ').trim().slice(0, 6000);
    return {
      platform: platform || new URL(url).hostname,
      title:  decodeEntities(titleM?.[1]?.trim() || ''),
      author: decodeEntities(authorM?.[1]?.trim() || ''),
      transcript: text,
      thumbnail: ''
    };
  } catch (err) {
    throw new Error('Could not fetch page: ' + err.message);
  }
}

// ── UTILS ────────────────────────────────────────────────────────────────────

function decodeEntities(str) {
  return (str || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
