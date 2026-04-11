"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Loader2,
  Heart,
  Download,
  ExternalLink,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface PixabayImage {
  id: number;
  previewUrl: string;
  webUrl: string;
  largeUrl: string;
  pageUrl: string;
  user: string;
  tags: string[];
  views: number;
  downloads: number;
  likes: number;
  width: number;
  height: number;
}

type ImageType = "photo" | "illustration" | "vector";

const TYPE_LABELS: Record<ImageType, string> = {
  photo: "Photos",
  illustration: "Illustrations",
  vector: "Vectors",
};

export function ImageSearch() {
  const [query, setQuery] = useState("");
  const [imageType, setImageType] = useState<ImageType>("photo");
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [missingKey, setMissingKey] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQueryRef = useRef<string>("");

  const fetchImages = useCallback(
    async (q: string, type: ImageType, pg: number, append: boolean) => {
      if (!q || q.length < 2) {
        setImages([]);
        setTotal(0);
        setHasMore(false);
        setError(null);
        setMissingKey(false);
        return;
      }

      setLoading(true);
      if (!append) setError(null);

      try {
        const res = await fetch(
          `/api/images/search?q=${encodeURIComponent(q)}&page=${pg}&per_page=30&image_type=${type}`
        );
        const data = (await res.json()) as {
          images?: PixabayImage[];
          total?: number;
          page?: number;
          hasMore?: boolean;
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Search failed");
        }

        if (data.error === "Pixabay API key not configured") {
          setMissingKey(true);
          setImages([]);
          setTotal(0);
          setHasMore(false);
          return;
        }

        setMissingKey(false);

        if (append) {
          setImages((prev: PixabayImage[]) => [...prev, ...(data.images ?? [])]);
        } else {
          setImages(data.images ?? []);
        }
        setTotal(data.total ?? 0);
        setHasMore(data.hasMore ?? false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        if (!append) {
          setImages([]);
          setTotal(0);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search on query / type change — resets to page 1
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    currentQueryRef.current = trimmed;

    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchImages(trimmed, imageType, 1, false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, imageType]);

  // Load more — triggered when page increments beyond 1
  useEffect(() => {
    if (page === 1) return;
    fetchImages(currentQueryRef.current, imageType, page, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleLoadMore() {
    setPage((p: number) => p + 1);
  }

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search images…"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          className="w-full rounded-lg border bg-background py-2 pl-9 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-500"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as ImageType[]).map((t) => (
          <button
            key={t}
            onClick={() => setImageType(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              imageType === t
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-background text-muted-foreground border-border hover:border-violet-400 hover:text-violet-600"
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Missing API key banner */}
      {missingKey && (
        <div className="flex items-start gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <span className="mt-0.5 shrink-0">⚠</span>
          <span>
            Add <code className="rounded bg-yellow-100 px-1 font-mono text-xs">PIXABAY_API_KEY</code>{" "}
            to your <code className="rounded bg-yellow-100 px-1 font-mono text-xs">.env.local</code>{" "}
            to enable image search.
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Empty state */}
      {!loading && !missingKey && images.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center text-muted-foreground">
          <ImageIcon className="mb-3 h-10 w-10 opacity-30" />
          {query.trim() ? (
            <>
              <p className="font-medium">No results</p>
              <p className="mt-1 text-sm max-w-xs">
                No images found for &ldquo;{query.trim()}&rdquo; &mdash; try different keywords or check your Pixabay API key.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Search for images</p>
              <p className="mt-1 text-sm">
                Try &ldquo;nature&rdquo;, &ldquo;technology&rdquo;, or &ldquo;abstract background&rdquo;
              </p>
            </>
          )}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg bg-muted aspect-video"
            >
              <img
                src={image.webUrl}
                alt={image.tags.join(", ")}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {/* Photographer name */}
                <p className="truncate text-xs font-medium text-white drop-shadow">
                  {image.user}
                </p>
                {/* Stats + external link */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-white/90">
                    <Heart className="h-3 w-3" />
                    {image.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-white/90">
                    <Download className="h-3 w-3" />
                    {image.downloads.toLocaleString()}
                  </span>
                  <a
                    href={image.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto rounded p-0.5 text-white/80 hover:text-white transition-colors"
                    title="View on Pixabay"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleLoadMore}
            className="rounded-lg border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-violet-400 hover:text-violet-600"
          >
            Load more
          </button>
        </div>
      )}

      {/* Loading indicator for load-more */}
      {loading && images.length > 0 && (
        <div className="flex justify-center pt-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
