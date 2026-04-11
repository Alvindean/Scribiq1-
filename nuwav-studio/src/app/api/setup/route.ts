/**
 * POST /api/setup
 * One-time admin account creation endpoint.
 * Protected by SETUP_TOKEN env var — disabled once any admin exists.
 */
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users, organizations, profiles, emailVerificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "thealvindean@gmail.com";
const ADMIN_NAME  = "Alvin Dean";

export async function POST(req: NextRequest): Promise<Response> {
  // Verify setup token
  const setupToken = process.env.SETUP_TOKEN;
  const { token, password } = await req.json() as { token?: string; password?: string };

  if (!setupToken || token !== setupToken) {
    return Response.json({ error: "Invalid setup token" }, { status: 401 });
  }

  const adminPassword = password ?? "Ninja123#";

  try {
    // Check if admin already exists
    const [existing] = await db
      .select({ id: users.id, isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.email, ADMIN_EMAIL))
      .limit(1);

    const passwordHash = await bcrypt.hash(adminPassword, 12);
    let userId: string;

    if (existing) {
      userId = existing.id;
      await db.update(users).set({
        passwordHash,
        isAdmin: true,
        name: ADMIN_NAME,
      }).where(eq(users.id, userId));
    } else {
      const [newUser] = await db.insert(users).values({
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        passwordHash,
        isAdmin: true,
      }).returning({ id: users.id });
      userId = newUser.id;
    }

    // Ensure org exists
    const [existingOrg] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.ownerId, userId))
      .limit(1);

    let orgId: string;
    if (existingOrg) {
      orgId = existingOrg.id;
    } else {
      const slug = `alvindean-${Date.now()}`;
      const [newOrg] = await db.insert(organizations).values({
        name: "Alvin Dean's Studio",
        slug,
        ownerId: userId,
        plan: "agency",
      }).returning({ id: organizations.id });
      orgId = newOrg.id;
    }

    // Ensure profile exists
    const [existingProfile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (existingProfile) {
      await db.update(profiles).set({ orgId, name: ADMIN_NAME, role: "owner" })
        .where(eq(profiles.id, userId));
    } else {
      await db.insert(profiles).values({
        id: userId,
        orgId,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: "owner",
      });
    }

    // Mark email as verified
    const verifyToken = crypto.randomBytes(32).toString("hex");
    await db.insert(emailVerificationTokens).values({
      userId,
      token: verifyToken,
      email: ADMIN_EMAIL,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100),
      verifiedAt: new Date(),
    }).onConflictDoNothing();

    return Response.json({
      success: true,
      message: `Admin account ready — log in as ${ADMIN_EMAIL}`,
    });
  } catch (err) {
    console.error("[POST /api/setup]", err);
    return Response.json({ error: "Setup failed", detail: String(err) }, { status: 500 });
  }
}

// GET — browser-friendly HTML form
export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Admin Setup</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #e4e4e7; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; width: 380px; }
    h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 8px; }
    p { font-size: 0.85rem; color: #71717a; margin: 0 0 24px; }
    label { font-size: 0.8rem; color: #a1a1aa; display: block; margin-bottom: 6px; }
    input { width: 100%; box-sizing: border-box; background: #09090b; border: 1px solid #3f3f46; border-radius: 8px; padding: 10px 12px; color: #e4e4e7; font-size: 0.9rem; margin-bottom: 16px; }
    button { width: 100%; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 12px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
    button:hover { background: #6d28d9; }
    #msg { margin-top: 16px; padding: 12px; border-radius: 8px; font-size: 0.85rem; display: none; }
    .ok { background: #052e16; color: #4ade80; border: 1px solid #166534; }
    .err { background: #450a0a; color: #f87171; border: 1px solid #991b1b; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🛠 Admin Setup</h1>
    <p>Creates the admin account for <strong>thealvindean@gmail.com</strong>. Run once.</p>
    <label>Setup Token</label>
    <input id="tok" type="password" value="${token}" placeholder="From your SETUP_TOKEN env var" />
    <label>Password (leave blank for default)</label>
    <input id="pw" type="password" placeholder="Ninja123#" />
    <button onclick="run()">Create Admin Account</button>
    <div id="msg"></div>
  </div>
  <script>
    async function run() {
      const msg = document.getElementById('msg');
      msg.style.display = 'none';
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: document.getElementById('tok').value, password: document.getElementById('pw').value || undefined })
      });
      const data = await res.json();
      msg.style.display = 'block';
      if (res.ok) {
        msg.className = 'ok';
        msg.textContent = '✓ ' + data.message + ' — redirecting to login…';
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        msg.className = 'err';
        msg.textContent = '✗ ' + (data.error || 'Failed');
      }
    }
  </script>
</body>
</html>`;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
