PRAGMA foreign_keys=ON;
CREATE TABLE email_verifications(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),token_hash TEXT NOT NULL UNIQUE,
 created_at TEXT NOT NULL,expires_at TEXT NOT NULL,consumed_at TEXT
);
CREATE INDEX idx_email_verify_user ON email_verifications(user_id,expires_at);
CREATE INDEX idx_mfa_user_active ON mfa_methods(user_id,revoked_at);
