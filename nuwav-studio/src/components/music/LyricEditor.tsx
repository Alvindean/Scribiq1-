"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { Trash2, Copy, Check, ClipboardPaste, Wand2, Loader2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
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
  const [saveOpen, setSaveOpen] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
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

  function insertSection(marker: string) {
    const el = textareaRef.current;
    const pos = el ? (el.selectionStart ?? lyrics.length) : lyrics.length;
    const prefix = pos > 0 && lyrics[pos - 1] !== "\n" ? "\n\n" : "";
    const insert = `${prefix}[${marker}]\n`;
    const next = lyrics.slice(0, pos) + insert + lyrics.slice(pos);
    setLyrics(next);
    // Restore cursor after inserted text
    const newPos = pos + insert.length;
    requestAnimationFrame(() => {
      if (!el) return;
      el.selectionStart = el.selectionEnd = newPos;
      el.focus();
    });
  }

  async function handleSaveToLesson() {
    if (!lessonId.trim() || !lyrics) return;
    setIsSaving(true);
    setSaveStatus("idle");
    setSaveError(null);
    try {
      const res = await fetch("/api/lyrics/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lessonId.trim(), lyrics }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Save failed");
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
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

      {/* Section template pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
        {["Verse 1", "Verse 2", "Pre-Chorus", "Chorus", "Bridge", "Outro", "Hook", "Intro"].map((s) => (
          <button key={s} type="button" onClick={() => insertSection(s)}
            className="shrink-0 rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:border-violet-500 hover:text-violet-300 transition-colors whitespace-nowrap">
            + {s}
          </button>
        ))}
      </div>

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

      {/* Save to Lesson */}
      <div>
        <Button
          type="button"
          onClick={() => { setSaveOpen((o) => !o); setSaveStatus("idle"); setSaveError(null); }}
          disabled={!lyrics}
          size="sm"
          variant="outline"
          aria-label="Save lyrics to a lesson"
          className="gap-2 min-h-[44px] disabled:opacity-40"
        >
          <BookOpen className="w-4 h-4" />
          Save to Lesson
        </Button>

        {saveOpen && (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                placeholder="Paste lesson ID from the URL"
                disabled={isSaving}
                aria-label="Lesson ID"
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent disabled:opacity-50"
              />
              <Button
                type="button"
                onClick={handleSaveToLesson}
                disabled={isSaving || !lessonId.trim() || !lyrics}
                size="sm"
                className="gap-2 bg-violet-600 hover:bg-violet-700 text-white min-h-[44px] disabled:opacity-40"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4 text-green-300" />
                    Saved!
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            {saveStatus === "error" && saveError && (
              <p className="text-xs text-red-400">{saveError}</p>
            )}
            {saveStatus === "success" && (
              <p className="text-xs text-green-500">Lyrics saved to lesson script.</p>
            )}
          </div>
        )}
      </div>

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
