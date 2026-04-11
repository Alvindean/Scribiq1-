import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateVSLScript } from "@/lib/ai/pipeline";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let projectId: string;
  try {
    const body = (await request.json()) as { projectId: string };
    projectId = body.projectId;
    if (!projectId) throw new Error("Missing projectId");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const script = await generateVSLScript({
      product_name: project.title,
      niche: project.niche ?? "general",
      target_audience: project.targetAudience ?? "general audience",
      pain_points: [],
      benefits: [],
      tone: project.tone ?? "persuasive",
      duration_target: project.durationTarget
        ? project.durationTarget * 60
        : undefined,
    });

    return new Response(JSON.stringify({ script }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
