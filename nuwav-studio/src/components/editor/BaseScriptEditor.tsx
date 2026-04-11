"use client";
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Copy, Check, ClipboardPaste, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { Button } from "@/components/ui/button";

export interface BaseScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
  /** Slot for extra buttons rendered alongside Copy / Paste / Clear */
  extraActions?: React.ReactNode;
  /** Content rendered below the textarea (AI panels, save panels, etc.) */
  children?: React.ReactNode;
}

function countWords(text: string): number {
  return text.trim() === ""
    ? 0
    : text.trim().split(/[\s\u00A0\u200B\u2000-\u200A\u202F\u205F\u3000]+/)
        .length;
}

export function BaseScriptEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  rows,
  className,
  extraActions,
  children,
}: BaseScriptEditorProps) {
  const [copied, setCopied] = useState(false);
  const [pasteError, setPasteError] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastCleared = useRef<string>("");
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCursorRef = useRef<number | null>(null);

  // Clean up the undo timer on unmount
  useEffect(
    () => () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    },
    []
  );

  // Apply pending cursor position after paste (layout-synchronous)
  useLayoutEffect(() => {
    if (pendingCursorRef.current === null) return;
    const el = textareaRef.current;
    if (!el) return;
    el.selectionStart = el.selectionEnd = pendingCursorRef.current;
    el.focus();
    pendingCursorRef.current = null;
  }, [value]);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  const handlePaste = useCallback(async () => {
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
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      const next = value.slice(0, start) + text + value.slice(end);
      pendingCursorRef.current = start + text.length;
      onChange(next);
    } catch {
      // Permission denied — focus textarea so the native context menu appears
      textareaRef.current?.focus();
    }
  }, [value, onChange]);

  const handleClearAll = useCallback(() => {
    if (!value) return;
    lastCleared.current = value;
    onChange("");
    setUndoVisible(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setUndoVisible(false);
      lastCleared.current = "";
    }, 5000);
    textareaRef.current?.focus();
  }, [value, onChange]);

  const handleUndo = useCallback(() => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    onChange(lastCleared.current);
    setUndoVisible(false);
    lastCleared.current = "";
  }, [onChange]);

  const charCount = value.length;
  const wordCount = countWords(value);
  const lineCount =
    value === "" ? 0 : value.split("\n").filter((l) => l.trim() !== "").length;

  return (
    <div className={`flex flex-col gap-3${className ? ` ${className}` : ""}`}>
      {/* Stats row */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-wrap gap-3 text-xs text-muted-foreground shrink-0"
      >
        <span>{charCount} chars</span>
        <span className="text-border">·</span>
        <span>{wordCount} words</span>
        <span className="text-border">·</span>
        <span>{lineCount} lines</span>
      </div>

      {/* Copy / Paste / Clear row */}
      <div className="flex gap-2 shrink-0">
        <Button
          type="button"
          onClick={handleCopy}
          disabled={!value}
          size="sm"
          variant="outline"
          aria-label={copied ? "Content copied to clipboard" : "Copy content"}
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
              Copy
            </>
          )}
        </Button>
        <Button
          type="button"
          onClick={handlePaste}
          disabled={disabled}
          size="sm"
          variant="outline"
          aria-label="Paste from clipboard"
          className="flex-1 gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-95 transition-transform min-h-[44px]"
        >
          <ClipboardPaste className="w-4 h-4" />
          Paste
        </Button>
        <Button
          type="button"
          onClick={handleClearAll}
          disabled={!value || disabled}
          size="sm"
          variant="outline"
          aria-label="Clear all content"
          className="flex-1 gap-2 border-red-900/60 text-red-400 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-40 min-h-[44px]"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
        {extraActions}
      </div>

      {pasteError && (
        <p className="text-xs text-amber-400 shrink-0">
          Paste permission denied — tap inside the editor and use your
          keyboard&apos;s paste option.
        </p>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        aria-label="Script editor"
        className={`w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm font-mono leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent${!rows ? " flex-1 min-h-0 h-full" : ""}`}
        // Mobile: ensure text is selectable and the native copy menu works
        style={{ WebkitUserSelect: "text", userSelect: "text" }}
        spellCheck
      />

      {/* Undo toast */}
      {undoVisible && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-xs text-zinc-300 shrink-0"
        >
          <span>Content cleared.</span>
          <button
            type="button"
            onClick={handleUndo}
            aria-label="Undo clear"
            className="ml-4 font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Undo
          </button>
        </div>
      )}

      {/* Slot for AI panels, save panels, etc. */}
      {children}
    </div>
  );
}
