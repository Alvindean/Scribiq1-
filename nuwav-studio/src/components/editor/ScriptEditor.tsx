"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw } from "lucide-react";
import { BaseScriptEditor } from "./BaseScriptEditor";

interface ScriptEditorProps {
  initialScript: string;
  onSave: (script: string) => void;
  disabled?: boolean;
}

const SCENE_MARKER_REGEX = /^\[SCENE[^\]]*\]/;

export function ScriptEditor({
  initialScript,
  onSave,
  disabled = false,
}: ScriptEditorProps) {
  const [script, setScript] = useState<string>(initialScript);
  const [dirty, setDirty] = useState<boolean>(false);

  const handleChange = useCallback(
    (v: string) => {
      setScript(v);
      setDirty(v !== initialScript);
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

  const lines = script.split("\n");
  const sceneLineNumbers = lines.reduce<number[]>((acc, line, idx) => {
    if (SCENE_MARKER_REGEX.test(line.trim())) acc.push(idx + 1);
    return acc;
  }, []);

  // Scene badge rendered alongside the built-in stats via extraActions
  const scenesBadge =
    sceneLineNumbers.length > 0 ? (
      <Badge
        variant="secondary"
        className="text-xs bg-violet-900/50 text-violet-300 border-violet-700 self-center"
      >
        {sceneLineNumbers.length} scene
        {sceneLineNumbers.length !== 1 ? "s" : ""}
      </Badge>
    ) : null;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Unsaved-changes badge lives above the shared editor */}
      {dirty && (
        <div className="flex shrink-0">
          <Badge className="text-xs bg-amber-900/50 text-amber-300 border-amber-700 ml-auto">
            Unsaved changes
          </Badge>
        </div>
      )}

      <BaseScriptEditor
        value={script}
        onChange={handleChange}
        disabled={disabled}
        placeholder={`Write your script here.\nUse [SCENE: Title] markers to denote scene breaks.`}
        className="flex-1 min-h-0"
        extraActions={scenesBadge}
      >
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
      </BaseScriptEditor>
    </div>
  );
}
