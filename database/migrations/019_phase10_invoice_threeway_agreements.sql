PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p29','invoice.submit_own','Kendi firmasının faturalarını sunar'),
('p30','invoice.review_own','Kendi işletmesinin faturalarını inceler'),
('p31','agreement.manage_own','Kendi ticari anlaşmalarını yönetir'),
('p32','admin.invoice.manage','Fatura ve eşleştirme operasyonlarını yönetir');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id) VALUES
('role_supplier_admin','p29'),('role_supplier_sales','p29'),('role_supplier_admin','p31'),
('role_business_admin','p30'),('role_business_admin','p31'),('role_accounting','p30'),
('role_commander','p29'),('role_commander','p30'),('role_commander','p31'),('role_commander','p32');

CREATE TABLE commercial_agreements(
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL REFERENCES businesses(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 name TEXT NOT NULL,
 currency TEXT NOT NULL CHECK(length(currency)=3),
 terms_json TEXT NOT NULL DEFAULT '{}',
 valid_from TEXT,
 valid_to TEXT,
 status TEXT NOT NULL CHECK(status IN('DRAFT','PENDING_ACCEPTANCE','ACTIVE','EXPIRED','ARCHIVED')),
 version INTEGER NOT NULL DEFAULT 1,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE agreement_acceptances(
 id TEXT PRIMARY KEY,
 agreement_id TEXT NOT NULL REFERENCES commercial_agreements(id),
 party_type TEXT NOT NULL CHECK(party_type IN('BUSINESS','SUPPLIER')),
 party_id TEXT NOT NULL,
 accepted_by TEXT NOT NULL,
 accepted_at TEXT NOT NULL,
 UNIQUE(agreement_id,party_type)
);

CREATE TABLE supplier_invoices(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id),
 business_id TEXT NOT NULL REFERENCES businesses(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 invoice_number TEXT NOT NULL,
 issue_date TEXT NOT NULL,
 currency TEXT NOT NULL CHECK(length(currency)=3),
 status TEXT NOT NULL CHECK(status IN('DRAFT','SUBMITTED','UNDER_REVIEW','MATCHED','EXCEPTION','APPROVED','REJECTED')),
 net_minor INTEGER NOT NULL DEFAULT 0 CHECK(net_minor >= 0),
 tax_minor INTEGER NOT NULL DEFAULT 0 CHECK(tax_minor >= 0),
 gross_minor INTEGER NOT NULL DEFAULT 0 CHECK(gross_minor >= 0),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(supplier_id,invoice_number)
);

CREATE TABLE invoice_lines(
 id TEXT PRIMARY KEY,
 invoice_id TEXT NOT NULL REFERENCES supplier_invoices(id),
 order_line_id TEXT NOT NULL REFERENCES order_lines(id),
 quantity_milli INTEGER NOT NULL CHECK(quantity_milli > 0),
 unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor >= 0),
 tax_rate_bps INTEGER NOT NULL CHECK(tax_rate_bps BETWEEN 0 AND 10000),
 net_minor INTEGER NOT NULL CHECK(net_minor >= 0),
 tax_minor INTEGER NOT NULL CHECK(tax_minor >= 0),
 gross_minor INTEGER NOT NULL CHECK(gross_minor >= 0),
 created_at TEXT NOT NULL,
 UNIQUE(invoice_id,order_line_id)
);

CREATE TABLE three_way_matches(
 id TEXT PRIMARY KEY,
 invoice_id TEXT NOT NULL UNIQUE REFERENCES supplier_invoices(id),
 status TEXT NOT NULL CHECK(status IN('MATCHED','EXCEPTION')),
 issues_json TEXT NOT NULL DEFAULT '[]',
 order_snapshot_sha256 TEXT,
 matched_at TEXT NOT NULL,
 matched_by TEXT NOT NULL
);

CREATE TABLE commercial_evidence(
 id TEXT PRIMARY KEY,
 entity_type TEXT NOT NULL,
 entity_id TEXT NOT NULL,
 evidence_type TEXT NOT NULL,
 media_asset_id TEXT REFERENCES media_assets(id),
 evidence_sha256 TEXT,
 metadata_json TEXT NOT NULL DEFAULT '{}',
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE INDEX idx_invoices_business ON supplier_invoices(business_id,status,issue_date);
CREATE INDEX idx_invoices_supplier ON supplier_invoices(supplier_id,status,issue_date);
CREATE INDEX idx_agreements_parties ON commercial_agreements(business_id,supplier_id,status);
CREATE INDEX idx_evidence_entity ON commercial_evidence(entity_type,entity_id,created_at);
