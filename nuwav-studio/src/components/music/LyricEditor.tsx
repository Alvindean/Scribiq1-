"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Trash2, Copy, Check, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/[\s\u00A0\u200B\u2000-\u200A\u202F\u205F\u3000]+/).length;
}

export function LyricEditor() {
  const [lyrics, setLyrics] = useState("");
  const [copied, setCopied] = useState(false);
  const [pasteError, setPasteError] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
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

  useEffect(() => () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }, []);

  const charCount = lyrics.length;
  const wordCount = countWords(lyrics);
  const lineCount = lyrics === "" ? 0 : lyrics.split("\n").filter(l => l.trim() !== "").length;

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
