-- OKYANUS COMMERCE V2
-- Safe additive storefront/admin schema. Existing production tables are not redefined.
CREATE TABLE IF NOT EXISTS oky_storefront_categories_v1(
 id TEXT PRIMARY KEY,parent_id TEXT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,
 image_url TEXT,icon TEXT,description TEXT,sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,seo_title TEXT,seo_description TEXT,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS oky_storefront_banners_v1(
 id TEXT PRIMARY KEY,title TEXT NOT NULL,subtitle TEXT,desktop_image TEXT,mobile_image TEXT,
 cta_text TEXT,cta_url TEXT,start_at TEXT,end_at TEXT,sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,audience TEXT NOT NULL DEFAULT 'ALL',
 device_target TEXT NOT NULL DEFAULT 'ALL',updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS oky_storefront_sections_v1(
 id TEXT PRIMARY KEY,title TEXT NOT NULL,kind TEXT NOT NULL,source TEXT,
 payload_json TEXT NOT NULL DEFAULT '{}',sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS oky_help_articles_v1(
 id TEXT PRIMARY KEY,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,
 category TEXT NOT NULL DEFAULT 'GENEL',body TEXT NOT NULL,
 sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS oky_storefront_settings_v1(
 key TEXT PRIMARY KEY,value TEXT,updated_by TEXT,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_oky_storefront_categories_active ON oky_storefront_categories_v1(active,sort_order);
CREATE INDEX IF NOT EXISTS idx_oky_storefront_banners_active ON oky_storefront_banners_v1(active,sort_order);
CREATE INDEX IF NOT EXISTS idx_oky_storefront_sections_active ON oky_storefront_sections_v1(active,sort_order);
CREATE INDEX IF NOT EXISTS idx_oky_help_articles_active ON oky_help_articles_v1(active,sort_order);
