-- OKYANUS COMMERCE V2 EXTENDED
-- Additive only. Existing protected production tables are untouched.

CREATE TABLE IF NOT EXISTS oky_brands_v1(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 logo_url TEXT,
 description TEXT,
 sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oky_campaigns_v1(
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 description TEXT,
 cta_text TEXT,
 cta_url TEXT,
 start_at TEXT,
 end_at TEXT,
 priority INTEGER NOT NULL DEFAULT 0,
 sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oky_delivery_rules_v1(
 id TEXT PRIMARY KEY,
 region TEXT NOT NULL DEFAULT 'İstanbul',
 district TEXT,
 min_order REAL,
 fee REAL,
 free_threshold REAL,
 cutoff TEXT,
 delivery_days TEXT,
 cold_chain INTEGER NOT NULL DEFAULT 1,
 sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oky_media_assets_v1(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 url TEXT NOT NULL,
 kind TEXT NOT NULL DEFAULT 'product',
 alt_text TEXT,
 tags TEXT,
 sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_oky_brands_active ON oky_brands_v1(active,sort_order,name);
CREATE INDEX IF NOT EXISTS idx_oky_campaigns_active ON oky_campaigns_v1(active,priority,sort_order);
CREATE INDEX IF NOT EXISTS idx_oky_delivery_active ON oky_delivery_rules_v1(active,region,district,sort_order);
CREATE INDEX IF NOT EXISTS idx_oky_media_active ON oky_media_assets_v1(active,kind,sort_order);
