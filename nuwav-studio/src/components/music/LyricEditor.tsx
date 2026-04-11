"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { Trash2, Copy, Check, ClipboardPaste, Wand2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/[\s\u00A0\u200B\u2000-\u200A\u202F\u205F\u3000]+/).length;
}

export function LyricEditor() {
  const [lyrics, setLyrics] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("soniq:lyric-editor-draft") ?? "";
  });
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
  const pendingCursorRef = useRef<number | null>(null);

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
      pendingCursorRef.current = start + text.length;
    } catch {
      textareaRef.current?.focus();
    }
  }

  useLayoutEffect(() => {
    if (pendingCursorRef.current === null) return;
    const el = textareaRef.current;
    if (!el) return;
    el.selectionStart = el.selectionEnd = pendingCursorRef.current;
    el.focus();
    pendingCursorRef.current = null;
  }, [lyrics]);

  function handleClearAll() {
    if (!lyrics) return;
    lastCleared.current = lyrics;
    setLyrics("");
    setUndoVisible(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => { setUndoVisible(false); lastCleared.current = ""; }, 5000);
    textareaRef.current?.focus();
  }

  function handleUndo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setLyrics(lastCleared.current);
    setUndoVisible(false);
    lastCleared.current = "";
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

  useEffect(() => () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); lastCleared.current = ""; }, []);

  useEffect(() => {
    localStorage.setItem("soniq:lyric-editor-draft", lyrics);
  }, [lyrics]);

  const charCount = lyrics.length;
  const wordCount = countWords(lyrics);
  const lineCount = lyrics === "" ? 0 : lyrics.split("\n").filter(l => l.trim() !== "").length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div id="lyric-stats" role="status" aria-live="polite" aria-atomic="true" className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{charCount} characters</span>
        <span className="text-border">·</span>
        <span>{wordCount} words</span>
        <span className="text-border">·</span>
        <span>{lineCount} lines</span>
      </div>

      {lyrics.length > 0 && (
        <p className="text-xs text-muted-foreground/50">Draft auto-saved</p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleCopy}
          disabled={!lyrics}
          size="sm"
          variant="outline"
          aria-label={copied ? "Lyrics copied to clipboard" : "Copy lyrics"}
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
          aria-label="Paste from clipboard"
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
          aria-label="Clear all lyrics"
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

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={lyrics}
        onChange={handleChange}
        placeholder={`Write your lyrics here…\n\n[Verse 1]\n\n[Chorus]\n\n[Bridge]`}
        rows={24}
        aria-label="Lyric editor"
        aria-describedby="lyric-stats"
        className="w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm font-mono leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        style={{ WebkitUserSelect: "text", userSelect: "text" }}
        spellCheck
      />

      {/* Undo toast */}
      {undoVisible && (
        <div role="alert" className="flex items-center justify-between rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-zinc-200">
          <span>Lyrics cleared.</span>
          <button
            type="button"
            onClick={handleUndo}
            aria-label="Undo clear"
            className="ml-4 font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
