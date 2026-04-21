"use client";
import { useState, useEffect, useRef } from "react";
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
  Check,
} from "lucide-react";

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
  const { updateLesson, persistLesson } = useProjectStore();

  const [scriptDraft, setScriptDraft] = useState<string>("");
  const [durationInput, setDurationInput] = useState<string>("");
  const [scriptDirty, setScriptDirty] = useState(false);
  const [scriptSaving, setScriptSaving] = useState(false);
  const [scriptSaved, setScriptSaved] = useState(false);
  const [durationSaving, setDurationSaving] = useState(false);
  const [durationSaved, setDurationSaved] = useState(false);
  const [voiceoverError, setVoiceoverError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (selectedLesson) {
      setScriptDraft(selectedLesson.script ?? "");
      setDurationInput(
        selectedLesson.durationSeconds != null
          ? String(selectedLesson.durationSeconds)
          : ""
      );
      setScriptDirty(false);
      setScriptSaved(false);
      setDurationSaved(false);
      setVoiceoverError(null);
    }
  }, [selectedLesson]);

  if (!selectedLesson) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-sm px-4 text-center">
        Select a lesson to edit its properties.
      </div>
    );
  }

  const handleSaveScript = async () => {
    setScriptSaving(true);
    await persistLesson(selectedLesson.id, { script: scriptDraft });
    setScriptSaving(false);
    setScriptDirty(false);
    setScriptSaved(true);
    setTimeout(() => setScriptSaved(false), 2000);
  };

  const handleDiscardScript = () => {
    setScriptDraft(selectedLesson.script ?? "");
    setScriptDirty(false);
    setScriptSaved(false);
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

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      updateLesson(selectedLesson.id, {
        voiceoverUrl: data.url,
        status: "voiced",
      });
    } catch (err) {
      setVoiceoverError(
        err instanceof Error ? err.message : "Failed to generate voiceover"
      );
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

  const handleSaveDuration = async () => {
    const parsed = parseInt(durationInput, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      setDurationSaving(true);
      await persistLesson(selectedLesson.id, { durationSeconds: parsed });
      setDurationSaving(false);
      setDurationSaved(true);
      setTimeout(() => setDurationSaved(false), 2000);
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
          <Textarea
            value={scriptDraft}
            onChange={(e) => {
              setScriptDraft(e.target.value);
              setScriptDirty(true);
            }}
            placeholder="Write the lesson script here…"
            className="flex-1 min-h-0 resize-none text-sm bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 leading-relaxed"
          />
          {scriptSaved && !scriptDirty && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 shrink-0 justify-end">
              <Check className="w-3.5 h-3.5" />
              Saved
            </div>
          )}
          {scriptDirty && (
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={handleSaveScript}
                disabled={scriptSaving}
                size="sm"
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
              >
                {scriptSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={handleDiscardScript}
                disabled={scriptSaving}
                size="sm"
                variant="outline"
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1.5"
              >
                Discard
              </Button>
            </div>
          )}
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
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Play
                  </>
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
                disabled={durationSaving}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
              >
                {durationSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : durationSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Saved
                  </>
                ) : (
                  "Save"
                )}
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
