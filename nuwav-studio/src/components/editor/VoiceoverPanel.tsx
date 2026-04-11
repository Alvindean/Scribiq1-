"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Loader2, AlertCircle, CheckCircle, RefreshCw, Info } from "lucide-react";

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

interface VoiceoverPanelProps {
  lessonId: string;
  initialVoiceoverUrl: string | null;
  /** Called with the new URL after a successful generation so the parent can persist it. */
  onVoiceoverGenerated?: (voiceoverUrl: string) => void;
}

export function VoiceoverPanel({
  lessonId,
  initialVoiceoverUrl,
  onVoiceoverGenerated,
}: VoiceoverPanelProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [voicesError, setVoicesError] = useState<string | null>(null);

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(
    initialVoiceoverUrl
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync if parent passes a new initialVoiceoverUrl (e.g. lesson switch)
  useEffect(() => {
    setVoiceoverUrl(initialVoiceoverUrl);
    setGenerateError(null);
    setGenerateSuccess(false);
  }, [initialVoiceoverUrl, lessonId]);

  // Fetch available voices on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchVoices() {
      setVoicesLoading(true);
      setVoicesError(null);
      try {
        const res = await fetch("/api/voiceover/voices");
        const data = (await res.json()) as { voices?: Voice[]; error?: string };
        if (!res.ok) throw new Error(data.error ?? `Failed to load voices (${res.status})`);
        if (!cancelled) {
          const list = data.voices ?? [];
          setVoices(list);
          if (list.length > 0) {
            setSelectedVoiceId(list[0].voice_id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setVoicesError(err instanceof Error ? err.message : "Could not load voices");
        }
      } finally {
        if (!cancelled) setVoicesLoading(false);
      }
    }
    void fetchVoices();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGenerate = async () => {
    if (!selectedVoiceId) return;
    setIsGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(false);

    try {
      const res = await fetch("/api/voiceover/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, voiceId: selectedVoiceId }),
      });
      const data = (await res.json()) as {
        lessonId?: string;
        voiceoverUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.voiceoverUrl) {
        throw new Error(data.error ?? `Generation failed (${res.status})`);
      }
      // Reset audio element so the new src loads cleanly
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
      }
      setVoiceoverUrl(data.voiceoverUrl);
      setGenerateSuccess(true);
      onVoiceoverGenerated?.(data.voiceoverUrl);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate voiceover");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedVoice = voices.find((v) => v.voice_id === selectedVoiceId);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Voice selector ── */}
      <section className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Voice
        </p>

        {voicesLoading ? (
          <div className="flex items-center gap-2 text-xs text-zinc-500 py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            Loading voices…
          </div>
        ) : voicesError ? (
          <div className="flex items-start gap-2 rounded-md border border-red-900/60 bg-red-950/30 px-3 py-2 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
            <span>{voicesError}</span>
          </div>
        ) : voices.length === 0 ? (
          <p className="text-xs text-zinc-600 py-2">No voices available.</p>
        ) : (
          <Select
            value={selectedVoiceId}
            onValueChange={setSelectedVoiceId}
            disabled={isGenerating}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 text-xs h-9 focus:ring-violet-500">
              <SelectValue placeholder="Select a voice…" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
              {voices.map((voice) => (
                <SelectItem
                  key={voice.voice_id}
                  value={voice.voice_id}
                  className="text-xs focus:bg-zinc-800 focus:text-zinc-100"
                >
                  <span className="flex items-center gap-2">
                    <span>{voice.name}</span>
                    <span className="rounded-full bg-zinc-700 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 uppercase tracking-wide">
                      {voice.category}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Category badge for selected voice shown below the select */}
        {selectedVoice && !voicesLoading && (
          <p className="text-[10px] text-zinc-600">
            Category:{" "}
            <span className="text-zinc-400 capitalize">{selectedVoice.category}</span>
          </p>
        )}
      </section>

      {/* ── Generate button ── */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || voicesLoading || voices.length === 0 || !selectedVoiceId}
        className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white min-h-[44px] disabled:opacity-60"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating…
          </>
        ) : voiceoverUrl ? (
          <>
            <RefreshCw className="w-4 h-4" />
            Regenerate Voiceover
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Generate Voiceover
          </>
        )}
      </Button>

      {/* ── Status messages ── */}
      {generateSuccess && !generateError && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-900/60 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          Voiceover ready!
        </div>
      )}

      {generateError && (
        <div className="flex items-start gap-2 rounded-md border border-red-900/60 bg-red-950/30 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>{generateError}</span>
        </div>
      )}

      {/* ── Audio player ── */}
      {voiceoverUrl ? (
        <section className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Preview
          </p>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-3">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
              ref={audioRef}
              key={voiceoverUrl}
              src={voiceoverUrl}
              controls
              className="w-full h-8 accent-violet-500"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </section>
      ) : (
        !generateError && (
          <p className="text-xs text-zinc-600 text-center py-2">
            No voiceover generated yet.
          </p>
        )
      )}

      {/* ── Cost warning ── */}
      <div className="flex items-start gap-2 rounded-md border border-zinc-700/50 bg-zinc-800/40 px-3 py-2 text-[10px] text-zinc-500">
        <Info className="w-3 h-3 shrink-0 mt-px text-zinc-600" />
        <span>Uses ~1 ElevenLabs credit per generation</span>
      </div>
    </div>
  );
}
