"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { useProjectStore } from "@/stores/project-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Save,
  Play,
  Pause,
  LayoutGrid,
  Clock,
  FileText,
  Loader2,
  Wand2,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";

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
    isGenerating,
    setIsGenerating,
    isPlayingVoiceover,
    setIsPlayingVoiceover,
  } = useEditorStore();
  const { updateLesson } = useProjectStore();

  const [scriptDraft, setScriptDraft] = useState<string>("");
  const [durationInput, setDurationInput] = useState<string>("");
  const [scriptDirty, setScriptDirty] = useState(false);
  const [voiceoverError, setVoiceoverError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      setVoiceoverError(null);
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

  const handleGenerateVoiceover = async () => {
    const text = selectedLesson.script;
    if (!text) {
      setVoiceoverError("Write a script first before generating voiceover.");
      return;
    }
    setIsGenerating(true);
    setVoiceoverError(null);
    try {
      const res = await fetch("/api/voiceover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: selectedLesson.id, text }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? `HTTP ${res.status}`);
      updateLesson(selectedLesson.id, { voiceoverUrl: data.url, status: "voiced" });
    } catch (err) {
      setVoiceoverError(err instanceof Error ? err.message : "Failed to generate voiceover");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlayingVoiceover) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlayingVoiceover(!isPlayingVoiceover);
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
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white gap-1.5 min-h-[44px]"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </Button>
                <Button
                  onClick={handleDiscardScript}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1.5 min-h-[44px]"
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
              className="flex-1 gap-1.5 border-red-900/60 text-red-400 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-40 min-h-[44px]"
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
                  className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white min-h-[44px] disabled:opacity-40"
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
          className="flex-1 flex flex-col px-3 pb-3 mt-3 gap-4"
        >
          <Button
            onClick={handleGenerateVoiceover}
            disabled={isGenerating}
            className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Generate Voiceover
              </>
            )}
          </Button>

          {voiceoverError && (
            <p className="text-xs text-red-400 text-center">{voiceoverError}</p>
          )}

          {selectedLesson.voiceoverUrl && (
            <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-4 flex flex-col gap-3">
              <p className="text-xs text-zinc-400 font-medium">Voiceover</p>
              <audio
                ref={audioRef}
                src={selectedLesson.voiceoverUrl}
                onPlay={() => setIsPlayingVoiceover(true)}
                onPause={() => setIsPlayingVoiceover(false)}
                onEnded={() => setIsPlayingVoiceover(false)}
              />
              <Button
                onClick={handleTogglePlay}
                size="sm"
                variant="outline"
                className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              >
                {isPlayingVoiceover ? (
                  <><Pause className="w-3.5 h-3.5" /> Pause</>
                ) : (
                  <><Play className="w-3.5 h-3.5" /> Play</>
                )}
              </Button>
            </div>
          )}

          {!selectedLesson.voiceoverUrl && !voiceoverError && (
            <p className="text-xs text-zinc-600 text-center py-4">
              No voiceover generated yet.
            </p>
          )}
        </TabsContent>

        {/* Visuals Tab */}
        <TabsContent
          value="visuals"
          className="flex-1 flex flex-col px-3 pb-3 mt-3 gap-3"
        >
          <p className="text-xs font-medium text-zinc-400">Slide Previews</p>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="aspect-video rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center"
              >
                <span className="text-xs text-zinc-600">Slide {n}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 text-center py-2">
            Slide editing coming soon.
          </p>
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
