PRAGMA foreign_keys=ON;

CREATE TABLE metric_definitions(
 id TEXT PRIMARY KEY,
 metric_key TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL,
 description TEXT NOT NULL,
 unit TEXT NOT NULL,
 source_type TEXT NOT NULL,
 source_ref TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 version INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE report_definitions(
 id TEXT PRIMARY KEY,
 report_key TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL,
 metric_keys_json TEXT NOT NULL DEFAULT '[]',
 allowed_filters_json TEXT NOT NULL DEFAULT '[]',
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 version INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE report_export_jobs(
 id TEXT PRIMARY KEY,
 report_definition_id TEXT NOT NULL REFERENCES report_definitions(id),
 requested_by TEXT NOT NULL,
 organization_id TEXT,
 format TEXT NOT NULL CHECK(format IN('PDF','XLSX')),
 filters_json TEXT NOT NULL DEFAULT '{}',
 status TEXT NOT NULL CHECK(status IN('QUEUED','RUNNING','COMPLETED','FAILED','CANCELLED')),
 artifact_ref TEXT,
 error_code TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE INDEX idx_report_jobs_owner ON report_export_jobs(requested_by,status,created_at);
