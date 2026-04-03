import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ExportFormat = "mp4" | "pdf" | "pptx" | "scorm" | "zip";

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
  let format: ExportFormat;

  try {
    const body = (await request.json()) as {
      projectId: string;
      format: ExportFormat;
    };
    projectId = body.projectId;
    format = body.format;

    if (!projectId || !format) throw new Error("Missing required fields");

    const validFormats: ExportFormat[] = ["mp4", "pdf", "pptx", "scorm", "zip"];
    if (!validFormats.includes(format)) {
      throw new Error(`Invalid format. Must be one of: ${validFormats.join(", ")}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request body";
    return new Response(JSON.stringify({ error: message }), {
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

    // Create exports record
    const { data: exportRecord, error: exportError } = await supabase
      .from("exports")
      .insert({
        project_id: projectId,
        format,
        status: "processing",
      })
      .select("id")
      .single();

    if (exportError || !exportRecord) {
      throw new Error("Failed to create export record");
    }

    return new Response(JSON.stringify({ exportId: exportRecord.id }), {
      status: 202,
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
