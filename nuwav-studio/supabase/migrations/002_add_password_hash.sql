-- Add password_hash column to users table for Auth.js credentials provider
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
