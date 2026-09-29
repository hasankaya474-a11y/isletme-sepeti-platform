PRAGMA foreign_keys=ON;

CREATE TABLE commission_rules(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 rate_bps INTEGER NOT NULL CHECK(rate_bps BETWEEN 0 AND 10000),
 currency TEXT,
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE financial_ledger_entries(
 id TEXT PRIMARY KEY,
 organization_id TEXT NOT NULL,
 entry_type TEXT NOT NULL CHECK(entry_type IN('COMMISSION','RECEIVABLE','PAYABLE','ADJUSTMENT','REVERSAL')),
 direction TEXT NOT NULL CHECK(direction IN('DEBIT','CREDIT')),
 amount_minor INTEGER NOT NULL CHECK(amount_minor >= 0),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 reference_type TEXT NOT NULL,
 reference_id TEXT NOT NULL,
 source_entry_id TEXT REFERENCES financial_ledger_entries(id),
 memo TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE INDEX idx_ledger_org_time ON financial_ledger_entries(organization_id,created_at);
CREATE INDEX idx_ledger_ref ON financial_ledger_entries(reference_type,reference_id);

CREATE TABLE reconciliation_cases(
 id TEXT PRIMARY KEY,
 organization_id TEXT NOT NULL,
 currency TEXT NOT NULL CHECK(length(currency)=3),
 expected_minor INTEGER NOT NULL,
 observed_minor INTEGER NOT NULL,
 difference_minor INTEGER NOT NULL,
 status TEXT NOT NULL CHECK(status IN('OPEN','REVIEW','RESOLVED','DISMISSED')),
 resolution_note TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
