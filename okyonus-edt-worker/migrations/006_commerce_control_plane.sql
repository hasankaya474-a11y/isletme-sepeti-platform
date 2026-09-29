-- Okyanus EDT Commerce V2 architecture completion
-- Additive only. Baseline B2B tables are not altered.

CREATE TABLE IF NOT EXISTS oky_product_commerce_v1(
  product_id TEXT PRIMARY KEY,
  sku TEXT,
  barcode TEXT,
  subcategory TEXT,
  origin TEXT,
  storage_conditions TEXT,
  cold_chain INTEGER NOT NULL DEFAULT 0,
  min_order_qty REAL NOT NULL DEFAULT 1,
  qty_step REAL NOT NULL DEFAULT 1,
  list_price REAL,
  sale_price REAL,
  new_until TEXT,
  best_seller INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_oky_product_commerce_sku ON oky_product_commerce_v1(sku);
CREATE INDEX IF NOT EXISTS idx_oky_product_commerce_sale ON oky_product_commerce_v1(sale_price);
CREATE INDEX IF NOT EXISTS idx_oky_product_commerce_best ON oky_product_commerce_v1(best_seller,new_until);

CREATE TABLE IF NOT EXISTS oky_seo_links_v1(
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  group_name TEXT NOT NULL DEFAULT 'EDT Rehberi',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_oky_seo_links_active ON oky_seo_links_v1(active,group_name,sort_order);


CREATE TABLE IF NOT EXISTS oky_campaign_rules_v1(
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  campaign_type TEXT NOT NULL DEFAULT 'product_discount',
  target_type TEXT NOT NULL DEFAULT 'PRODUCT',
  target_value TEXT,
  discount_type TEXT NOT NULL DEFAULT 'PERCENT',
  discount_value REAL NOT NULL DEFAULT 0,
  min_cart REAL,
  customer_segment TEXT,
  delivery_zone TEXT,
  combinable INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_oky_campaign_rules_active ON oky_campaign_rules_v1(campaign_id,active,sort_order);

CREATE TABLE IF NOT EXISTS oky_newsletter_subscribers_v1(
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  consent_version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_oky_newsletter_status ON oky_newsletter_subscribers_v1(status,updated_at);
