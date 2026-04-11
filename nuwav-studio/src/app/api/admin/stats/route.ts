import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, organizations, projects } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(): Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as {
    id?: string;
    email?: string | null;
    isAdmin?: boolean;
  };

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin =
    user.isAdmin === true ||
    (adminEmail
      ? user.email?.toLowerCase() === adminEmail.toLowerCase()
      : false);

  if (!isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
  // ── aggregate counts ──────────────────────────────────────────────────────
  const [userCountRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);

  const [orgCountRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(organizations);

  const [projectCountRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projects);

  const [publishedCountRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projects)
    .where(eq(projects.status, "published"));

  // ── recent users (last 10 signups) ────────────────────────────────────────
  // Fetch last 10 users and count their projects
  const recentUsersRaw = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(10);

  // Fetch project counts per user for those users
  const userIds = recentUsersRaw.map((u) => u.id);

  let projectCountsByUser: Record<string, number> = {};
  if (userIds.length > 0) {
    const rows = await db
      .select({
        createdBy: projects.createdBy,
        count: sql<number>`count(*)::int`,
      })
      .from(projects)
      .groupBy(projects.createdBy);

    for (const row of rows) {
      if (row.createdBy) {
        projectCountsByUser[row.createdBy] = row.count;
      }
    }
  }

  // Determine plan per user via their org (owner)
  const orgsByOwner = await db
    .select({
      ownerId: organizations.ownerId,
      plan: organizations.plan,
    })
    .from(organizations);

  const planByOwner: Record<string, string> = {};
  for (const org of orgsByOwner) {
    if (org.ownerId) planByOwner[org.ownerId] = org.plan;
  }

  const recentUsers = recentUsersRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    plan: planByOwner[u.id] ?? "—",
    joinedAt: u.createdAt,
    projectCount: projectCountsByUser[u.id] ?? 0,
  }));

  // ── recent projects (last 10) ─────────────────────────────────────────────
  const recentProjectsRaw = await db
    .select({
      id: projects.id,
      title: projects.title,
      type: projects.type,
      orgId: projects.orgId,
      status: projects.status,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .limit(10);

  // Fetch org names for these projects
  const orgIds = [...new Set(recentProjectsRaw.map((p) => p.orgId))];
  let orgNamesById: Record<string, string> = {};
  if (orgIds.length > 0) {
    const orgRows = await db
      .select({ id: organizations.id, name: organizations.name })
      .from(organizations);
    for (const o of orgRows) {
      orgNamesById[o.id] = o.name;
    }
  }

  const recentProjects = recentProjectsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    org: orgNamesById[p.orgId] ?? p.orgId,
    status: p.status,
    createdAt: p.createdAt,
  }));

    return Response.json({
      userCount: userCountRow?.count ?? 0,
      orgCount: orgCountRow?.count ?? 0,
      projectCount: projectCountRow?.count ?? 0,
      publishedCount: publishedCountRow?.count ?? 0,
      recentUsers,
      recentProjects,
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
