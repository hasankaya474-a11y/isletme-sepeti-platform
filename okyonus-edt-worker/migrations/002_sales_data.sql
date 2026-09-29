-- OKYANUS EDT SALES DATA EXTENSIONS v1
-- OPTIONAL extension schema. Do NOT run automatically on production.
-- Production uses the existing DENIZ/ZAMAN D1 schema. Migration 001_sales_mode.sql
-- is the only new migration required by the sales-first visibility layer.
--
-- This file intentionally DOES NOT create or redefine audit_log, users, sessions,
-- inquiries, photo_inquiries, digital_menus or other baseline tables because their
-- production schemas are owned by the preserved DENIZ/ZAMAN workers.

CREATE TABLE IF NOT EXISTS app_features(
  key TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO app_features(key,enabled) VALUES
('PRODUCTS',1),('QUOTE',1),('PHOTO',1),('WHATSAPP',1),('SEO',1),('MEMBERSHIP',1),('DIGITAL_MENU',1),
('COST',0),('COST_RADAR',0),('ACADEMY',0),('CESNI',0);

CREATE TABLE IF NOT EXISTS storefront_sections(
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
