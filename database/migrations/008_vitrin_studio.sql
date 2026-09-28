PRAGMA foreign_keys=ON;
CREATE TABLE pages(id TEXT PRIMARY KEY,page_key TEXT NOT NULL UNIQUE,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','SCHEDULED','PUBLISHED','UNPUBLISHED','ARCHIVED')),seo_json TEXT NOT NULL DEFAULT '{}',version INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE TABLE page_blocks(id TEXT PRIMARY KEY,page_id TEXT NOT NULL REFERENCES pages(id),block_type TEXT NOT NULL,position INTEGER NOT NULL,content_json TEXT NOT NULL,visibility_json TEXT NOT NULL DEFAULT '{}',schedule_json TEXT NOT NULL DEFAULT '{}',created_at TEXT NOT NULL,updated_at TEXT NOT NULL,UNIQUE(page_id,position));
CREATE TABLE media_assets(id TEXT PRIMARY KEY,kind TEXT NOT NULL,file_ref TEXT NOT NULL,alt_text TEXT,desktop_ref TEXT,mobile_ref TEXT,status TEXT NOT NULL DEFAULT 'ACTIVE',created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE INDEX idx_page_blocks_page ON page_blocks(page_id,position);
