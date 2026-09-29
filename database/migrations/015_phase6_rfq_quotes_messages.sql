PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p18','admin.rfq.manage','RFQ ve teklif operasyonlarını yönetir');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id) VALUES
('role_commander','p18');

CREATE TABLE rfqs(
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL REFERENCES businesses(id),
 title TEXT NOT NULL,
 note TEXT,
 status TEXT NOT NULL CHECK(status IN('DRAFT','OPEN','CLOSED','CANCELLED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE rfq_lines(
 id TEXT PRIMARY KEY,
 rfq_id TEXT NOT NULL REFERENCES rfqs(id),
 master_product_id TEXT NOT NULL REFERENCES master_products(id),
 variant_id TEXT REFERENCES product_variants(id),
 quantity_milli INTEGER NOT NULL CHECK(quantity_milli > 0),
 unit TEXT NOT NULL,
 note TEXT,
 created_at TEXT NOT NULL
);

CREATE TABLE rfq_invitations(
 id TEXT PRIMARY KEY,
 rfq_id TEXT NOT NULL REFERENCES rfqs(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 status TEXT NOT NULL CHECK(status IN('INVITED','VIEWED','DECLINED','RESPONDED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(rfq_id,supplier_id)
);

CREATE TABLE quotes(
 id TEXT PRIMARY KEY,
 rfq_id TEXT NOT NULL REFERENCES rfqs(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 status TEXT NOT NULL CHECK(status IN('DRAFT','SUBMITTED','WITHDRAWN','EXPIRED','ACCEPTED','REJECTED')),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 note TEXT,
 valid_until TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(rfq_id,supplier_id)
);

CREATE TABLE quote_lines(
 id TEXT PRIMARY KEY,
 quote_id TEXT NOT NULL REFERENCES quotes(id),
 rfq_line_id TEXT NOT NULL REFERENCES rfq_lines(id),
 unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor >= 0),
 tax_rate_bps INTEGER NOT NULL CHECK(tax_rate_bps BETWEEN 0 AND 10000),
 note TEXT,
 created_at TEXT NOT NULL,
 UNIQUE(quote_id,rfq_line_id)
);

CREATE TABLE rfq_messages(
 id TEXT PRIMARY KEY,
 rfq_id TEXT NOT NULL REFERENCES rfqs(id),
 sender_org_type TEXT NOT NULL CHECK(sender_org_type IN('BUSINESS','SUPPLIER','PLATFORM')),
 sender_org_id TEXT NOT NULL,
 sender_user_id TEXT NOT NULL,
 body TEXT NOT NULL,
 message_type TEXT NOT NULL CHECK(message_type IN('TEXT','SYSTEM')),
 created_at TEXT NOT NULL
);

CREATE INDEX idx_rfqs_business ON rfqs(business_id,status);
CREATE INDEX idx_rfq_inv_supplier ON rfq_invitations(supplier_id,status);
CREATE INDEX idx_quotes_rfq ON quotes(rfq_id,status);
CREATE INDEX idx_rfq_messages_rfq ON rfq_messages(rfq_id,created_at);
