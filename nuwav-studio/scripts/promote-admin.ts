/**
 * Promote any existing user to admin with agency plan.
 *
 * Usage:
 *   TARGET_EMAIL=eric@warkershall.com npx tsx scripts/promote-admin.ts
 */

import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const TARGET_EMAIL = (process.env.TARGET_EMAIL ?? "").trim().toLowerCase();

if (!TARGET_EMAIL) {
  console.error("ERROR: TARGET_EMAIL is not set.");
  console.error("  Usage: TARGET_EMAIL=you@example.com npx tsx scripts/promote-admin.ts");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log(`\nPromoting ${TARGET_EMAIL} to admin...\n`);

  const existing = await sql`
    SELECT id, email, is_admin FROM users WHERE email = ${TARGET_EMAIL} LIMIT 1
  `;

  if (existing.length === 0) {
    console.error(`ERROR: No user found with email ${TARGET_EMAIL}`);
    process.exit(1);
  }

  const userId = existing[0].id as string;

  await sql`
    UPDATE users
    SET is_admin = TRUE
    WHERE id = ${userId}
  `;
  console.log(`✓ is_admin = TRUE set on user ${userId}`);

  const org = await sql`
    SELECT id FROM organizations WHERE owner_id = ${userId} LIMIT 1
  `;

  if (org.length > 0) {
    await sql`
      UPDATE organizations
      SET plan = 'agency'
      WHERE id = ${org[0].id}
    `;
    console.log(`✓ org plan → agency`);
  } else {
    const emailUsername = TARGET_EMAIL.split("@")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const orgSlug = `${emailUsername}-${Date.now()}`;
    await sql`
      INSERT INTO organizations (name, slug, owner_id, plan)
      VALUES (${`${TARGET_EMAIL}'s Organization`}, ${orgSlug}, ${userId}, 'agency')
    `;
    console.log(`✓ org created with agency plan`);
  }

  console.log(`\n✅ Done — ${TARGET_EMAIL} is now an admin with agency plan.\n`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
