PRAGMA foreign_keys=ON;
CREATE TABLE redirects(id TEXT PRIMARY KEY,from_path TEXT NOT NULL UNIQUE,to_path TEXT NOT NULL,status_code INTEGER NOT NULL CHECK(status_code IN(301,302,307,308)),active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL);
ALTER TABLE media_assets ADD COLUMN scan_status TEXT NOT NULL DEFAULT 'PENDING_SCAN';
ALTER TABLE media_assets ADD COLUMN content_hash TEXT;
CREATE INDEX idx_redirect_active ON redirects(from_path,active);
