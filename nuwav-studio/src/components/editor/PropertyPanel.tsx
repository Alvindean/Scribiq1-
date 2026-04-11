"use client";
import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { useProjectStore } from "@/stores/project-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { VisualSettings } from "@/lib/db/schema";
import type { PixabayImage } from "@/app/api/images/search/route";
import { VoiceoverPanel } from "./VoiceoverPanel";
import {
  Mic,
  Save,
  LayoutGrid,
  Clock,
  FileText,
  Loader2,
  Wand2,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  Search,
  Check,
  ImageOff,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Sun,
  Moon,
} from "lucide-react";

// ── Visuals Tab ───────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  { label: "Slate",    value: "#1e293b" },
  { label: "Navy",     value: "#0f172a" },
  { label: "Indigo",   value: "#312e81" },
  { label: "Violet",   value: "#4c1d95" },
  { label: "Teal",     value: "#134e4a" },
  { label: "Forest",   value: "#14532d" },
  { label: "Crimson",  value: "#7f1d1d" },
  { label: "Charcoal", value: "#27272a" },
  { label: "Stone",    value: "#44403c" },
  { label: "White",    value: "#ffffff" },
] as const;

const LS_KEY = (id: string) => `visual_settings_${id}`;

function loadLocalSettings(lessonId: string): VisualSettings {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY(lessonId));
    return raw ? (JSON.parse(raw) as VisualSettings) : {};
  } catch {
    return {};
  }
}

function saveLocalSettings(lessonId: string, settings: VisualSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY(lessonId), JSON.stringify(settings));
  } catch {
    // ignore quota errors
  }
}

interface VisualsTabProps {
  lessonId: string;
  initialSettings: VisualSettings | null | undefined;
  onSettingsSaved: (settings: VisualSettings) => void;
}

function VisualsTab({ lessonId, initialSettings, onSettingsSaved }: VisualsTabProps) {
  const [settings, setSettings] = useState<VisualSettings>(() => {
    const local = loadLocalSettings(lessonId);
    // Merge: db value takes precedence where it has values, else fall back to local
    return { ...local, ...(initialSettings ?? {}) };
  });
  const [imageQuery, setImageQuery] = useState("");
  const [imageResults, setImageResults] = useState<PixabayImage[]>([]);
  const [imageSearching, setImageSearching] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [customHex, setCustomHex] = useState(settings.backgroundColor ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep customHex in sync when settings change from outside (lesson switch)
  useEffect(() => {
    setCustomHex(settings.backgroundColor ?? "");
  }, [settings.backgroundColor]);

  function updateSettings(patch: Partial<VisualSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveLocalSettings(lessonId, next);
      return next;
    });
    setSaved(false);
  }

  async function handleImageSearch(query: string) {
    const q = query.trim();
    if (q.length < 2) { setImageResults([]); return; }
    setImageSearching(true);
    setImageError(null);
    try {
      const res = await fetch(
        `/api/images/search?q=${encodeURIComponent(q)}&per_page=12`
      );
      const data = (await res.json()) as {
        images?: PixabayImage[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setImageResults(data.images ?? []);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Search failed");
      setImageResults([]);
    } finally {
      setImageSearching(false);
    }
  }

  function onQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setImageQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => handleImageSearch(val), 600);
  }

  function selectImage(img: PixabayImage) {
    updateSettings({
      backgroundImageUrl: img.webUrl,
      backgroundImageThumb: img.previewUrl,
      // Clear solid color when an image is chosen
      backgroundColor: undefined,
    });
    setCustomHex("");
  }

  function clearBackground() {
    updateSettings({
      backgroundImageUrl: undefined,
      backgroundImageThumb: undefined,
      backgroundColor: undefined,
    });
    setCustomHex("");
  }

  function handleHexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCustomHex(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      updateSettings({
        backgroundColor: val,
        backgroundImageUrl: undefined,
        backgroundImageThumb: undefined,
      });
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/visuals`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visualSettings: settings }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        visualSettings?: VisualSettings;
        error?: string;
        warning?: string;
      };
      if (!res.ok && !data.success) throw new Error(data.error ?? "Save failed");
      const saved = data.visualSettings ?? settings;
      onSettingsSaved(saved);
      saveLocalSettings(lessonId, saved);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  // Background preview swatch
  const bgPreviewStyle: React.CSSProperties = settings.backgroundImageThumb
    ? { backgroundImage: `url(${settings.backgroundImageThumb})`, backgroundSize: "cover", backgroundPosition: "center" }
    : settings.backgroundColor
    ? { backgroundColor: settings.backgroundColor }
    : { backgroundColor: "#27272a" };

  return (
    <div className="flex flex-col gap-4">
      {/* Background preview */}
      <div
        className="w-full rounded-lg border border-zinc-700 flex items-center justify-center relative overflow-hidden"
        style={{ height: 64, ...bgPreviewStyle }}
      >
        {!settings.backgroundColor && !settings.backgroundImageThumb && (
          <span className="text-xs text-zinc-500">No background set</span>
        )}
        {(settings.backgroundColor || settings.backgroundImageThumb) && (
          <button
            onClick={clearBackground}
            className="absolute top-1 right-1 rounded bg-black/60 p-0.5 text-zinc-300 hover:text-white transition-colors"
            aria-label="Clear background"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ── Background Color ── */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Background Color
        </p>
        {/* Preset swatches */}
        <div className="grid grid-cols-5 gap-1.5 mb-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() =>
                updateSettings({
                  backgroundColor: c.value,
                  backgroundImageUrl: undefined,
                  backgroundImageThumb: undefined,
                })
              }
              className="relative aspect-square rounded border border-zinc-700 transition-all hover:scale-105 hover:border-zinc-400"
              style={{ backgroundColor: c.value }}
            >
              {settings.backgroundColor === c.value && !settings.backgroundImageThumb && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className="w-3 h-3"
                    style={{ color: c.value === "#ffffff" ? "#000" : "#fff" }}
                  />
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Custom hex */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 shrink-0 rounded border border-zinc-700"
            style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(customHex) ? customHex : "#27272a" }}
          />
          <input
            type="text"
            value={customHex}
            onChange={handleHexChange}
            placeholder="#1a1a2e"
            maxLength={7}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
      </section>

      {/* ── Background Image ── */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Background Image
        </p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={imageQuery}
            onChange={onQueryChange}
            onKeyDown={(e) => { if (e.key === "Enter") { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); handleImageSearch(imageQuery); } }}
            placeholder="Search images…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md pl-7 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          {imageSearching && (
            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 animate-spin" />
          )}
        </div>

        {imageError && (
          <p className="text-[10px] text-red-400 mt-1">{imageError}</p>
        )}

        {imageResults.length > 0 && (
          <div className="grid grid-cols-3 gap-1 mt-2 max-h-44 overflow-y-auto rounded-md">
            {imageResults.map((img) => {
              const isSelected = settings.backgroundImageUrl === img.webUrl;
              return (
                <button
                  key={img.id}
                  onClick={() => selectImage(img)}
                  className={`relative aspect-video overflow-hidden rounded border transition-all ${
                    isSelected
                      ? "border-violet-500 ring-1 ring-violet-500"
                      : "border-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={img.tags[0] ?? "background"}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center bg-violet-900/40">
                      <Check className="w-4 h-4 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!imageSearching && imageQuery.length >= 2 && imageResults.length === 0 && !imageError && (
          <div className="flex flex-col items-center gap-1 py-4 text-zinc-600">
            <ImageOff className="w-5 h-5" />
            <span className="text-xs">No results</span>
          </div>
        )}

        {settings.backgroundImageThumb && (
          <p className="text-[10px] text-zinc-500 mt-1 truncate">
            Image set — click X in preview to clear
          </p>
        )}
      </section>

      {/* ── Text Overlay Settings ── */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Text Overlay
        </p>

        {/* Title position */}
        <p className="text-[10px] text-zinc-500 mb-1.5">Title position</p>
        <div className="grid grid-cols-3 gap-1 mb-3">
          {(["top", "center", "bottom"] as const).map((pos) => {
            const icons = {
              top: AlignStartVertical,
              center: AlignCenterVertical,
              bottom: AlignEndVertical,
            };
            const Icon = icons[pos];
            const active = (settings.titlePosition ?? "center") === pos;
            return (
              <button
                key={pos}
                onClick={() => updateSettings({ titlePosition: pos })}
                className={`flex flex-col items-center gap-1 py-2 rounded border text-xs capitalize transition-colors ${
                  active
                    ? "border-violet-500 bg-violet-900/30 text-violet-300"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {pos}
              </button>
            );
          })}
        </div>

        {/* Text color */}
        <p className="text-[10px] text-zinc-500 mb-1.5">Text color</p>
        <div className="grid grid-cols-2 gap-1">
          {(["light", "dark"] as const).map((mode) => {
            const Icon = mode === "light" ? Sun : Moon;
            const active = (settings.textColor ?? "light") === mode;
            return (
              <button
                key={mode}
                onClick={() => updateSettings({ textColor: mode })}
                className={`flex items-center justify-center gap-2 py-2 rounded border text-xs capitalize transition-colors ${
                  active
                    ? "border-violet-500 bg-violet-900/30 text-violet-300"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Save ── */}
      <div className="flex flex-col gap-1.5 pt-1">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="sm"
          className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white min-h-[44px] text-xs disabled:opacity-60"
        >
          {isSaving ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
          ) : saved ? (
            <><Check className="w-3.5 h-3.5" /> Saved</>
          ) : (
            <><Save className="w-3.5 h-3.5" /> Save Visuals</>
          )}
        </Button>
        {saveError && (
          <p className="text-[10px] text-red-400 text-center">{saveError}</p>
        )}
      </div>
    </div>
  );
}

// ── Chip input ───────────────────────────────────────────────────────────────

interface ChipInputProps {
  chips: string[];
  onChange: (chips: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

function ChipInput({ chips, onChange, placeholder, disabled }: ChipInputProps) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const trimmed = raw.replace(/,+$/, "").trim();
    if (trimmed && !chips.includes(trimmed)) {
      onChange([...chips, trimmed]);
    }
    setInputVal("");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // Pasting comma-separated values splits them all at once
    if (val.includes(",")) {
      const parts = val.split(",").map((s) => s.trim()).filter(Boolean);
      const newChips = parts.slice(0, -1).filter((p) => !chips.includes(p));
      onChange([...chips, ...newChips]);
      setInputVal(parts[parts.length - 1]);
      return;
    }
    setInputVal(val);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === "Tab") && inputVal.trim()) {
      e.preventDefault();
      commit(inputVal);
    } else if (e.key === "Backspace" && !inputVal && chips.length > 0) {
      onChange(chips.slice(0, -1));
    }
  }

  function removeChip(idx: number) {
    onChange(chips.filter((_, i) => i !== idx));
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 min-h-[44px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 rounded bg-violet-700/60 border border-violet-500/40 px-2 py-0.5 text-xs text-violet-200 max-w-[180px]"
        >
          <span className="truncate">{chip}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeChip(idx); }}
              className="shrink-0 text-violet-300 hover:text-white transition-colors"
              aria-label={`Remove "${chip}"`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={chips.length === 0 ? placeholder : "Add another…"}
        className="flex-1 min-w-[100px] bg-transparent text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
      />
    </div>
  );
}

// ── PropertyPanel ─────────────────────────────────────────────────────────────

export function PropertyPanel() {
  const {
    selectedLesson,
    activeTab,
    setActiveTab,
  } = useEditorStore();
  const { updateLesson } = useProjectStore();

  const [scriptDraft, setScriptDraft] = useState<string>("");
  const [durationInput, setDurationInput] = useState<string>("");
  const [scriptDirty, setScriptDirty] = useState(false);

  // Quick Edit state
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [editPrompts, setEditPrompts] = useState<string[]>([]);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLesson) {
      setScriptDraft(selectedLesson.script ?? "");
      setDurationInput(
        selectedLesson.durationSeconds != null
          ? String(selectedLesson.durationSeconds)
          : ""
      );
      setScriptDirty(false);
      setRewriteError(null);
      setEditPrompts([]);
    }
  }, [selectedLesson]);

  if (!selectedLesson) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-sm px-4 text-center">
        Select a lesson to edit its properties.
      </div>
    );
  }

  const handleSaveScript = () => {
    updateLesson(selectedLesson.id, { script: scriptDraft });
    setScriptDirty(false);
  };

  const handleDiscardScript = () => {
    setScriptDraft(selectedLesson.script ?? "");
    setScriptDirty(false);
  };

  const handleClearScript = () => {
    if (!window.confirm("Clear all script content? This cannot be undone.")) return;
    setScriptDraft("");
    setScriptDirty((selectedLesson.script ?? "") !== "");
  };

  const handleApplyQuickEdit = async () => {
    if (!scriptDraft.trim() || editPrompts.length === 0) return;
    setIsRewriting(true);
    setRewriteError(null);
    try {
      const res = await fetch("/api/lessons/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          script: scriptDraft,
          prompts: editPrompts,
        }),
      });
      const data = (await res.json()) as { script?: string; error?: string };
      if (!res.ok || !data.script) throw new Error(data.error ?? "Rewrite failed");
      setScriptDraft(data.script);
      setScriptDirty(data.script !== (selectedLesson.script ?? ""));
      setEditPrompts([]);
      setQuickEditOpen(false);
    } catch (err) {
      setRewriteError(err instanceof Error ? err.message : "Rewrite failed");
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSaveDuration = () => {
    const parsed = parseInt(durationInput, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      updateLesson(selectedLesson.id, { durationSeconds: parsed });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate">
          {selectedLesson.title}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="flex flex-col flex-1 min-h-0"
      >
        <TabsList className="grid grid-cols-4 mx-3 mt-3 shrink-0 bg-zinc-800">
          <TabsTrigger value="script" className="text-xs gap-1">
            <FileText className="w-3 h-3" />
            Script
          </TabsTrigger>
          <TabsTrigger value="voice" className="text-xs gap-1">
            <Mic className="w-3 h-3" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="visuals" className="text-xs gap-1">
            <LayoutGrid className="w-3 h-3" />
            Visuals
          </TabsTrigger>
          <TabsTrigger value="timing" className="text-xs gap-1">
            <Clock className="w-3 h-3" />
            Timing
          </TabsTrigger>
        </TabsList>

        {/* Script Tab */}
        <TabsContent
          value="script"
          className="flex-1 flex flex-col min-h-0 px-3 pb-3 mt-3 gap-3"
        >
          {/* Script textarea */}
          <Textarea
            value={scriptDraft}
            onChange={(e) => {
              setScriptDraft(e.target.value);
              setScriptDirty(true);
            }}
            placeholder="Write the lesson script here…"
            className="flex-1 min-h-0 resize-none text-sm bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 leading-relaxed"
            style={{ WebkitUserSelect: "text", userSelect: "text" }}
          />

          {/* Save / Discard / Clear */}
          <div className="flex gap-2 shrink-0">
            {scriptDirty && (
              <>
                <Button
                  onClick={handleSaveScript}
                  size="sm"
                  className="flex-1 min-w-0 bg-violet-600 hover:bg-violet-700 text-white gap-1.5 min-h-[48px] text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </Button>
                <Button
                  onClick={handleDiscardScript}
                  size="sm"
                  variant="outline"
                  className="flex-1 min-w-0 border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1.5 min-h-[48px] text-xs"
                >
                  Discard
                </Button>
              </>
            )}
            <Button
              onClick={handleClearScript}
              disabled={!scriptDraft}
              size="sm"
              variant="outline"
              className="flex-1 min-w-0 gap-1.5 border-red-900/60 text-red-400 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-40 min-h-[48px] text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          </div>

          {/* ── Quick Edit ── */}
          <div className="shrink-0 rounded-lg border border-zinc-700/60 bg-zinc-900/60 overflow-hidden">
            {/* Header toggle */}
            <button
              type="button"
              onClick={() => setQuickEditOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-violet-400" />
                Quick Edit with AI
              </span>
              {quickEditOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>

            {/* Expandable body */}
            {quickEditOpen && (
              <div className="px-3 pb-3 space-y-2 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-500 pt-2">
                  Type an instruction and press <kbd className="rounded border border-zinc-700 px-1 font-mono">Enter</kbd> or add a <kbd className="rounded border border-zinc-700 px-1 font-mono">,</kbd> to add more. AI applies all at once.
                </p>

                <ChipInput
                  chips={editPrompts}
                  onChange={setEditPrompts}
                  placeholder="e.g. make it more upbeat, shorten by 20%…"
                  disabled={isRewriting}
                />

                {/* Example suggestions */}
                {editPrompts.length === 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Make it shorter",
                      "Add more energy",
                      "Include a call to action",
                      "More conversational tone",
                      "Add a story or example",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setEditPrompts([suggestion])}
                        className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-500 hover:border-violet-500 hover:text-violet-300 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {rewriteError && (
                  <p className="text-xs text-red-400">{rewriteError}</p>
                )}

                <Button
                  type="button"
                  onClick={handleApplyQuickEdit}
                  disabled={isRewriting || editPrompts.length === 0 || !scriptDraft.trim()}
                  size="sm"
                  className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white min-h-[48px] disabled:opacity-40"
                >
                  {isRewriting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rewriting…
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Apply {editPrompts.length > 0 ? `${editPrompts.length} Edit${editPrompts.length !== 1 ? "s" : ""}` : "Edits"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent
          value="voice"
          className="flex-1 overflow-y-auto px-3 pb-3 mt-3"
        >
          <VoiceoverPanel
            key={selectedLesson.id}
            lessonId={selectedLesson.id}
            initialVoiceoverUrl={selectedLesson.voiceoverUrl ?? null}
            onVoiceoverGenerated={(url) =>
              updateLesson(selectedLesson.id, { voiceoverUrl: url, status: "voiced" })
            }
          />
        </TabsContent>

        {/* Visuals Tab */}
        <TabsContent
          value="visuals"
          className="flex-1 overflow-y-auto px-3 pb-3 mt-3"
        >
          <VisualsTab
            key={selectedLesson.id}
            lessonId={selectedLesson.id}
            initialSettings={selectedLesson.visualSettings}
            onSettingsSaved={(vs) =>
              updateLesson(selectedLesson.id, { visualSettings: vs })
            }
          />
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent
          value="timing"
          className="flex-1 flex flex-col px-3 pb-3 mt-3 gap-4"
        >
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-medium text-zinc-400"
              htmlFor="duration-input"
            >
              Duration (seconds)
            </label>
            <div className="flex gap-2">
              <input
                id="duration-input"
                type="number"
                min={0}
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="e.g. 120"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <Button
                onClick={handleSaveDuration}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-800/60 border border-zinc-700/50 p-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Frame Rate</span>
              <span className="text-zinc-300 font-mono">30 fps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Resolution</span>
              <span className="text-zinc-300 font-mono">1920 × 1080</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Format</span>
              <span className="text-zinc-300 font-mono">MP4 / H.264</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
