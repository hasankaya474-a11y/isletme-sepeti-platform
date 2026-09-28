PRAGMA foreign_keys = ON;

CREATE TABLE security_events (
  id TEXT PRIMARY KEY,
  occurred_at TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK(severity IN ('INFO','LOW','MEDIUM','HIGH','CRITICAL')),
  outcome TEXT NOT NULL CHECK(outcome IN ('SUCCESS','FAILURE','BLOCKED','OBSERVED')),
  ip_hash TEXT,
  device_hash TEXT,
  correlation_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE login_attempts (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  ip_hash TEXT,
  attempted_at TEXT NOT NULL,
  succeeded INTEGER NOT NULL CHECK(succeeded IN (0,1))
);

CREATE TABLE recovery_challenges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE admin_change_requests (
  id TEXT PRIMARY KEY,
  requested_by TEXT NOT NULL REFERENCES users(id),
  action_code TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK(risk_level IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  status TEXT NOT NULL CHECK(status IN ('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','APPLIED','CANCELLED')),
  requested_at TEXT NOT NULL,
  decided_by TEXT REFERENCES users(id),
  decided_at TEXT,
  applied_at TEXT
);

CREATE INDEX idx_security_user_time ON security_events(user_id, occurred_at);
CREATE INDEX idx_security_type_time ON security_events(event_type, occurred_at);
CREATE INDEX idx_login_email_time ON login_attempts(email_hash, attempted_at);
CREATE INDEX idx_admin_change_status ON admin_change_requests(status, risk_level, requested_at);
