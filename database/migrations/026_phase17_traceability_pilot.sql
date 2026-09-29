PRAGMA foreign_keys=ON;

CREATE TABLE pilot_enrollments(
 id TEXT PRIMARY KEY,
 organization_id TEXT NOT NULL,
 pilot_key TEXT NOT NULL,
 participant_type TEXT NOT NULL,
 participant_id TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('INVITED','ACTIVE','PAUSED','WITHDRAWN','COMPLETED')),
 location_consent INTEGER NOT NULL DEFAULT 0 CHECK(location_consent IN(0,1)),
 consented_at TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(pilot_key,participant_type,participant_id)
);

CREATE TABLE traceability_events(
 id TEXT PRIMARY KEY,
 aggregate_type TEXT NOT NULL,
 aggregate_id TEXT NOT NULL,
 event_type TEXT NOT NULL,
 source_type TEXT NOT NULL,
 source_id TEXT,
 evidence_json TEXT NOT NULL DEFAULT '{}',
 actor_id TEXT NOT NULL,
 occurred_at TEXT NOT NULL
);

CREATE TABLE location_samples(
 id TEXT PRIMARY KEY,
 pilot_enrollment_id TEXT NOT NULL REFERENCES pilot_enrollments(id),
 delivery_id TEXT NOT NULL,
 latitude REAL NOT NULL CHECK(latitude BETWEEN -90 AND 90),
 longitude REAL NOT NULL CHECK(longitude BETWEEN -180 AND 180),
 accuracy_meters REAL,
 captured_at TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE INDEX idx_traceability_aggregate ON traceability_events(aggregate_type,aggregate_id,occurred_at);
CREATE INDEX idx_location_delivery ON location_samples(delivery_id,captured_at);
