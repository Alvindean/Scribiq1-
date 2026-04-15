import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { publishedPages } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://soniq.app";

  const coursePages = await db
    .select({
      slug: publishedPages.slug,
      updatedAt: publishedPages.updatedAt,
    })
    .from(publishedPages)
    .where(
      and(
        eq(publishedPages.pageType, "course_portal"),
        eq(publishedPages.isLive, true)
      )
    );

  const courseEntries: MetadataRoute.Sitemap = coursePages.map((page) => ({
    url: `${baseUrl}/course/${page.slug}`,
    lastModified: page.updatedAt ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...courseEntries,
  ];
}
