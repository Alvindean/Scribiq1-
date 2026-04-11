"use client";

import { useState, useRef, useEffect } from "react";
import {
  Wand2,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseScriptEditor } from "@/components/editor/BaseScriptEditor";

export function LyricEditor() {
  const [lyrics, setLyrics] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("soniq:lyric-editor-draft") ?? "";
  });
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lessonOptions, setLessonOptions] = useState<
    Array<{
      projectTitle: string;
      lessonId: string;
      lessonTitle: string;
      moduleTitle: string;
    }>
  >([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Used only by insertSection — BaseScriptEditor owns the main textarea ref
  // but section pills append at end-of-text so we don't need cursor precision here.
  const insertRef = useRef<HTMLTextAreaElement | null>(null);

  // Persist draft to localStorage whenever lyrics change
  useEffect(() => {
    localStorage.setItem("soniq:lyric-editor-draft", lyrics);
  }, [lyrics]);

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
      const data = (await res.json()) as { lyrics?: string; error?: string };
      if (!res.ok || !data.lyrics)
        throw new Error(data.error ?? "Generation failed");
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
    // Append the marker after the last non-empty character.
    // We don't have cursor access (BaseScriptEditor owns the ref), so
    // we insert at end-of-text — consistent with tapping a pill button
    // which unfocuses the textarea anyway.
    setLyrics((prev) => {
      const prefix =
        prev.length > 0 && prev[prev.length - 1] !== "\n" ? "\n\n" : "";
      return `${prev}${prefix}[${marker}]\n`;
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
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !data.success)
        throw new Error(data.error ?? "Save failed");
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  function openSavePanel() {
    const opening = !saveOpen;
    setSaveOpen(opening);
    setSaveStatus("idle");
    setSaveError(null);
    if (opening) {
      setLoadingLessons(true);
      fetch("/api/user/lessons")
        .then(
          (r) =>
            r.json() as Promise<{
              projects?: Array<{
                id: string;
                title: string;
                lessons: Array<{
                  id: string;
                  title: string;
                  moduleTitle: string;
                }>;
              }>;
              error?: string;
            }>
        )
        .then((data) => {
          if (data.projects) {
            const flat = data.projects.flatMap((p) =>
              p.lessons.map((l) => ({
                projectTitle: p.title,
                lessonId: l.id,
                lessonTitle: l.title,
                moduleTitle: l.moduleTitle,
              }))
            );
            setLessonOptions(flat);
          }
        })
        .catch(() => {
          /* silently fail — user can still type */
        })
        .finally(() => setLoadingLessons(false));
    }
  }

  return (
    <div className="space-y-4">
      {lyrics.length > 0 && (
        <p className="text-xs text-muted-foreground/50">Draft auto-saved</p>
      )}

      {/* Section template pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
        {[
          "Verse 1",
          "Verse 2",
          "Pre-Chorus",
          "Chorus",
          "Bridge",
          "Outro",
          "Hook",
          "Intro",
        ].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => insertSection(s)}
            className="shrink-0 rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:border-violet-500 hover:text-violet-300 transition-colors whitespace-nowrap"
          >
            + {s}
          </button>
        ))}
      </div>

      <BaseScriptEditor
        value={lyrics}
        onChange={setLyrics}
        placeholder={`Write your lyrics here…\n\n[Verse 1]\n\n[Chorus]\n\n[Bridge]`}
        rows={24}
      >
        {/* Save to Lesson */}
        <div>
          <Button
            type="button"
            onClick={openSavePanel}
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
                <select
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  disabled={isSaving || loadingLessons}
                  aria-label="Select a lesson"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
                >
                  <option value="">
                    {loadingLessons ? "Loading lessons…" : "— Select a lesson —"}
                  </option>
                  {Array.from(
                    new Set(lessonOptions.map((o) => o.projectTitle))
                  ).map((projectTitle) => (
                    <optgroup key={projectTitle} label={projectTitle}>
                      {lessonOptions
                        .filter((o) => o.projectTitle === projectTitle)
                        .map((o) => (
                          <option key={o.lessonId} value={o.lessonId}>
                            {`[${o.moduleTitle}] → ${o.lessonTitle}`}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
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
                <p className="text-xs text-green-500">
                  Lyrics saved to lesson script.
                </p>
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
                Describe the song, mood, or style and AI will write full lyrics
                for you.
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

              {aiError && <p className="text-xs text-red-400">{aiError}</p>}

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
      </BaseScriptEditor>
    </div>
  );
}
