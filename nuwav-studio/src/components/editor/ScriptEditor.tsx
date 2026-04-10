"use client";
import { useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Copy, Check, ClipboardPaste } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

interface ScriptEditorProps {
  initialScript: string;
  onSave: (script: string) => void;
  disabled?: boolean;
}

const SCENE_MARKER_REGEX = /^\[SCENE[^\]]*\]/;

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function ScriptEditor({
  initialScript,
  onSave,
  disabled = false,
}: ScriptEditorProps) {
  const [script, setScript] = useState<string>(initialScript);
  const [dirty, setDirty] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [pasteError, setPasteError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setScript(e.target.value);
      setDirty(e.target.value !== initialScript);
    },
    [initialScript]
  );

  const handleSave = () => {
    onSave(script);
    setDirty(false);
  };

  const handleDiscard = () => {
    setScript(initialScript);
    setDirty(false);
  };

  async function handleCopy() {
    const ok = await copyToClipboard(script);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handlePaste() {
    // Read from clipboard and append/replace at cursor
    if (!navigator.clipboard?.readText) {
      // Fallback: focus the textarea so the native paste menu appears on mobile
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
      const start = el.selectionStart ?? script.length;
      const end = el.selectionEnd ?? script.length;
      const next = script.slice(0, start) + text + script.slice(end);
      setScript(next);
      setDirty(next !== initialScript);
      // Restore cursor after inserted text
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + text.length;
        el.focus();
      });
    } catch {
      // Permission denied — focus textarea so the native context menu appears
      textareaRef.current?.focus();
    }
  }

  const charCount = script.length;
  const wordCount = countWords(script);

  const lines = script.split("\n");
  const sceneLineNumbers = lines.reduce<number[]>((acc, line, idx) => {
    if (SCENE_MARKER_REGEX.test(line.trim())) acc.push(idx + 1);
    return acc;
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Stats row */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <Badge
          variant="secondary"
          className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700"
        >
          {charCount} chars
        </Badge>
        <Badge
          variant="secondary"
          className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700"
        >
          {wordCount} words
        </Badge>
        {sceneLineNumbers.length > 0 && (
          <Badge
            variant="secondary"
            className="text-xs bg-violet-900/50 text-violet-300 border-violet-700"
          >
            {sceneLineNumbers.length} scene
            {sceneLineNumbers.length !== 1 ? "s" : ""}
          </Badge>
        )}
        {dirty && (
          <Badge className="text-xs bg-amber-900/50 text-amber-300 border-amber-700 ml-auto">
            Unsaved changes
          </Badge>
        )}
      </div>

      {/* Copy / Paste row — large touch targets for mobile */}
      <div className="flex gap-2 shrink-0">
        <Button
          type="button"
          onClick={handleCopy}
          disabled={!script}
          size="sm"
          variant="outline"
          className="flex-1 gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-95 transition-transform min-h-[44px]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Script
            </>
          )}
        </Button>
        <Button
          type="button"
          onClick={handlePaste}
          disabled={disabled}
          size="sm"
          variant="outline"
          className="flex-1 gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-95 transition-transform min-h-[44px]"
        >
          <ClipboardPaste className="w-4 h-4" />
          Paste
        </Button>
      </div>

      {pasteError && (
        <p className="text-xs text-amber-400 shrink-0">
          Paste permission denied — tap inside the editor and use your keyboard&apos;s paste option.
        </p>
      )}

      {/* Scene line hint */}
      {sceneLineNumbers.length > 0 && (
        <p className="text-xs text-zinc-600 shrink-0">
          Scene markers on lines:{" "}
          <span className="text-violet-400 font-mono">
            {sceneLineNumbers.slice(0, 10).join(", ")}
            {sceneLineNumbers.length > 10 ? "…" : ""}
          </span>
        </p>
      )}

      {/* Textarea */}
      <div className="relative flex-1 min-h-0">
        <Textarea
          ref={textareaRef}
          value={script}
          onChange={handleChange}
          disabled={disabled}
          placeholder={`Write your script here.\nUse [SCENE: Title] markers to denote scene breaks.`}
          className="h-full min-h-0 resize-none text-sm font-mono bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-700 leading-relaxed focus:ring-1 focus:ring-violet-500"
          spellCheck
          // Mobile: ensure text is selectable and the native copy menu works
          style={{ WebkitUserSelect: "text", userSelect: "text" }}
        />
      </div>

      {/* Save / Discard row */}
      <div className="flex gap-2 shrink-0">
        <Button
          onClick={handleSave}
          disabled={!dirty || disabled}
          size="sm"
          className="flex-1 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 min-h-[44px]"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </Button>
        <Button
          onClick={handleDiscard}
          disabled={!dirty || disabled}
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 min-h-[44px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Discard
        </Button>
      </div>
    </div>
  );
}
