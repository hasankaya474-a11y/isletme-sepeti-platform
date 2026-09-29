PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p23','order.create_from_requisition','Onaylı satın alma talebinden sipariş oluşturur'),
('p24','admin.order.manage','Sipariş ve outbox operasyonlarını yönetir');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id) VALUES
('role_business_admin','p23'),('role_business_admin','p10'),
('role_procurement','p23'),('role_procurement','p10'),
('role_commander','p23'),('role_commander','p24');

CREATE TABLE orders(
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL REFERENCES businesses(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 requisition_id TEXT NOT NULL REFERENCES purchase_requisitions(id),
 state TEXT NOT NULL CHECK(state IN('NEW','WAITING','ACCEPTED','PARTIALLY_ACCEPTED','PREPARING','READY','SHIPPED','DELIVERED','PARTIALLY_DELIVERED','COMPLETED','CANCELLED','RETURNED','DISPUTED')),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 net_minor INTEGER NOT NULL CHECK(net_minor >= 0),
 tax_minor INTEGER NOT NULL CHECK(tax_minor >= 0),
 gross_minor INTEGER NOT NULL CHECK(gross_minor >= 0),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(requisition_id,supplier_id)
);

CREATE TABLE order_lines(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id),
 master_product_id TEXT NOT NULL REFERENCES master_products(id),
 variant_id TEXT REFERENCES product_variants(id),
 supplier_offer_id TEXT REFERENCES supplier_offers(id),
 source_quote_line_id TEXT REFERENCES quote_lines(id),
 quantity_milli INTEGER NOT NULL CHECK(quantity_milli > 0),
 unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor >= 0),
 tax_rate_bps INTEGER NOT NULL CHECK(tax_rate_bps BETWEEN 0 AND 10000),
 net_minor INTEGER NOT NULL CHECK(net_minor >= 0),
 tax_minor INTEGER NOT NULL CHECK(tax_minor >= 0),
 gross_minor INTEGER NOT NULL CHECK(gross_minor >= 0),
 created_at TEXT NOT NULL
);

CREATE TABLE order_snapshots(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
 snapshot_json TEXT NOT NULL,
 snapshot_sha256 TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE TABLE idempotency_records(
 id TEXT PRIMARY KEY,
 scope_type TEXT NOT NULL,
 scope_id TEXT NOT NULL,
 idempotency_key TEXT NOT NULL,
 operation TEXT NOT NULL,
 resource_type TEXT NOT NULL,
 response_json TEXT NOT NULL,
 created_at TEXT NOT NULL,
 UNIQUE(scope_type,scope_id,idempotency_key,operation)
);

CREATE TABLE outbox_events(
 id TEXT PRIMARY KEY,
 aggregate_type TEXT NOT NULL,
 aggregate_id TEXT NOT NULL,
 event_type TEXT NOT NULL,
 payload_json TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('PENDING','PUBLISHED','FAILED')),
 attempts INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL,
 published_at TEXT,
 last_error TEXT
);

CREATE INDEX idx_orders_business ON orders(business_id,state,created_at);
CREATE INDEX idx_orders_supplier ON orders(supplier_id,state,created_at);
CREATE INDEX idx_order_lines_order ON order_lines(order_id);
CREATE INDEX idx_outbox_pending ON outbox_events(status,created_at);
