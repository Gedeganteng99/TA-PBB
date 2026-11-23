-- ============================================================
-- NgopiKampus – Database Schema
-- Jalankan file ini di Supabase SQL Editor
-- Urutan: schema.sql terlebih dahulu, lalu seed.sql
-- ============================================================

-- Enable UUID extension (biasanya sudah aktif di Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- DROP TABLES (untuk re-run / reset)
-- ============================================================
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS crowd_reports CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS promos CASCADE;
DROP TABLE IF EXISTS cafes CASCADE;

-- ============================================================
-- TABLE: cafes
-- ============================================================
CREATE TABLE cafes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  address         TEXT NOT NULL,
  area            TEXT NOT NULL,              -- e.g. 'Tembalang', 'Banyumanik'
  latitude        DOUBLE PRECISION NOT NULL,
  longitude       DOUBLE PRECISION NOT NULL,
  price_min       INTEGER NOT NULL DEFAULT 0, -- dalam rupiah
  price_max       INTEGER NOT NULL DEFAULT 0,
  open_time       TIME NOT NULL,              -- format HH:MM, zona WIB
  close_time      TIME NOT NULL,
  wifi_speed_mbps NUMERIC(5,1) NOT NULL DEFAULT 0,
  outlet_level    SMALLINT NOT NULL DEFAULT 1 CHECK (outlet_level BETWEEN 1 AND 5),
  noise_level     SMALLINT NOT NULL DEFAULT 3 CHECK (noise_level BETWEEN 1 AND 5),
                                              -- 5 = paling tenang
  seat_capacity   INTEGER NOT NULL DEFAULT 20,
  has_ac          BOOLEAN NOT NULL DEFAULT false,
  has_musholla    BOOLEAN NOT NULL DEFAULT false,
  tags            TEXT[] DEFAULT '{}',        -- e.g. ['skripsi','kerja-kelompok']
  image_url       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id    UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL,                   -- anonymous device UUID
  nickname   TEXT NOT NULL,
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  tags       TEXT[] DEFAULT '{}',             -- ['skripsi','kerja-kelompok','santai','mabar']
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_cafe_id ON reviews(cafe_id);

-- ============================================================
-- TABLE: crowd_reports
-- ============================================================
CREATE TABLE crowd_reports (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id    UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL,
  level      TEXT NOT NULL CHECK (level IN ('sepi', 'sedang', 'ramai')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crowd_cafe_id ON crowd_reports(cafe_id);
CREATE INDEX idx_crowd_created_at ON crowd_reports(created_at);

-- ============================================================
-- TABLE: promos
-- ============================================================
CREATE TABLE promos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id      UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  terms        TEXT,
  requires_ktm BOOLEAN NOT NULL DEFAULT false,
  valid_from   DATE NOT NULL,
  valid_until  DATE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promos_cafe_id ON promos(cafe_id);
CREATE INDEX idx_promos_valid_until ON promos(valid_until);

-- ============================================================
-- TABLE: favorites
-- ============================================================
CREATE TABLE favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id    UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cafe_id, user_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE cafes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites     ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- cafes: SELECT untuk semua (anon), INSERT/UPDATE/DELETE dibuka
--        untuk keperluan testing praktikum.
-- CATATAN README: Untuk produksi, hapus policy write dan ganti
-- dengan policy yang mensyaratkan autentikasi admin.
-- ----------------------------------------------------------------
CREATE POLICY "cafes_select" ON cafes FOR SELECT USING (true);
CREATE POLICY "cafes_insert" ON cafes FOR INSERT WITH CHECK (true);
CREATE POLICY "cafes_update" ON cafes FOR UPDATE USING (true);
CREATE POLICY "cafes_delete" ON cafes FOR DELETE USING (true);

-- ----------------------------------------------------------------
-- reviews: SELECT semua, INSERT/DELETE oleh siapapun (user_id anonim)
-- ----------------------------------------------------------------
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE USING (true);

-- ----------------------------------------------------------------
-- crowd_reports: SELECT & INSERT untuk semua
-- ----------------------------------------------------------------
CREATE POLICY "crowd_select" ON crowd_reports FOR SELECT USING (true);
CREATE POLICY "crowd_insert" ON crowd_reports FOR INSERT WITH CHECK (true);

-- ----------------------------------------------------------------
-- promos: SELECT semua, write dibuka untuk testing
-- ----------------------------------------------------------------
CREATE POLICY "promos_select" ON promos FOR SELECT USING (true);
CREATE POLICY "promos_insert" ON promos FOR INSERT WITH CHECK (true);
CREATE POLICY "promos_update" ON promos FOR UPDATE USING (true);
CREATE POLICY "promos_delete" ON promos FOR DELETE USING (true);

-- ----------------------------------------------------------------
-- favorites: SELECT & INSERT & DELETE untuk semua
-- ----------------------------------------------------------------
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (true);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (true);

-- ============================================================
-- SCHEMA SELESAI
-- Lanjutkan dengan seed.sql
-- ============================================================
