PRAGMA foreign_keys=ON;

CREATE TABLE retention_policies(
 id TEXT PRIMARY KEY,
 data_class TEXT NOT NULL,
 scope_type TEXT NOT NULL,
 scope_id TEXT,
 retain_days INTEGER NOT NULL CHECK(retain_days >= 0),
 disposition TEXT NOT NULL CHECK(disposition IN('ARCHIVE','ANONYMIZE','DELETE_WHEN_ALLOWED')),
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE restore_verifications(
 id TEXT PRIMARY KEY,
 backup_ref TEXT NOT NULL,
 environment TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('PENDING','PASS','FAIL')),
 checks_json TEXT NOT NULL DEFAULT '{}',
 verified_by TEXT,
 verified_at TEXT,
 created_at TEXT NOT NULL
);

CREATE TABLE load_test_results(
 id TEXT PRIMARY KEY,
 scenario_key TEXT NOT NULL,
 target_rps INTEGER NOT NULL CHECK(target_rps > 0),
 observed_rps REAL NOT NULL,
 p95_ms REAL NOT NULL,
 error_rate REAL NOT NULL,
 status TEXT NOT NULL CHECK(status IN('PASS','FAIL')),
 evidence_json TEXT NOT NULL DEFAULT '{}',
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL
);
