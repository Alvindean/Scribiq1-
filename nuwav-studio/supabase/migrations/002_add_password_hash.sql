-- NOTE: This project uses Neon (not Supabase). Apply these migrations via the Neon console or drizzle-kit.

-- Add password_hash column to users table for Auth.js credentials provider
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
