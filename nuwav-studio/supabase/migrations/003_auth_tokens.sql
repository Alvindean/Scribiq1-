-- NOTE: This project uses Neon (not Supabase). Apply these migrations via the Neon console or drizzle-kit.

-- Migration: 003_auth_tokens
-- Creates tables for password reset and email verification tokens.

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL,
  token       text NOT NULL UNIQUE,
  expires_at  timestamp with time zone NOT NULL,
  used_at     timestamp with time zone,
  created_at  timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL,
  token        text NOT NULL UNIQUE,
  email        text NOT NULL,
  expires_at   timestamp with time zone NOT NULL,
  verified_at  timestamp with time zone,
  created_at   timestamp with time zone DEFAULT now()
);
