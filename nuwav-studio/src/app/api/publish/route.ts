import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest): Promise<Response> {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let projectId: string;
  let slug: string;
  let isLive: boolean;

  try {
    const body = (await request.json()) as {
      projectId: string;
      slug: string;
      isLive: boolean;
    };
    projectId = body.projectId;
    slug = body.slug;
    isLive = body.isLive ?? false;

    if (!projectId || !slug) throw new Error("Missing required fields");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Verify project access (RLS handles authorization)
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upsert published_pages record
    const { error: upsertError } = await supabase
      .from("published_pages")
      .upsert(
        {
          project_id: projectId,
          user_id: user.id,
          slug,
          is_live: isLive,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "project_id" }
      );

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    // Update project status if going live
    if (isLive) {
      await supabase
        .from("projects")
        .update({ status: "published" })
        .eq("id", projectId);
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/p/${slug}`;

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
