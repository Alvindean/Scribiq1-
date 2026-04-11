"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Trash2, Copy, Check, ClipboardPaste, Wand2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function LyricEditor() {
  const [lyrics, setLyrics] = useState("");
  const [copied, setCopied] = useState(false);
  const [pasteError, setPasteError] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastCleared = useRef<string>("");
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLyrics(e.target.value);
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(lyrics);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handlePaste() {
    if (!navigator.clipboard?.readText) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
      setPasteError(true);
      setTimeout(() => setPasteError(false), 3000);
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart ?? lyrics.length;
      const end = el.selectionEnd ?? lyrics.length;
      const next = lyrics.slice(0, start) + text + lyrics.slice(end);
      setLyrics(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + text.length;
        el.focus();
      });
    } catch {
      textareaRef.current?.focus();
    }
  }

  function handleClearAll() {
    if (!lyrics) return;
    lastCleared.current = lyrics;
    setLyrics("");
    setUndoVisible(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoVisible(false), 5000);
    textareaRef.current?.focus();
  }

  function handleUndo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setLyrics(lastCleared.current);
    setUndoVisible(false);
  }

  async function handleAiGenerate() {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch("/api/lyrics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });
      const data = await res.json() as { lyrics?: string; error?: string };
      if (!res.ok || !data.lyrics) throw new Error(data.error ?? "Generation failed");
      setLyrics(data.lyrics);
      setAiOpen(false);
      setAiPrompt("");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }, []);

  const charCount = lyrics.length;
  const wordCount = countWords(lyrics);
  const lineCount = lyrics === "" ? 0 : lyrics.split("\n").length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{charCount} characters</span>
        <span className="text-border">·</span>
        <span>{wordCount} words</span>
        <span className="text-border">·</span>
        <span>{lineCount} lines</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleCopy}
          disabled={!lyrics}
          size="sm"
          variant="outline"
          className="flex-1 gap-2 min-h-[44px]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
        <Button
          type="button"
          onClick={handlePaste}
          size="sm"
          variant="outline"
          className="flex-1 gap-2 min-h-[44px]"
        >
          <ClipboardPaste className="w-4 h-4" />
          Paste
        </Button>
        <Button
          type="button"
          onClick={handleClearAll}
          disabled={!lyrics}
          size="sm"
          variant="outline"
          className="flex-1 gap-2 min-h-[44px] border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>

      {pasteError && (
        <p className="text-xs text-amber-600">
          Paste permission denied — tap inside the editor and use your keyboard&apos;s paste option.
        </p>
      )}

      {/* AI Generate panel */}
      <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/60 overflow-hidden">
        {/* Header toggle */}
        <button
          type="button"
          onClick={() => setAiOpen((o) => !o)}
          aria-expanded={aiOpen}
          className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-violet-400" />
            Generate with AI
          </span>
          {aiOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {/* Expandable body */}
        {aiOpen && (
          <div className="px-3 pb-3 space-y-2 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-500 pt-2">
              Describe the song, mood, or style and AI will write full lyrics for you.
            </p>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. upbeat pop song about a summer road trip, chorus-heavy…"
              rows={3}
              disabled={isGenerating}
              aria-label="AI lyric generation prompt"
              className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent disabled:opacity-50"
            />

            {aiError && (
              <p className="text-xs text-red-400">{aiError}</p>
            )}

            <Button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              size="sm"
              className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white min-h-[44px] disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={lyrics}
        onChange={handleChange}
        placeholder={`Write your lyrics here…\n\n[Verse 1]\n\n[Chorus]\n\n[Bridge]`}
        rows={24}
        className="w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm font-mono leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        style={{ WebkitUserSelect: "text", userSelect: "text" }}
        spellCheck
      />

      {/* Undo toast */}
      {undoVisible && (
        <div className="flex items-center justify-between rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-zinc-200">
          <span>Lyrics cleared.</span>
          <button
            type="button"
            onClick={handleUndo}
            className="ml-4 font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
