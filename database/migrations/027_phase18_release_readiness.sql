PRAGMA foreign_keys=ON;

CREATE TABLE release_gate_evidence(
 id TEXT PRIMARY KEY,
 gate_key TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('MISSING','PENDING','PASS','FAIL')),
 evidence_ref TEXT,
 note TEXT,
 reviewed_by TEXT,
 reviewed_at TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(gate_key)
);

CREATE TABLE pilot_defects(
 id TEXT PRIMARY KEY,
 severity TEXT NOT NULL CHECK(severity IN('LOW','MEDIUM','HIGH','CRITICAL')),
 title TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('OPEN','IN_PROGRESS','RESOLVED','VERIFIED','WONT_FIX')),
 evidence_ref TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE production_release_decisions(
 id TEXT PRIMARY KEY,
 decision TEXT NOT NULL CHECK(decision IN('APPROVE','REJECT')),
 rationale TEXT NOT NULL,
 decided_by TEXT NOT NULL,
 decided_at TEXT NOT NULL,
 gate_snapshot_json TEXT NOT NULL
);
