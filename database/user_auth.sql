-- Safe, additive migration for registered user accounts.
-- Run once in Supabase SQL Editor after the existing schema.sql.
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 80),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pengguna' CHECK (role = 'pengguna'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_app_users_email_lower ON app_users (LOWER(email));
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
-- Intentionally no anon/authenticated policies. Backend access uses the
-- server-only Supabase service role key, which bypasses RLS.
