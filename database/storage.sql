-- Create the public-read, server-write bucket used for cafe photos.
-- Run once in Supabase SQL Editor. Uploads are restricted to the backend's
-- service-role key; this does not add anonymous upload policies.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cafe-images',
  'cafe-images',
  true,
  4194304,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
