"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ExportFormat = "mp4" | "pdf" | "pptx" | "zip";

interface ExportRow {
  id: string;
  format: string;
  status: "pending" | "processing" | "complete" | "failed";
  url: string | null;
  created_at: string;
}

type ExportStatus = ExportRow["status"];

interface FormatOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    format: "mp4",
    label: "MP4 Video",
    description: "Export all rendered lessons as a single MP4 video file.",
    icon: "🎬",
  },
  {
    format: "pdf",
    label: "PDF Slides",
    description: "Download all lesson slides as a shareable PDF document.",
    icon: "📄",
  },
  {
    format: "pptx",
    label: "PowerPoint",
    description: "Export slides in PPTX format for editing in PowerPoint.",
    icon: "📊",
  },
  {
    format: "zip",
    label: "ZIP Package",
    description: "Download all assets — videos, slides, and scripts — in one zip.",
    icon: "📦",
  },
];

function exportStatusVariant(
  status: ExportStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "complete":
      return "default";
    case "processing":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

export default function ExportPage() {
  const { id } = useParams<{ id: string }>();

  const [exports, setExports] = useState<ExportRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchExports = async () => {
    try {
      const res = await fetch(`/api/export?projectId=${id}`);
      if (res.ok) {
        const data = (await res.json()) as { exports?: ExportRow[] };
        setExports(data.exports ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, [id]);

  async function handleExport(format: ExportFormat) {
    setExporting(format);
    setError(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, format }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `Export failed (HTTP ${res.status})`);
      }

      const result = (await res.json()) as { exportId?: string; url?: string };

      // Refresh export history
      await fetchExports();

      // If a download URL was returned immediately, trigger download
      if (result.url) {
        const a = document.createElement("a");
        a.href = result.url;
        a.download = `export-${format}`;
        a.click();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Export</h1>
        <p className="text-muted-foreground mt-1">
          Download your project in multiple formats.
        </p>
      </div>

      {/* Export options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FORMAT_OPTIONS.map((opt) => (
          <Card key={opt.format}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{opt.icon}</span>
                <div>
                  <CardTitle className="text-base">{opt.label}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>{opt.description}</CardDescription>
              <Button
                size="sm"
                onClick={() => handleExport(opt.format)}
                disabled={exporting !== null}
                className="w-full"
              >
                {exporting === opt.format ? "Exporting…" : `Export ${opt.label}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Export history */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Export History</h2>
        {loadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : exports.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No exports yet. Start an export above.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <ul className="divide-y">
                {exports.map((exp) => (
                  <li
                    key={exp.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg uppercase font-bold text-muted-foreground">
                        {exp.format}
                      </span>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {exp.format} export
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(exp.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={exportStatusVariant(exp.status)}
                        className="capitalize text-xs"
                      >
                        {exp.status}
                      </Badge>
                      {exp.status === "complete" && exp.url && (
                        <Button asChild variant="outline" size="sm">
                          <a href={exp.url} download>
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
