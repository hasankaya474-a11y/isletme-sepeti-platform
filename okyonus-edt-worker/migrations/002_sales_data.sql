CREATE TABLE IF NOT EXISTS app_features(key TEXT PRIMARY KEY,enabled INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT (datetime('now')));
INSERT OR IGNORE INTO app_features(key,enabled) VALUES
('PRODUCTS',1),('QUOTE',1),('PHOTO',1),('WHATSAPP',1),('SEO',1),('MEMBERSHIP',1),('DIGITAL_MENU',1),
('COST',0),('COST_RADAR',0),('ACADEMY',0),('CESNI',0);

CREATE TABLE IF NOT EXISTS contact_messages(id TEXT PRIMARY KEY,request_no TEXT NOT NULL UNIQUE,name TEXT NOT NULL,phone TEXT,email TEXT NOT NULL,subject TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'NEW',notification_state TEXT NOT NULL DEFAULT 'PENDING',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS storefront_sections(id TEXT PRIMARY KEY,title TEXT NOT NULL,kind TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,payload_json TEXT NOT NULL DEFAULT '{}',updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS digital_menu_profiles(id TEXT PRIMARY KEY,business_id TEXT,name TEXT NOT NULL,theme TEXT NOT NULL,template TEXT NOT NULL,payload_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'DRAFT',published_at TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS audit_log(id TEXT PRIMARY KEY,actor TEXT,action TEXT NOT NULL,entity_type TEXT,entity_id TEXT,detail_json TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')));