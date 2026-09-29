-- Okyanus EDT Commerce V2 product metadata extension
-- Additive only. Does not ALTER protected baseline B2B tables.

CREATE TABLE IF NOT EXISTS oky_product_meta_v1(
  product_id TEXT PRIMARY KEY,
  brand_id TEXT,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_oky_product_meta_brand ON oky_product_meta_v1(brand_id,sort_order);
CREATE INDEX IF NOT EXISTS idx_oky_product_meta_featured ON oky_product_meta_v1(featured,sort_order);
