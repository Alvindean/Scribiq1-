import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, publishedPages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SalesPageContent {
  headline?: string;
  subheadline?: string;
  hero_cta?: string;
  benefits_section?: {
    heading: string;
    items: Array<{ icon: string; title: string; description: string }>;
  };
  offer_section?: {
    heading: string;
    items: Array<{ title: string; value: string }>;
    total_value: string;
    price: string;
    cta: string;
  };
  guarantee?: { heading: string; body: string };
  faq?: Array<{ question: string; answer: string }>;
  vsl_video_url?: string;
  checkout_slug?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let projectId: string;
  let salesPage: SalesPageContent;

  try {
    const body = (await request.json()) as {
      projectId: string;
      script?: string;
      salesPage: SalesPageContent;
    };
    projectId = body.projectId;
    salesPage = body.salesPage;
    if (!projectId) throw new Error("Missing projectId");
    if (!salesPage) throw new Error("Missing salesPage");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const [project] = await db
      .select({ id: projects.id, title: projects.title })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check for existing VSL sales page
    const [existing] = await db
      .select({ id: publishedPages.id, slug: publishedPages.slug })
      .from(publishedPages)
      .where(
        and(
          eq(publishedPages.projectId, projectId),
          eq(publishedPages.pageType, "sales")
        )
      )
      .limit(1);

    let slug: string;

    if (existing) {
      slug = existing.slug;
      await db
        .update(publishedPages)
        .set({
          content: salesPage as Record<string, unknown>,
          isLive: true,
          updatedAt: new Date(),
        })
        .where(eq(publishedPages.id, existing.id));
    } else {
      slug = slugify(project.title) || `vsl-${projectId.slice(0, 8)}`;
      await db.insert(publishedPages).values({
        projectId,
        slug,
        pageType: "sales",
        content: salesPage as Record<string, unknown>,
        isLive: true,
      });
    }

    // Mark project as published
    await db
      .update(projects)
      .set({ status: "published", updatedAt: new Date() })
      .where(eq(projects.id, projectId));

    const url = `/vsl/${slug}`;
    return new Response(JSON.stringify({ slug, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
