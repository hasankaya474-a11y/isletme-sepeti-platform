PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p19','cart.manage','Satın alma sepetini yönetir'),
('p20','procurement.approve','Satın alma taleplerini onaylar'),
('p21','procurement.policy.manage','Satın alma onay politikasını yönetir'),
('p22','admin.procurement.manage','Platform satın alma operasyonlarını yönetir');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id) VALUES
('role_business_admin','p19'),('role_business_admin','p20'),('role_business_admin','p21'),
('role_procurement','p19'),('role_chef','p19'),
('role_commander','p19'),('role_commander','p20'),('role_commander','p21'),('role_commander','p22');

CREATE TABLE procurement_approval_rules(
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL REFERENCES businesses(id),
 name TEXT NOT NULL,
 currency TEXT NOT NULL CHECK(length(currency)=3),
 threshold_minor INTEGER NOT NULL CHECK(threshold_minor >= 0),
 status TEXT NOT NULL CHECK(status IN('DRAFT','ACTIVE','INACTIVE','ARCHIVED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE carts(
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL REFERENCES businesses(id),
 name TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('ACTIVE','PENDING_APPROVAL','APPROVED','REJECTED','PO_READY','ABANDONED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE cart_lines(
 id TEXT PRIMARY KEY,
 cart_id TEXT NOT NULL REFERENCES carts(id),
 master_product_id TEXT NOT NULL REFERENCES master_products(id),
 variant_id TEXT REFERENCES product_variants(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 supplier_offer_id TEXT REFERENCES supplier_offers(id),
 source_quote_id TEXT REFERENCES quotes(id),
 source_quote_line_id TEXT REFERENCES quote_lines(id),
 quantity_milli INTEGER NOT NULL CHECK(quantity_milli > 0),
 unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor >= 0),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 tax_rate_bps INTEGER NOT NULL CHECK(tax_rate_bps BETWEEN 0 AND 10000),
 status TEXT NOT NULL CHECK(status IN('ACTIVE','REMOVED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 CHECK(supplier_offer_id IS NOT NULL OR source_quote_line_id IS NOT NULL)
);

CREATE TABLE purchase_requisitions(
 id TEXT PRIMARY KEY,
 cart_id TEXT NOT NULL UNIQUE REFERENCES carts(id),
 business_id TEXT NOT NULL REFERENCES businesses(id),
 status TEXT NOT NULL CHECK(status IN('PENDING_APPROVAL','APPROVED','REJECTED','PO_READY','CANCELLED')),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 estimated_net_minor INTEGER NOT NULL CHECK(estimated_net_minor >= 0),
 estimated_tax_minor INTEGER NOT NULL CHECK(estimated_tax_minor >= 0),
 estimated_gross_minor INTEGER NOT NULL CHECK(estimated_gross_minor >= 0),
 requested_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE procurement_approvals(
 id TEXT PRIMARY KEY,
 requisition_id TEXT NOT NULL REFERENCES purchase_requisitions(id),
 status TEXT NOT NULL CHECK(status IN('PENDING','APPROVED','REJECTED')),
 requested_by TEXT NOT NULL,
 decided_by TEXT,
 note TEXT,
 created_at TEXT NOT NULL,
 decided_at TEXT
);

CREATE INDEX idx_carts_business ON carts(business_id,status);
CREATE INDEX idx_cart_lines_cart ON cart_lines(cart_id,status);
CREATE INDEX idx_requisitions_business ON purchase_requisitions(business_id,status);
CREATE INDEX idx_proc_approvals_req ON procurement_approvals(requisition_id,status);
