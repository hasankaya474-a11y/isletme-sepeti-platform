-- OKYANUS EDT SALES-FIRST V1
-- Shared D1 migration. Safe to run repeatedly.
CREATE TABLE IF NOT EXISTS oky_module_flags_v1(
  module_key TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
  visibility TEXT NOT NULL DEFAULT 'HIDDEN' CHECK(visibility IN ('ACTIVE','HIDDEN','INTERNAL','SCHEDULED','ARCHIVED')),
  updated_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO oky_module_flags_v1(module_key,enabled,visibility) VALUES
('PRODUCTS',1,'ACTIVE'),
('QUOTE',1,'ACTIVE'),
('PHOTO',1,'ACTIVE'),
('WHATSAPP',1,'ACTIVE'),
('SEO',1,'ACTIVE'),
('MEMBERSHIP',1,'ACTIVE'),
('DIGITAL_MENU',1,'ACTIVE'),
('COST',0,'HIDDEN'),
('COST_RADAR',0,'HIDDEN'),
('ACADEMY',0,'HIDDEN'),
('CESNI',0,'HIDDEN'),
('EASY_RECIPE',0,'HIDDEN'),
('ABOUT',0,'HIDDEN');

CREATE INDEX IF NOT EXISTS idx_oky_module_flags_visibility
ON oky_module_flags_v1(visibility,enabled);
