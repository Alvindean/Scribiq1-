import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, exports, profiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

type ExportFormat = "mp4" | "pdf" | "pptx" | "scorm" | "zip";

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

  const [projectForGet] = await db.select({ orgId: projects.orgId }).from(projects).where(eq(projects.id, projectId)).limit(1);
  const [profileForGet] = await db.select({ orgId: profiles.orgId }).from(profiles).where(eq(profiles.id, session.user.id)).limit(1);
  if (!projectForGet || !profileForGet || projectForGet.orgId !== profileForGet.orgId) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  const exportList = await db
    .select()
    .from(exports)
    .where(eq(exports.projectId, projectId))
    .orderBy(desc(exports.createdAt));

  const mapped = exportList.map((e) => ({
    id: e.id,
    format: e.format,
    status: e.status,
    url: e.url,
    created_at: e.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  return Response.json({ exports: mapped });
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
    const [project] = await db
      .select({ id: projects.id, orgId: projects.orgId })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [profile] = await db.select({ orgId: profiles.orgId }).from(profiles).where(eq(profiles.id, session.user.id)).limit(1);
    if (!profile || project.orgId !== profile.orgId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const [exportRecord] = await db
      .insert(exports)
      .values({
        projectId,
        format,
        status: "processing",
      })
      .returning({ id: exports.id });

    if (!exportRecord) {
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
