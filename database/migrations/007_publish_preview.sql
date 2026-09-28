PRAGMA foreign_keys=ON;
CREATE TABLE publish_jobs(id TEXT PRIMARY KEY,resource_type TEXT NOT NULL,resource_id TEXT NOT NULL,publish_at TEXT NOT NULL,unpublish_at TEXT,status TEXT NOT NULL CHECK(status IN('SCHEDULED','COMPLETED','CANCELLED','FAILED')),created_by TEXT NOT NULL,created_at TEXT NOT NULL,completed_at TEXT);
CREATE TABLE preview_tokens(id TEXT PRIMARY KEY,content_id TEXT NOT NULL REFERENCES content_entries(id),user_id TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,expires_at TEXT NOT NULL,created_at TEXT NOT NULL,consumed_at TEXT);
CREATE INDEX idx_publish_due ON publish_jobs(status,publish_at);
CREATE INDEX idx_preview_content ON preview_tokens(content_id,expires_at);
