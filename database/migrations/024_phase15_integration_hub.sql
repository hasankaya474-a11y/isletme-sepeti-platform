PRAGMA foreign_keys=ON;

CREATE TABLE integration_connections(
 id TEXT PRIMARY KEY,
 provider_key TEXT NOT NULL,
 organization_id TEXT,
 status TEXT NOT NULL CHECK(status IN('DRAFT','ACTIVE','PAUSED','REVOKED','ARCHIVED')),
 capabilities_json TEXT NOT NULL DEFAULT '[]',
 config_ref TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE webhook_subscriptions(
 id TEXT PRIMARY KEY,
 integration_connection_id TEXT NOT NULL REFERENCES integration_connections(id),
 event_type TEXT NOT NULL,
 endpoint_ref TEXT NOT NULL,
 signing_secret_ref TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('ACTIVE','PAUSED','REVOKED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE webhook_deliveries(
 id TEXT PRIMARY KEY,
 webhook_subscription_id TEXT NOT NULL REFERENCES webhook_subscriptions(id),
 event_id TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('PENDING','DELIVERED','FAILED')),
 attempts INTEGER NOT NULL DEFAULT 0,
 response_code INTEGER,
 last_error TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(webhook_subscription_id,event_id)
);

CREATE TABLE bulk_jobs(
 id TEXT PRIMARY KEY,
 job_type TEXT NOT NULL CHECK(job_type IN('IMPORT','EXPORT')),
 domain_key TEXT NOT NULL,
 organization_id TEXT,
 status TEXT NOT NULL CHECK(status IN('UPLOADED','VALIDATING','READY','APPLYING','COMPLETED','FAILED','CANCELLED')),
 artifact_ref TEXT,
 validation_json TEXT NOT NULL DEFAULT '{}',
 requested_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
