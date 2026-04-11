"use client";

import { useState, useRef, useCallback } from "react";
import { Trash2, Copy, Check, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function LyricEditor() {
  const [lyrics, setLyrics] = useState("");
  const [copied, setCopied] = useState(false);
  const [pasteError, setPasteError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (!window.confirm("Clear all lyrics? This cannot be undone.")) return;
    setLyrics("");
    textareaRef.current?.focus();
  }

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
    </div>
  );
}
