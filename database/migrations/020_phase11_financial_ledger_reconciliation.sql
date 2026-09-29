PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p33','finance.commission.change','Komisyon kurallarını yönetir'),
('p34','finance.ledger.read','Finansal ledger kayıtlarını görür'),
('p35','finance.reconcile','Finansal mutabakat çalıştırır'),
('p36','admin.finance.manage','Finansal operasyonları yönetir');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id) VALUES
('role_accounting','p34'),('role_accounting','p35'),
('role_business_admin','p34'),
('role_supplier_admin','p34'),
('role_commander','p33'),('role_commander','p34'),('role_commander','p35'),('role_commander','p36');

CREATE TABLE commission_rules(
 id TEXT PRIMARY KEY,
 scope_type TEXT NOT NULL CHECK(scope_type IN('GLOBAL','SUPPLIER','BUSINESS_SUPPLIER')),
 business_id TEXT REFERENCES businesses(id),
 supplier_id TEXT REFERENCES suppliers(id),
 name TEXT NOT NULL,
 basis TEXT NOT NULL CHECK(basis IN('NET','GROSS')),
 rate_bps INTEGER NOT NULL CHECK(rate_bps BETWEEN 0 AND 10000),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 status TEXT NOT NULL CHECK(status IN('DRAFT','ACTIVE','INACTIVE','ARCHIVED')),
 version INTEGER NOT NULL DEFAULT 1,
 valid_from TEXT,
 valid_to TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE ledger_transactions(
 id TEXT PRIMARY KEY,
 transaction_type TEXT NOT NULL CHECK(transaction_type IN('INVOICE_APPROVED','COMMISSION_ACCRUAL','ADJUSTMENT','REVERSAL')),
 source_type TEXT NOT NULL,
 source_id TEXT NOT NULL,
 currency TEXT NOT NULL CHECK(length(currency)=3),
 status TEXT NOT NULL CHECK(status IN('POSTED','REVERSED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 UNIQUE(transaction_type,source_type,source_id)
);

CREATE TABLE ledger_entries(
 id TEXT PRIMARY KEY,
 transaction_id TEXT NOT NULL REFERENCES ledger_transactions(id),
 account_code TEXT NOT NULL,
 organization_type TEXT CHECK(organization_type IN('BUSINESS','SUPPLIER','PLATFORM')),
 organization_id TEXT,
 amount_minor INTEGER NOT NULL CHECK(amount_minor <> 0),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 contra_of_entry_id TEXT REFERENCES ledger_entries(id),
 metadata_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL
);

CREATE TABLE commission_accruals(
 id TEXT PRIMARY KEY,
 invoice_id TEXT NOT NULL UNIQUE REFERENCES supplier_invoices(id),
 commission_rule_id TEXT NOT NULL REFERENCES commission_rules(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 business_id TEXT NOT NULL REFERENCES businesses(id),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 basis_minor INTEGER NOT NULL CHECK(basis_minor >= 0),
 rate_bps INTEGER NOT NULL CHECK(rate_bps BETWEEN 0 AND 10000),
 commission_minor INTEGER NOT NULL CHECK(commission_minor >= 0),
 ledger_transaction_id TEXT NOT NULL REFERENCES ledger_transactions(id),
 created_at TEXT NOT NULL
);

CREATE TABLE reconciliation_batches(
 id TEXT PRIMARY KEY,
 business_id TEXT REFERENCES businesses(id),
 supplier_id TEXT REFERENCES suppliers(id),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 status TEXT NOT NULL CHECK(status IN('OPEN','REVIEW','RECONCILED','CLOSED')),
 period_start TEXT,
 period_end TEXT,
 expected_minor INTEGER NOT NULL DEFAULT 0,
 ledger_minor INTEGER NOT NULL DEFAULT 0,
 difference_minor INTEGER NOT NULL DEFAULT 0,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE reconciliation_items(
 id TEXT PRIMARY KEY,
 batch_id TEXT NOT NULL REFERENCES reconciliation_batches(id),
 source_type TEXT NOT NULL,
 source_id TEXT NOT NULL,
 expected_minor INTEGER NOT NULL,
 ledger_minor INTEGER NOT NULL,
 difference_minor INTEGER NOT NULL,
 status TEXT NOT NULL CHECK(status IN('MATCHED','DIFFERENCE','RESOLVED')),
 resolution_note TEXT,
 resolved_by TEXT,
 resolved_at TEXT
);

CREATE INDEX idx_commission_rule_scope ON commission_rules(scope_type,business_id,supplier_id,status);
CREATE INDEX idx_ledger_transaction_source ON ledger_transactions(source_type,source_id);
CREATE INDEX idx_ledger_entry_org ON ledger_entries(organization_type,organization_id,currency);
CREATE INDEX idx_reconciliation_scope ON reconciliation_batches(business_id,supplier_id,status);


CREATE TRIGGER ledger_entries_no_update
BEFORE UPDATE ON ledger_entries
BEGIN
 SELECT RAISE(ABORT,'LEDGER_ENTRY_IMMUTABLE');
END;

CREATE TRIGGER ledger_entries_no_delete
BEFORE DELETE ON ledger_entries
BEGIN
 SELECT RAISE(ABORT,'LEDGER_ENTRY_IMMUTABLE');
END;

CREATE TRIGGER commission_accruals_no_update
BEFORE UPDATE ON commission_accruals
BEGIN
 SELECT RAISE(ABORT,'COMMISSION_ACCRUAL_IMMUTABLE');
END;

CREATE TRIGGER commission_accruals_no_delete
BEFORE DELETE ON commission_accruals
BEGIN
 SELECT RAISE(ABORT,'COMMISSION_ACCRUAL_IMMUTABLE');
END;
