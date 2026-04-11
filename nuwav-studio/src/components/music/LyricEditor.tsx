"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Wand2,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Check,
  Copy,
  ClipboardPaste,
  History,
  GraduationCap,
  RefreshCw,
  X,
  Trash2,
  Mic,
  MicOff,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HistoryEntry {
  text: string;
  savedAt: number; // epoch ms
}

interface CoachResult {
  rhymeScheme: string;
  weakLines: string[];
  suggestions: string[];
  overallScore: number;
  flowNotes: string;
}

// ---------------------------------------------------------------------------
// Syllable counting (no 'syllable' npm package — custom implementation)
// ---------------------------------------------------------------------------

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function countLineSyllables(line: string): number {
  return line
    .trim()
    .split(/\s+/)
    .reduce((sum, w) => sum + countSyllables(w), 0);
}

// ---------------------------------------------------------------------------
// Syllable badge color helpers
// ---------------------------------------------------------------------------

function syllableBadgeClass(count: number): string {
  if (count >= 14) return "bg-red-900/60 text-red-300 border border-red-700/50";
  if (count >= 11) return "bg-amber-900/60 text-amber-300 border border-amber-700/50";
  if (count >= 6) return "bg-green-900/60 text-green-300 border border-green-700/50";
  return "bg-zinc-700/60 text-zinc-400 border border-zinc-600/50";
}

// ---------------------------------------------------------------------------
// Lyrics parsing
// ---------------------------------------------------------------------------

type LineType = "section" | "lyric" | "empty";

interface ParsedLine {
  type: LineType;
  text: string; // raw text
  index: number; // index in the split("\n") array
}

function parseLines(lyrics: string): ParsedLine[] {
  return lyrics.split("\n").map((text, index) => {
    if (text.trim() === "") return { type: "empty", text, index };
    if (/^\[.+\]$/.test(text.trim())) return { type: "section", text, index };
    return { type: "lyric", text, index };
  });
}

// Replace a single line in the lyrics string
function replaceLine(lyrics: string, lineIndex: number, newText: string): string {
  const lines = lyrics.split("\n");
  lines[lineIndex] = newText;
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Persistent history helpers
// ---------------------------------------------------------------------------

const HISTORY_KEY = "soniq:lyric-history";
const MAX_HISTORY = 10;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

function pushHistory(lyrics: string): void {
  if (!lyrics.trim()) return;
  const entries = loadHistory();
  // Avoid duplicates at head
  if (entries[0]?.text === lyrics) return;
  const next: HistoryEntry[] = [
    { text: lyrics, savedAt: Date.now() },
    ...entries,
  ].slice(0, MAX_HISTORY);
  saveHistory(next);
}

// ---------------------------------------------------------------------------
// Dropdown constants
// ---------------------------------------------------------------------------

const GENRES = [
  { value: "pop", label: "Pop" },
  { value: "hip-hop", label: "Hip-Hop / Rap" },
  { value: "r&b", label: "R&B / Soul" },
  { value: "country", label: "Country" },
  { value: "rock", label: "Rock / Alternative" },
  { value: "edm", label: "EDM / Electronic" },
  { value: "blues", label: "Blues" },
  { value: "jazz", label: "Jazz" },
  { value: "folk", label: "Folk / Acoustic" },
  { value: "gospel", label: "Gospel" },
  { value: "reggae", label: "Reggae" },
] as const;

const MOODS = [
  { value: "uplifting", label: "Uplifting / Joyful" },
  { value: "melancholic", label: "Melancholic / Sad" },
  { value: "energetic", label: "Energetic / Intense" },
  { value: "romantic", label: "Romantic / Sensual" },
  { value: "rebellious", label: "Rebellious / Angry" },
  { value: "peaceful", label: "Peaceful / Calm" },
  { value: "nostalgic", label: "Nostalgic / Reflective" },
  { value: "dark", label: "Dark / Mysterious" },
  { value: "hopeful", label: "Hopeful / Inspired" },
  { value: "playful", label: "Playful / Fun" },
] as const;

// ---------------------------------------------------------------------------
// Stats helpers
// ---------------------------------------------------------------------------

function computeStats(lines: ParsedLine[]) {
  const lyricLines = lines.filter((l) => l.type === "lyric");
  const syllableCounts = lyricLines.map((l) => countLineSyllables(l.text));
  const total = syllableCounts.reduce((s, c) => s + c, 0);
  const avg = lyricLines.length > 0 ? Math.round(total / lyricLines.length) : 0;
  const overLimit = syllableCounts.filter((c) => c >= 14).length;
  return { lineCount: lyricLines.length, avg, overLimit };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SyllableBadgeProps {
  count: number;
}
function SyllableBadge({ count }: SyllableBadgeProps) {
  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold min-w-[2rem] ${syllableBadgeClass(count)}`}
    >
      {count}
    </span>
  );
}

interface LineRowProps {
  line: ParsedLine;
  isEditing: boolean;
  isRegenerating: boolean;
  onStartEdit: () => void;
  onSaveEdit: (text: string) => void;
  onCancelEdit: () => void;
  onRegenerate: () => void;
  isEditingSection?: boolean;
  onStartSectionEdit?: () => void;
  onSaveSectionEdit?: (label: string) => void;
}

function LineRow({
  line,
  isEditing,
  isRegenerating,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRegenerate,
  isEditingSection,
  onStartSectionEdit,
  onSaveSectionEdit,
}: LineRowProps) {
  const [draft, setDraft] = useState(line.text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync draft if line changes externally while not editing
  useEffect(() => {
    if (!isEditing) setDraft(line.text);
  }, [line.text, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  if (line.type === "empty") {
    return <div className="h-4" />;
  }

  if (line.type === "section") {
    const innerLabel = line.text.trim().replace(/^\[|\]$/g, "");
    if (isEditingSection) {
      return (
        <div className="flex items-center gap-2 py-1.5 px-3">
          <input
            autoFocus
            defaultValue={innerLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); onSaveSectionEdit?.(e.currentTarget.value); }
              if (e.key === "Escape") onSaveSectionEdit?.(innerLabel);
            }}
            onBlur={(e) => onSaveSectionEdit?.(e.currentTarget.value)}
            className="rounded-full bg-amber-900/50 border border-amber-500 px-3 py-0.5 text-xs font-semibold text-amber-200 tracking-wide outline-none w-40"
          />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 py-1.5 px-3 group">
        <span
          onClick={onStartSectionEdit}
          title="Click to rename section"
          className="inline-flex items-center rounded-full bg-amber-900/50 border border-amber-700/60 px-3 py-0.5 text-xs font-semibold text-amber-300 tracking-wide cursor-pointer hover:border-amber-500 hover:text-amber-200 transition-colors"
        >
          {line.text.trim()}
        </span>
        <span className="text-[10px] text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">click to rename</span>
      </div>
    );
  }

  // Lyric line
  const syllableCount = countLineSyllables(line.text);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-md border border-violet-600/60">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSaveEdit(draft);
            } else if (e.key === "Escape") {
              e.preventDefault();
              onCancelEdit();
            }
          }}
          onBlur={() => onSaveEdit(draft)}
          className="flex-1 bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          aria-label="Edit lyric line"
        />
        <SyllableBadge count={countLineSyllables(draft)} />
        <button
          type="button"
          onMouseDown={(e) => {
            // Prevent blur from firing before cancel
            e.preventDefault();
            onCancelEdit();
          }}
          aria-label="Cancel edit"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onStartEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onStartEdit();
      }}
      className="group flex items-center gap-2 px-3 py-1 rounded-md cursor-text hover:bg-zinc-800/60 transition-colors"
    >
      <span className="flex-1 font-mono text-sm text-zinc-200 leading-relaxed truncate">
        {line.text}
      </span>
      {isRegenerating ? (
        <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin shrink-0" />
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegenerate();
          }}
          aria-label="Regenerate this line"
          className="opacity-0 group-hover:opacity-100 shrink-0 text-zinc-500 hover:text-violet-400 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}
      <SyllableBadge count={syllableCount} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main LyricEditor component
// ---------------------------------------------------------------------------

export function LyricEditor() {
  // Core lyrics state
  const [lyrics, setLyrics] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("soniq:lyric-editor-draft") ?? "";
  });

  // Genre/mood (persisted)
  const [aiGenre, setAiGenre] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("soniq:lyric-editor-genre") ?? "";
  });
  const [aiMood, setAiMood] = useState("");

  // Editing state: which line index is being edited
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Per-line regeneration: which line is being regenerated
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  // History popover
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);

  // Coach panel
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachResult, setCoachResult] = useState<CoachResult | null>(null);
  const [coachError, setCoachError] = useState<string | null>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  // Clear All + undo toast
  const [undoVisible, setUndoVisible] = useState(false);
  const lastCleared = useRef("");
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice input
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);

  // Editable section labels
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // AI generate panel
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Save to lesson
  const [saveOpen, setSaveOpen] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
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

  // ---------------------------------------------------------------------------
  // Persist draft + genre
  // ---------------------------------------------------------------------------

  useEffect(() => {
    localStorage.setItem("soniq:lyric-editor-draft", lyrics);
  }, [lyrics]);

  useEffect(() => {
    if (aiGenre) localStorage.setItem("soniq:lyric-editor-genre", aiGenre);
  }, [aiGenre]);

  useEffect(() => {
    setVoiceSupported(!!(window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition));
  }, []);

  // ---------------------------------------------------------------------------
  // Parsed lines + stats
  // ---------------------------------------------------------------------------

  const parsedLines = parseLines(lyrics);
  const stats = computeStats(parsedLines);

  // ---------------------------------------------------------------------------
  // History popover close on outside click
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!historyOpen) return;
    function handler(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [historyOpen]);

  // ---------------------------------------------------------------------------
  // Inline edit handlers
  // ---------------------------------------------------------------------------

  const handleStartEdit = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const handleSaveEdit = useCallback(
    (index: number, newText: string) => {
      if (newText !== parsedLines[index]?.text) {
        const updated = replaceLine(lyrics, index, newText);
        pushHistory(lyrics);
        setLyrics(updated);
      }
      setEditingIndex(null);
    },
    [lyrics, parsedLines]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Clear All + undo
  // ---------------------------------------------------------------------------

  function handleClearAll() {
    if (!lyrics) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    pushHistory(lyrics);
    lastCleared.current = lyrics;
    setLyrics("");
    setUndoVisible(true);
    undoTimerRef.current = setTimeout(() => {
      setUndoVisible(false);
      lastCleared.current = "";
    }, 5000);
  }

  function handleUndo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setLyrics(lastCleared.current);
    setUndoVisible(false);
    lastCleared.current = "";
  }

  // ---------------------------------------------------------------------------
  // Voice input
  // ---------------------------------------------------------------------------

  function toggleRecording() {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .slice(e.resultIndex)
        .filter((r) => r.isFinal)
        .map((r) => r[0].transcript.trim())
        .filter(Boolean)
        .join("\n");
      if (transcript) setLyrics((prev) => (prev ? `${prev}\n${transcript}` : transcript));
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }

  // ---------------------------------------------------------------------------
  // Editable section labels
  // ---------------------------------------------------------------------------

  function handleSaveSectionEdit(index: number, newLabel: string) {
    const trimmed = newLabel.trim();
    setEditingSectionIndex(null);
    if (!trimmed) return;
    const lines = lyrics.split("\n");
    lines[index] = `[${trimmed}]`;
    setLyrics(lines.join("\n"));
  }

  // ---------------------------------------------------------------------------
  // Per-line regeneration
  // ---------------------------------------------------------------------------

  async function handleRegenerateLine(index: number, lineText: string) {
    setRegeneratingIndex(index);
    try {
      const res = await fetch("/api/lyrics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Rewrite this single line: "${lineText}" to fit in a ${aiGenre || "pop"} song. Keep similar syllable count. Return only the new line, no quotes, no explanation.`,
          genre: aiGenre || undefined,
        }),
      });
      const data = (await res.json()) as { lyrics?: string; error?: string };
      if (!res.ok || !data.lyrics) throw new Error(data.error ?? "Generation failed");
      // The API returns a full lyrics block — take only the first non-empty line
      const newLine = data.lyrics.split("\n").find((l) => l.trim()) ?? lineText;
      pushHistory(lyrics);
      setLyrics(replaceLine(lyrics, index, newLine.trim()));
    } catch {
      // silently fail — line stays as-is
    } finally {
      setRegeneratingIndex(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Section insertion
  // ---------------------------------------------------------------------------

  function insertSection(marker: string) {
    setLyrics((prev) => {
      const prefix =
        prev.length > 0 && prev[prev.length - 1] !== "\n" ? "\n\n" : "";
      return `${prev}${prefix}[${marker}]\n`;
    });
  }

  // ---------------------------------------------------------------------------
  // Copy / Paste
  // ---------------------------------------------------------------------------

  async function handleCopy() {
    const ok = await copyToClipboard(lyrics);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handlePaste() {
    if (!navigator.clipboard?.readText) return;
    try {
      const text = await navigator.clipboard.readText();
      pushHistory(lyrics);
      setLyrics((prev) => (prev ? prev + "\n" + text : text));
    } catch {
      // permission denied
    }
  }

  // ---------------------------------------------------------------------------
  // History
  // ---------------------------------------------------------------------------

  function openHistory() {
    setHistoryEntries(loadHistory());
    setHistoryOpen((o) => !o);
  }

  function restoreHistory(entry: HistoryEntry) {
    pushHistory(lyrics);
    setLyrics(entry.text);
    setHistoryOpen(false);
  }

  // ---------------------------------------------------------------------------
  // Coach
  // ---------------------------------------------------------------------------

  async function handleCoach() {
    if (!lyrics.trim()) return;
    setCoachOpen(true);
    setCoachLoading(true);
    setCoachError(null);
    setCoachResult(null);
    try {
      const res = await fetch("/api/lyrics/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics,
          ...(aiGenre && { genre: aiGenre }),
        }),
      });
      const data = (await res.json()) as CoachResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Coach analysis failed");
      setCoachResult(data);
    } catch (err) {
      setCoachError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setCoachLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // AI Generate
  // ---------------------------------------------------------------------------

  async function handleAiGenerate() {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch("/api/lyrics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          ...(aiGenre && { genre: aiGenre }),
          ...(aiMood && { mood: aiMood }),
        }),
      });
      const data = (await res.json()) as { lyrics?: string; error?: string };
      if (!res.ok || !data.lyrics)
        throw new Error(data.error ?? "Generation failed");
      pushHistory(lyrics);
      setLyrics(data.lyrics);
      setAiOpen(false);
      setAiPrompt("");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Save to Lesson
  // ---------------------------------------------------------------------------

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
      const data = (await res.json()) as { success?: boolean; error?: string };
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
          /* silently fail */
        })
        .finally(() => setLoadingLessons(false));
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex gap-0 relative">
      {/* ------------------------------------------------------------------ */}
      {/* Main editor column                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className={`flex flex-col gap-3 flex-1 min-w-0 transition-all duration-300${coachOpen ? " mr-80" : ""}`}>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-100">
              ✏️ Lyric Editor
            </h2>
            {lyrics.length > 0 && (
              <span className="text-[10px] text-zinc-600">Draft auto-saved</span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500">
            live syllable counter · click any line to edit · ↺ to regenerate
          </p>
          {/* Legend */}
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              6–10 · chorus ideal
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              11–13 · verse ok
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              14+ · AI may drift
            </span>
          </div>
        </div>

        {/* Stats + action bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left: stats */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="flex items-center gap-2 text-xs text-zinc-500"
          >
            <span>Lines: <span className="text-zinc-300 font-medium">{stats.lineCount}</span></span>
            <span className="text-zinc-700">·</span>
            <span>Avg syllables: <span className="text-zinc-300 font-medium">{stats.avg}</span></span>
            <span className="text-zinc-700">·</span>
            <span>
              Over limit:{" "}
              <span className={`font-medium ${stats.overLimit > 0 ? "text-red-400" : "text-zinc-300"}`}>
                {stats.overLimit}
              </span>
            </span>
            {coachResult && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span className={`font-semibold ${coachResult.overallScore >= 8 ? "text-green-400" : coachResult.overallScore >= 6 ? "text-amber-400" : "text-red-400"}`}>
                    {coachResult.overallScore}/10
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Copy */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!lyrics}
              aria-label={copied ? "Copied!" : "Copy lyrics"}
              className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-40 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>

            {/* Paste */}
            <button
              type="button"
              onClick={handlePaste}
              aria-label="Paste from clipboard"
              className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Paste
            </button>

            {/* History */}
            <div className="relative" ref={historyRef}>
              <button
                type="button"
                onClick={openHistory}
                aria-label="View version history"
                aria-expanded={historyOpen}
                className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                History
              </button>

              {historyOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden">
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                      Version History
                    </p>
                  </div>
                  {historyEntries.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-zinc-600">No history yet.</p>
                  ) : (
                    <ul className="max-h-64 overflow-y-auto">
                      {historyEntries.map((entry, i) => {
                        const firstLine =
                          entry.text.split("\n").find((l) => l.trim()) ?? "(empty)";
                        const date = new Date(entry.savedAt);
                        const label = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
                        return (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => restoreHistory(entry)}
                              className="w-full flex flex-col gap-0.5 px-3 py-2 text-left hover:bg-zinc-800 transition-colors"
                            >
                              <span className="text-[11px] text-zinc-300 truncate font-mono">
                                {firstLine}
                              </span>
                              <span className="text-[10px] text-zinc-600">{label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Coach */}
            <button
              type="button"
              onClick={handleCoach}
              disabled={!lyrics.trim()}
              aria-label="Open AI coach"
              className="flex items-center gap-1 rounded-md border border-violet-700/70 bg-violet-900/30 px-2.5 py-1.5 text-xs text-violet-300 hover:bg-violet-800/50 hover:text-violet-200 disabled:opacity-40 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Coach
            </button>

            {/* Clear All */}
            <button type="button" onClick={handleClearAll} disabled={!lyrics}
              aria-label="Clear all lyrics"
              className="flex items-center gap-1 rounded-md border border-red-900/60 bg-zinc-800/60 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-40 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>

            {/* Voice input */}
            {voiceSupported && (
              <button type="button" onClick={toggleRecording}
                aria-label={isRecording ? "Stop recording" : "Record lyrics with voice"}
                className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${isRecording ? "border-red-600 bg-red-900/40 text-red-300 hover:bg-red-900/60 animate-pulse" : "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white"}`}>
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isRecording ? "Stop" : "Voice"}
              </button>
            )}
          </div>
        </div>

        {/* Section template pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
          {["Verse 1", "Verse 2", "Pre-Chorus", "Chorus", "Bridge", "Outro", "Hook", "Intro"].map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => insertSection(s)}
                className="shrink-0 rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:border-violet-500 hover:text-violet-300 transition-colors whitespace-nowrap"
              >
                + {s}
              </button>
            )
          )}
        </div>

        {/* Bracket / annotation library */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          <span className="text-[10px] text-zinc-600 self-center pr-1">Insert:</span>
          {[
            "(ad-lib)", "(repeat)", "(x2)", "(x3)", "(fade out)", "(spoken)",
            "(yeah)", "(woah)", "(hey)", "(na-na-na)", "(ooh)", "(uh)",
          ].map((ann) => (
            <button
              key={ann}
              type="button"
              onClick={() => setLyrics((prev) => {
                const lines = prev.split("\n");
                const lastNonEmpty = [...lines].reverse().findIndex((l) => l.trim());
                if (lastNonEmpty !== -1) {
                  const idx = lines.length - 1 - lastNonEmpty;
                  lines[idx] = lines[idx].trimEnd() + " " + ann;
                  return lines.join("\n");
                }
                return prev ? `${prev} ${ann}` : ann;
              })}
              className="shrink-0 rounded-full border border-zinc-700/80 px-2 py-0.5 text-[11px] text-zinc-500 hover:border-amber-600/60 hover:text-amber-400 transition-colors font-mono"
            >
              {ann}
            </button>
          ))}
        </div>

        {/* Line-by-line editor */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden">
          {lyrics.trim() === "" ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-zinc-600 font-mono">
                Write your lyrics here…
              </p>
              <p className="text-xs text-zinc-700 mt-1">
                Add a section above, or use Generate with AI below
              </p>
            </div>
          ) : (
            <div className="py-2">
              {parsedLines.map((line) => (
                <LineRow
                  key={line.index}
                  line={line}
                  isEditing={editingIndex === line.index}
                  isRegenerating={regeneratingIndex === line.index}
                  onStartEdit={() =>
                    line.type === "lyric" && handleStartEdit(line.index)
                  }
                  onSaveEdit={(text) => handleSaveEdit(line.index, text)}
                  onCancelEdit={handleCancelEdit}
                  onRegenerate={() =>
                    line.type === "lyric" &&
                    handleRegenerateLine(line.index, line.text)
                  }
                  isEditingSection={line.type === "section" && editingSectionIndex === line.index}
                  onStartSectionEdit={() => setEditingSectionIndex(line.index)}
                  onSaveSectionEdit={(label) => handleSaveSectionEdit(line.index, label)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="flex flex-col gap-3">
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
                  <p className="text-xs text-green-500">Lyrics saved to lesson script.</p>
                )}
              </div>
            )}
          </div>

          {/* AI Generate panel */}
          <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/60 overflow-hidden">
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

            {aiOpen && (
              <div className="px-3 pb-3 space-y-2 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-500 pt-2">
                  Choose a genre and mood, then describe the song — AI will write
                  genre-accurate lyrics with the right structure.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={aiGenre}
                    onChange={(e) => setAiGenre(e.target.value)}
                    disabled={isGenerating}
                    aria-label="Genre"
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
                  >
                    <option value="">Any genre</option>
                    {GENRES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={aiMood}
                    onChange={(e) => setAiMood(e.target.value)}
                    disabled={isGenerating}
                    aria-label="Mood"
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
                  >
                    <option value="">Any mood</option>
                    {MOODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. a road trip with an old friend, themes of letting go…"
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
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Coach slide-in panel                                                */}
      {/* ------------------------------------------------------------------ */}
      {undoVisible && (
        <div role="alert" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 shadow-xl text-sm">
          <span className="text-zinc-300">Lyrics cleared</span>
          <button onClick={handleUndo} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Undo</button>
        </div>
      )}

      {coachOpen && (
        <div className="absolute right-0 top-0 w-80 h-full flex flex-col rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-zinc-100">Lyric Coach</span>
            </div>
            <button
              type="button"
              onClick={() => setCoachOpen(false)}
              aria-label="Close coach panel"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel body */}
          <div className="flex-1 overflow-y-auto p-4">
            {coachLoading && (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                <p className="text-xs text-zinc-500">Analyzing your lyrics…</p>
              </div>
            )}

            {coachError && (
              <div className="rounded-md bg-red-950/40 border border-red-800/50 px-3 py-2">
                <p className="text-xs text-red-400">{coachError}</p>
              </div>
            )}

            {coachResult && !coachLoading && (
              <div className="flex flex-col gap-4">
                {/* Score */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                    Overall Score
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      coachResult.overallScore >= 8
                        ? "text-green-400"
                        : coachResult.overallScore >= 5
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {coachResult.overallScore}
                    <span className="text-sm font-normal text-zinc-600">/10</span>
                  </span>
                </div>

                {/* Rhyme Scheme */}
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                    Rhyme Scheme
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {coachResult.rhymeScheme}
                  </p>
                </div>

                {/* Flow Notes */}
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                    Flow & Rhythm
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {coachResult.flowNotes}
                  </p>
                </div>

                {/* Weak Lines */}
                {coachResult.weakLines.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                      Lines to Improve
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {coachResult.weakLines.map((line, i) => (
                        <li
                          key={i}
                          className="rounded-md bg-red-950/30 border border-red-900/40 px-3 py-1.5 text-xs text-red-300 font-mono"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {coachResult.suggestions.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                      Suggestions
                    </p>
                    <ul className="flex flex-col gap-2">
                      {coachResult.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                          <span className="text-violet-500 shrink-0 font-semibold">{i + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Re-analyze button */}
          {!coachLoading && (
            <div className="p-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleCoach}
                disabled={!lyrics.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-violet-600 hover:bg-violet-700 px-3 py-2 text-xs font-medium text-white disabled:opacity-40 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-analyze
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
