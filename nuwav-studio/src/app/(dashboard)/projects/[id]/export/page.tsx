"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  FileArchive,
  Presentation,
  Video,
  Download,
  Loader2,
  Inbox,
  History,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────── //

type ExportFormat = "zip" | "pptx" | "mp4";

interface ExportRow {
  id: string;
  format: string;
  status: "pending" | "processing" | "complete" | "failed";
  url: string | null;
  created_at: string;
}

// ─── Format card config ──────────────────────────────────────────────────── //

interface FormatCard {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ElementType;
  badgeLabel: string;
  badgeAmber: boolean;
}

const FORMAT_CARDS: FormatCard[] = [
  {
    format: "zip",
    label: "ZIP Bundle",
    description: "Scripts + metadata bundle",
    icon: FileArchive,
    badgeLabel: "Ready instantly",
    badgeAmber: false,
  },
  {
    format: "pptx",
    label: "PowerPoint",
    description: "PowerPoint slide deck",
    icon: Presentation,
    badgeLabel: "Ready instantly",
    badgeAmber: false,
  },
  {
    format: "mp4",
    label: "MP4 Video",
    description: "Video with voiceover",
    icon: Video,
    badgeLabel: "Requires render",
    badgeAmber: true,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────── //

/** Returns a human-friendly relative time string, e.g. "2 hours ago". */
function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
}

/** Icon component per format string (handles unknown gracefully). */
function FormatIcon({
  format,
  className,
}: {
  format: string;
  className?: string;
}) {
  const map: Record<string, React.ElementType> = {
    zip: FileArchive,
    pptx: Presentation,
    mp4: Video,
    pdf: FileArchive,
  };
  const Icon = map[format] ?? FileArchive;
  return <Icon className={cn("h-4 w-4 shrink-0", className)} />;
}

// ─── Status badge ─────────────────────────────────────────────────────────── //

function StatusBadge({ status }: { status: ExportRow["status"] }) {
  if (status === "complete") {
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Complete
      </Badge>
    );
  }
  if (status === "processing") {
    return (
      <Badge variant="warning" className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Processing
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="flex items-center gap-1">
      <XCircle className="h-3 w-3" />
      Failed
    </Badge>
  );
}

// ─── Confirm inline banner ────────────────────────────────────────────────── //

interface ConfirmBannerProps {
  format: ExportFormat;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmBanner({
  format,
  loading,
  onConfirm,
  onCancel,
}: ConfirmBannerProps) {
  const card = FORMAT_CARDS.find((c) => c.format === format)!;
  return (
    <div className="rounded-lg border border-violet-500/40 bg-violet-500/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
      <p className="text-sm flex-1">
        This will generate a{" "}
        <span className="font-semibold text-violet-400">{card.label}</span>{" "}
        export.{" "}
        {format === "mp4" && (
          <span className="text-amber-400">
            Video rendering may take some time.{" "}
          </span>
        )}
        Continue?
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              Exporting…
            </>
          ) : (
            "Export"
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────── //

export default function ExportPage() {
  const { id } = useParams<{ id: string }>();

  const [exports, setExports] = useState<ExportRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(
    null
  );
  const [pendingFormat, setPendingFormat] = useState<ExportFormat | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch export history ── //
  const fetchExports = useCallback(async () => {
    try {
      const res = await fetch(`/api/export?projectId=${id}`);
      if (res.ok) {
        const data = (await res.json()) as { exports?: ExportRow[] };
        setExports(data.exports ?? []);
      }
    } catch {
      // ignore network errors silently
    } finally {
      setLoadingHistory(false);
    }
  }, [id]);

  // ── Initial fetch ── //
  useEffect(() => {
    void fetchExports();
  }, [fetchExports]);

  // ── Polling: run while any export is "processing" ── //
  useEffect(() => {
    const hasProcessing = exports.some(
      (e) => e.status === "processing" || e.status === "pending"
    );

    if (hasProcessing && !pollRef.current) {
      pollRef.current = setInterval(() => void fetchExports(), 3000);
    } else if (!hasProcessing && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [exports, fetchExports]);

  // ── Trigger export after confirmation ── //
  async function handleConfirmedExport() {
    if (!pendingFormat) return;
    setExporting(true);
    setError(null);

    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, format: pendingFormat }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(
          body.error ?? `Export failed (HTTP ${res.status})`
        );
      }

      const result = (await res.json()) as {
        exportId?: string;
        url?: string;
        status?: string;
      };

      // Refresh list immediately
      await fetchExports();

      // Trigger browser download if a URL came back synchronously
      if (result.url) {
        const a = document.createElement("a");
        a.href = result.url;
        a.download = `export-${pendingFormat}`;
        a.click();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
      setPendingFormat(null);
    }
  }

  // ── Select a format card ── //
  function handleCardSelect(format: ExportFormat) {
    if (exporting) return;
    setSelectedFormat(format);
    setPendingFormat(null);
    setError(null);
  }

  // ── "Export" button click: show confirm banner ── //
  function handleExportClick() {
    if (!selectedFormat || exporting) return;
    setPendingFormat(selectedFormat);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold">Export</h1>
        <p className="text-muted-foreground mt-1">
          Download your project in multiple formats.
        </p>
      </div>

      {/* ── Format cards ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Choose a format
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FORMAT_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedFormat === card.format;
            return (
              <button
                key={card.format}
                type="button"
                onClick={() => handleCardSelect(card.format)}
                disabled={exporting}
                className={cn(
                  "group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150",
                  "hover:border-violet-500/60 hover:bg-violet-500/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                  isSelected
                    ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500"
                    : "border-border bg-card",
                  exporting && "pointer-events-none opacity-60"
                )}
              >
                {/* Icon + badge row */}
                <div className="flex w-full items-center justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isSelected
                        ? "bg-violet-600 text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-violet-600/10 group-hover:text-violet-400"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge
                    className={cn(
                      "text-xs",
                      card.badgeAmber
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    )}
                    variant="outline"
                  >
                    {card.badgeLabel}
                  </Badge>
                </div>

                {/* Text */}
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      isSelected ? "text-violet-300" : "text-foreground"
                    )}
                  >
                    {card.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Export action button (shown when a card is selected and no confirm pending) */}
        {selectedFormat && !pendingFormat && (
          <div className="flex justify-end pt-1">
            <Button
              onClick={handleExportClick}
              disabled={exporting}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Export{" "}
              {FORMAT_CARDS.find((c) => c.format === selectedFormat)?.label}
            </Button>
          </div>
        )}

        {/* Inline confirm banner */}
        {pendingFormat && (
          <ConfirmBanner
            format={pendingFormat}
            loading={exporting}
            onConfirm={handleConfirmedExport}
            onCancel={() => setPendingFormat(null)}
          />
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* ── Export history ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Export History</h2>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : exports.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">No exports yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select a format above and export your project.
              </p>
            </div>
          </div>
        ) : (
          /* ── History table ── */
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Format
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                    Created
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    {/* download column */}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {exports.map((exp) => {
                  const isActive =
                    exp.status === "processing" || exp.status === "pending";
                  return (
                    <tr
                      key={exp.id}
                      className={cn(
                        "transition-colors",
                        isActive && "bg-amber-500/5"
                      )}
                    >
                      {/* Format */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <FormatIcon
                            format={exp.format}
                            className={cn(
                              isActive
                                ? "text-amber-400"
                                : exp.status === "complete"
                                ? "text-violet-400"
                                : exp.status === "failed"
                                ? "text-destructive"
                                : "text-muted-foreground"
                            )}
                          />
                          <span className="font-medium capitalize">
                            {exp.format.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={exp.status} />
                          {isActive && (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          )}
                        </div>
                      </td>

                      {/* Created date */}
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {relativeTime(exp.created_at)}
                      </td>

                      {/* Download */}
                      <td className="px-4 py-3 text-right">
                        {exp.status === "complete" && exp.url ? (
                          <Button
                            asChild
                            size="sm"
                            className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
                          >
                            <a href={exp.url} download>
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                          </Button>
                        ) : isActive ? (
                          <span className="text-xs text-muted-foreground flex items-center justify-end gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Working…
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
