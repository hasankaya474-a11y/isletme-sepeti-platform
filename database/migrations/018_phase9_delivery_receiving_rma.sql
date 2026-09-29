PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p25','delivery.manage_own','Kendi teslimat operasyonlarını yönetir'),
('p26','receiving.manage_own','Kendi işletmesinin mal kabulünü yönetir'),
('p27','return.request','Kendi siparişi için iade/RMA talebi oluşturur'),
('p28','admin.delivery.manage','Teslimat ve RMA operasyonlarını yönetir');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id) VALUES
('role_business_admin','p26'),('role_business_admin','p27'),
('role_procurement','p26'),('role_procurement','p27'),
('role_branch_manager','p26'),
('role_supplier_admin','p25'),('role_supplier_sales','p25'),('role_supplier_warehouse','p25'),
('role_commander','p25'),('role_commander','p26'),('role_commander','p27'),('role_commander','p28');

CREATE TABLE delivery_capacity_slots(
 id TEXT PRIMARY KEY,
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 delivery_zone_id TEXT REFERENCES delivery_zones(id),
 delivery_calendar_id TEXT REFERENCES delivery_calendars(id),
 slot_start TEXT NOT NULL,
 slot_end TEXT NOT NULL,
 capacity_units INTEGER NOT NULL CHECK(capacity_units > 0),
 reserved_units INTEGER NOT NULL DEFAULT 0 CHECK(reserved_units >= 0),
 status TEXT NOT NULL CHECK(status IN('OPEN','CLOSED','CANCELLED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 CHECK(reserved_units <= capacity_units)
);

CREATE TABLE deliveries(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
 business_id TEXT NOT NULL REFERENCES businesses(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 delivery_zone_id TEXT REFERENCES delivery_zones(id),
 delivery_sla_id TEXT REFERENCES delivery_slas(id),
 capacity_slot_id TEXT REFERENCES delivery_capacity_slots(id),
 status TEXT NOT NULL CHECK(status IN('PLANNED','SCHEDULED','IN_TRANSIT','DELIVERED','PARTIALLY_DELIVERED','FAILED','CANCELLED')),
 scheduled_start TEXT,
 scheduled_end TEXT,
 eta_at TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE delivery_items(
 id TEXT PRIMARY KEY,
 delivery_id TEXT NOT NULL REFERENCES deliveries(id),
 order_line_id TEXT NOT NULL REFERENCES order_lines(id),
 planned_qty_milli INTEGER NOT NULL CHECK(planned_qty_milli > 0),
 delivered_qty_milli INTEGER NOT NULL DEFAULT 0 CHECK(delivered_qty_milli >= 0),
 UNIQUE(delivery_id,order_line_id)
);

CREATE TABLE receivings(
 id TEXT PRIMARY KEY,
 delivery_id TEXT NOT NULL UNIQUE REFERENCES deliveries(id),
 business_id TEXT NOT NULL REFERENCES businesses(id),
 status TEXT NOT NULL CHECK(status IN('OPEN','COMPLETED','DISPUTED')),
 received_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE receiving_lines(
 id TEXT PRIMARY KEY,
 receiving_id TEXT NOT NULL REFERENCES receivings(id),
 delivery_item_id TEXT NOT NULL REFERENCES delivery_items(id),
 accepted_qty_milli INTEGER NOT NULL CHECK(accepted_qty_milli >= 0),
 rejected_qty_milli INTEGER NOT NULL CHECK(rejected_qty_milli >= 0),
 reason TEXT,
 created_at TEXT NOT NULL,
 UNIQUE(receiving_id,delivery_item_id)
);

CREATE TABLE return_rmas(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id),
 business_id TEXT NOT NULL REFERENCES businesses(id),
 supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 status TEXT NOT NULL CHECK(status IN('REQUESTED','APPROVED','REJECTED','IN_TRANSIT','RECEIVED','CLOSED','CANCELLED')),
 reason TEXT NOT NULL,
 requested_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE return_rma_lines(
 id TEXT PRIMARY KEY,
 rma_id TEXT NOT NULL REFERENCES return_rmas(id),
 order_line_id TEXT NOT NULL REFERENCES order_lines(id),
 quantity_milli INTEGER NOT NULL CHECK(quantity_milli > 0),
 reason TEXT,
 created_at TEXT NOT NULL
);

CREATE INDEX idx_capacity_supplier ON delivery_capacity_slots(supplier_id,status,slot_start);
CREATE INDEX idx_deliveries_supplier ON deliveries(supplier_id,status);
CREATE INDEX idx_deliveries_business ON deliveries(business_id,status);
CREATE INDEX idx_rma_business ON return_rmas(business_id,status);
CREATE INDEX idx_rma_supplier ON return_rmas(supplier_id,status);
