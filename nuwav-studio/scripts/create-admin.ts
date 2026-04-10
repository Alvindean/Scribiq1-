/**
 * One-time script to seed the admin user account.
 *
 * Prerequisites:
 *   1. Run migration 004_add_is_admin.sql in your Neon console.
 *   2. Set DATABASE_URL (and optionally ADMIN_EMAIL / ADMIN_PASSWORD) in .env.local
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourPass1! npx tsx scripts/create-admin.ts
 *
 * If ADMIN_EMAIL / ADMIN_PASSWORD are not provided the script uses the
 * values hard-coded in DEFAULT_EMAIL / DEFAULT_PASSWORD below.
 * Change those or always pass env vars — never commit real credentials.
 */

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ── Defaults (override via env vars) ─────────────────────────────────────────
const DEFAULT_EMAIL    = "thealvindean@gmail.com";
const DEFAULT_PASSWORD = "Ninja123#";
const DEFAULT_NAME     = "Alvin Dean";
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_EMAIL    = (process.env.ADMIN_EMAIL    ?? DEFAULT_EMAIL).trim().toLowerCase();
const ADMIN_PASSWORD =  process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
const ADMIN_NAME     =  process.env.ADMIN_NAME     ?? DEFAULT_NAME;

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log(`\nSeeding admin user: ${ADMIN_EMAIL}\n`);

  // 1. Check whether user already exists
  const existing = await sql`
    SELECT id, is_admin FROM users WHERE email = ${ADMIN_EMAIL} LIMIT 1
  `;

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  let userId: string;

  if (existing.length > 0) {
    userId = existing[0].id as string;
    // Update password + ensure admin flag
    await sql`
      UPDATE users
      SET password_hash = ${passwordHash},
          is_admin      = TRUE,
          name          = ${ADMIN_NAME}
      WHERE id = ${userId}
    `;
    console.log(`✓ Updated existing user ${userId} — password reset, is_admin = true`);
  } else {
    // Insert new user
    const [newUser] = await sql`
      INSERT INTO users (email, name, password_hash, is_admin)
      VALUES (${ADMIN_EMAIL}, ${ADMIN_NAME}, ${passwordHash}, TRUE)
      RETURNING id
    `;
    userId = newUser.id as string;
    console.log(`✓ Created user ${userId}`);
  }

  // 2. Ensure an organisation exists for this user
  const existingOrg = await sql`
    SELECT id FROM organizations WHERE owner_id = ${userId} LIMIT 1
  `;

  let orgId: string;

  if (existingOrg.length > 0) {
    orgId = existingOrg[0].id as string;
    console.log(`✓ Organisation already exists: ${orgId}`);
  } else {
    const emailUsername = ADMIN_EMAIL.split("@")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const orgSlug = `${emailUsername}-${Date.now()}`;

    const [newOrg] = await sql`
      INSERT INTO organizations (name, slug, owner_id, plan)
      VALUES (${`${ADMIN_NAME}'s Organization`}, ${orgSlug}, ${userId}, 'agency')
      RETURNING id
    `;
    orgId = newOrg.id as string;
    console.log(`✓ Created organisation ${orgId} (slug: ${orgSlug})`);
  }

  // 3. Ensure a profile exists
  const existingProfile = await sql`
    SELECT id FROM profiles WHERE id = ${userId} LIMIT 1
  `;

  if (existingProfile.length > 0) {
    await sql`
      UPDATE profiles
      SET org_id = ${orgId},
          name   = ${ADMIN_NAME},
          role   = 'owner'
      WHERE id = ${userId}
    `;
    console.log(`✓ Updated profile`);
  } else {
    await sql`
      INSERT INTO profiles (id, org_id, email, name, role)
      VALUES (${userId}, ${orgId}, ${ADMIN_EMAIL}, ${ADMIN_NAME}, 'owner')
    `;
    console.log(`✓ Created profile`);
  }

  // 4. Mark email as verified (admin doesn't need to verify)
  const verifyToken = crypto.randomBytes(32).toString("hex");
  await sql`
    INSERT INTO email_verification_tokens (user_id, token, email, expires_at, verified_at)
    VALUES (
      ${userId},
      ${verifyToken},
      ${ADMIN_EMAIL},
      NOW() + INTERVAL '100 years',
      NOW()
    )
    ON CONFLICT DO NOTHING
  `;
  console.log(`✓ Email marked as verified`);

  console.log(`\n✅ Done — you can now log in as ${ADMIN_EMAIL}\n`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
