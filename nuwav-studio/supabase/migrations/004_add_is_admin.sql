-- Migration: add is_admin column to users
-- Run this in your Neon console before running the seed:admin script.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;
