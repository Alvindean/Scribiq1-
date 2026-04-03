import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, publishedPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return new Response(JSON.stringify({ error: "Missing projectId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [page] = await db
    .select()
    .from(publishedPages)
    .where(eq(publishedPages.projectId, projectId))
    .limit(1);

  if (!page) {
    return Response.json({ page: null });
  }

  return Response.json({
    page: {
      id: page.id,
      slug: page.slug,
      is_live: page.isLive,
      updated_at: page.updatedAt?.toISOString() ?? new Date().toISOString(),
    },
  });
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
  let slug: string;
  let isLive: boolean;
  let action: string;

  try {
    const body = (await request.json()) as {
      projectId: string;
      slug: string;
      is_live?: boolean;
      action?: string;
    };
    projectId = body.projectId;
    slug = body.slug;
    isLive = body.is_live ?? false;
    action = body.action ?? "save_slug";

    if (!projectId || !slug) throw new Error("Missing required fields");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if page already exists
    const [existing] = await db
      .select({ id: publishedPages.id })
      .from(publishedPages)
      .where(eq(publishedPages.projectId, projectId))
      .limit(1);

    if (existing) {
      await db
        .update(publishedPages)
        .set({
          slug,
          isLive: action === "toggle_live" ? isLive : undefined,
          updatedAt: new Date(),
        })
        .where(eq(publishedPages.projectId, projectId));
    } else {
      await db.insert(publishedPages).values({
        projectId,
        slug,
        pageType: "course_portal",
        isLive: action === "toggle_live" ? isLive : false,
      });
    }

    // Update project status if going live
    if (action === "toggle_live" && isLive) {
      await db
        .update(projects)
        .set({ status: "published" })
        .where(eq(projects.id, projectId));
    }

    const pageUrl = `${process.env.NEXTAUTH_URL ?? ""}/p/${slug}`;

    return new Response(JSON.stringify({ url: pageUrl }), {
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
