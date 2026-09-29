PRAGMA foreign_keys=ON;

CREATE TABLE stock_locations(
 id TEXT PRIMARY KEY,
 organization_id TEXT NOT NULL,
 name TEXT NOT NULL,
 location_type TEXT NOT NULL CHECK(location_type IN('WAREHOUSE','BRANCH','STORE','VIRTUAL')),
 status TEXT NOT NULL CHECK(status IN('ACTIVE','INACTIVE','ARCHIVED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE stock_balances(
 id TEXT PRIMARY KEY,
 stock_location_id TEXT NOT NULL REFERENCES stock_locations(id),
 supplier_offer_id TEXT NOT NULL REFERENCES supplier_offers(id),
 on_hand_qty REAL NOT NULL DEFAULT 0 CHECK(on_hand_qty >= 0),
 reserved_qty REAL NOT NULL DEFAULT 0 CHECK(reserved_qty >= 0),
 version INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL,
 UNIQUE(stock_location_id,supplier_offer_id),
 CHECK(reserved_qty <= on_hand_qty)
);

CREATE TABLE stock_movements(
 id TEXT PRIMARY KEY,
 stock_balance_id TEXT NOT NULL REFERENCES stock_balances(id),
 movement_type TEXT NOT NULL CHECK(movement_type IN('RECEIPT','ADJUSTMENT_IN','ADJUSTMENT_OUT','ORDER_COMMIT','RETURN_IN')),
 quantity REAL NOT NULL CHECK(quantity > 0),
 reference_type TEXT,
 reference_id TEXT,
 actor_id TEXT NOT NULL,
 created_at TEXT NOT NULL
);

CREATE TABLE stock_reservations(
 id TEXT PRIMARY KEY,
 stock_balance_id TEXT NOT NULL REFERENCES stock_balances(id),
 owner_type TEXT NOT NULL CHECK(owner_type IN('CART','RFQ','ORDER','SYSTEM')),
 owner_id TEXT NOT NULL,
 quantity REAL NOT NULL CHECK(quantity > 0),
 status TEXT NOT NULL CHECK(status IN('ACTIVE','RELEASED','COMMITTED','EXPIRED','CANCELLED')),
 expires_at TEXT,
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE INDEX idx_stock_balance_offer ON stock_balances(supplier_offer_id);
CREATE INDEX idx_stock_reservation_owner ON stock_reservations(owner_type,owner_id,status);
CREATE INDEX idx_stock_reservation_balance ON stock_reservations(stock_balance_id,status);
