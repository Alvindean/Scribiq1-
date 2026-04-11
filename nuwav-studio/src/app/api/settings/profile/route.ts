import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return Response.json({
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar_url: profile.avatarUrl,
      },
    });
  } catch (err) {
    console.error("[GET /api/settings/profile]", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as {
      name?: string | null;
      avatar_url?: string | null;
    };

    await db
      .update(profiles)
      .set({
        name: body.name ?? null,
        avatarUrl: body.avatar_url ?? null,
      })
      .where(eq(profiles.id, session.user.id));

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/settings/profile]", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
