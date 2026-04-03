"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database";

type PublishedPage =
  Database["public"]["Tables"]["published_pages"]["Row"];

export default function PublishPage() {
  const { id } = useParams<{ id: string }>();

  const [page, setPage] = useState<PublishedPage | null>(null);
  const [slug, setSlug] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("published_pages")
        .select("*")
        .eq("project_id", id)
        .eq("page_type", "course_portal")
        .maybeSingle();

      if (data) {
        setPage(data);
        setSlug(data.slug);
        setIsLive(data.is_live);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const previewUrl = slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}`
    : null;

  async function handleSaveSlug() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, slug, action: "save_slug" }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to save slug");
      }
      setSuccess("Slug saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish() {
    setPublishing(true);
    setError(null);
    setSuccess(null);
    try {
      const newState = !isLive;
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          slug,
          is_live: newState,
          action: "toggle_live",
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to update publish state");
      }
      setIsLive(newState);
      setSuccess(newState ? "Project is now live!" : "Project has been unpublished.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPublishing(false);
    }
  }

  async function handleCopyLink() {
    if (!previewUrl) return;
    await navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Publish</h1>
        <p className="text-muted-foreground mt-1">
          Configure your public page settings and go live.
        </p>
      </div>

      {/* Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Status</CardTitle>
            <Badge variant={isLive ? "default" : "outline"}>
              {isLive ? "Live" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isLive
              ? "Your project is publicly accessible."
              : "Your project is not yet published. Toggle to make it live."}
          </p>
          {page && (
            <p className="text-xs text-muted-foreground mt-2">
              Last updated:{" "}
              {new Date(page.updated_at).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Slug settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Custom Slug</CardTitle>
          <CardDescription>
            Customize the URL path for your public page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <div className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground shrink-0">
                /p/
              </div>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="your-project-slug"
                className="rounded-l-none"
              />
            </div>
          </div>
          <Button onClick={handleSaveSlug} disabled={saving || !slug.trim()}>
            {saving ? "Saving…" : "Save Slug"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview link */}
      {slug && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input value={previewUrl ?? ""} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={handleCopyLink} className="shrink-0">
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline underline-offset-2"
              >
                Open preview
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-primary/10 px-4 py-2 text-sm text-primary">
          {success}
        </p>
      )}

      {/* Publish / Unpublish */}
      <Button
        size="lg"
        className="w-full"
        variant={isLive ? "destructive" : "default"}
        onClick={handleTogglePublish}
        disabled={publishing || !slug.trim()}
      >
        {publishing
          ? isLive
            ? "Unpublishing…"
            : "Publishing…"
          : isLive
          ? "Unpublish"
          : "Publish"}
      </Button>
    </div>
  );
}
