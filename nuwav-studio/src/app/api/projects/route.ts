import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type: "course" | "vsl" | "hybrid";
      title: string;
      niche?: string | null;
      targetAudience?: string | null;
      tone?: string;
      durationTarget?: number | null;
      templateId?: string | null;
    };

    const [profile] = await db
      .select({ orgId: profiles.orgId })
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);

    if (!profile?.orgId) {
      return Response.json({ error: "No organisation found" }, { status: 400 });
    }

    const [project] = await db
      .insert(projects)
      .values({
        orgId: profile.orgId,
        createdBy: session.user.id,
        type: body.type,
        title: body.title,
        niche: body.niche ?? null,
        targetAudience: body.targetAudience ?? null,
        tone: body.tone ?? "professional",
        durationTarget: body.durationTarget ?? null,
        templateId: body.templateId ?? null,
        status: "draft",
      })
      .returning({ id: projects.id });

    if (!project) {
      return Response.json({ error: "Failed to create project" }, { status: 500 });
    }

    return Response.json({ id: project.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/projects]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
