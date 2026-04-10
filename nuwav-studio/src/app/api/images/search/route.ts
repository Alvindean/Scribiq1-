import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export interface PixabayImage {
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

export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("per_page") ?? "30", 10)));
  const rawType = searchParams.get("image_type") ?? "photo";
  const imageType = (["photo", "illustration", "vector"] as const).includes(
    rawType as "photo" | "illustration" | "vector"
  )
    ? (rawType as "photo" | "illustration" | "vector")
    : "photo";

  if (!q || q.length < 2) {
    return Response.json(
      { error: "Query must be at least 2 characters", images: [], total: 0 },
      { status: 400 }
    );
  }

  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Pixabay API key not configured", images: [], total: 0, page, hasMore: false },
      { status: 200 }
    );
  }

  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", q);
  url.searchParams.set("image_type", imageType);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("safesearch", "true");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });

  if (!res.ok) {
    return Response.json(
      { error: "Pixabay API request failed", images: [], total: 0, page, hasMore: false },
      { status: 200 }
    );
  }

  const data = await res.json() as {
    totalHits: number;
    total: number;
    hits: Array<{
      id: number;
      previewURL: string;
      webformatURL: string;
      largeImageURL: string;
      pageURL: string;
      user: string;
      tags: string;
      views: number;
      downloads: number;
      likes: number;
      imageWidth: number;
      imageHeight: number;
    }>;
  };

  const images: PixabayImage[] = (data.hits ?? []).map((hit) => ({
    id: hit.id,
    previewUrl: hit.previewURL,
    webUrl: hit.webformatURL,
    largeUrl: hit.largeImageURL,
    pageUrl: hit.pageURL,
    user: hit.user,
    tags: hit.tags
      ? hit.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    views: hit.views,
    downloads: hit.downloads,
    likes: hit.likes,
    width: hit.imageWidth,
    height: hit.imageHeight,
  }));

  const total = data.totalHits ?? 0;
  const hasMore = page * perPage < total;

  return Response.json({ images, total, page, hasMore });
}
