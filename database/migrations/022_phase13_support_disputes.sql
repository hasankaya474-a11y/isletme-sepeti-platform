PRAGMA foreign_keys=ON;

CREATE TABLE support_cases(
 id TEXT PRIMARY KEY,
 case_type TEXT NOT NULL CHECK(case_type IN('SUPPORT','DISPUTE','CALL_CENTER')),
 organization_id TEXT,
 requester_id TEXT,
 subject TEXT NOT NULL,
 priority TEXT NOT NULL CHECK(priority IN('LOW','NORMAL','HIGH','URGENT')),
 status TEXT NOT NULL CHECK(status IN('NEW','OPEN','WAITING_CUSTOMER','WAITING_INTERNAL','RESOLVED','CLOSED')),
 reference_type TEXT,
 reference_id TEXT,
 assigned_to TEXT,
 sla_due_at TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE support_case_events(
 id TEXT PRIMARY KEY,
 support_case_id TEXT NOT NULL REFERENCES support_cases(id),
 event_type TEXT NOT NULL CHECK(event_type IN('NOTE','STATUS_CHANGE','ASSIGNMENT','CUSTOMER_MESSAGE','INTERNAL_MESSAGE','EVIDENCE_LINK')),
 body TEXT,
 visibility TEXT NOT NULL CHECK(visibility IN('PUBLIC','INTERNAL')),
 actor_id TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE INDEX idx_support_case_status ON support_cases(status,priority,created_at);
CREATE INDEX idx_support_case_ref ON support_cases(reference_type,reference_id);
CREATE INDEX idx_support_case_events_case ON support_case_events(support_case_id,created_at);
