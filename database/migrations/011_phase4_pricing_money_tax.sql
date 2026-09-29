PRAGMA foreign_keys=ON;

CREATE TABLE tax_profiles(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 country_code TEXT NOT NULL,
 tax_rate_bps INTEGER NOT NULL CHECK(tax_rate_bps BETWEEN 0 AND 10000),
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE price_books(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 currency TEXT NOT NULL CHECK(length(currency)=3),
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 valid_from TEXT,
 valid_to TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE supplier_offer_prices(
 id TEXT PRIMARY KEY,
 supplier_offer_id TEXT NOT NULL REFERENCES supplier_offers(id),
 price_book_id TEXT NOT NULL REFERENCES price_books(id),
 tax_profile_id TEXT REFERENCES tax_profiles(id),
 unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor >= 0),
 currency TEXT NOT NULL CHECK(length(currency)=3),
 min_order_qty TEXT,
 valid_from TEXT,
 valid_to TEXT,
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 version INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(supplier_offer_id,price_book_id,version)
);

CREATE INDEX idx_offer_prices_offer ON supplier_offer_prices(supplier_offer_id,status);
CREATE INDEX idx_offer_prices_book ON supplier_offer_prices(price_book_id,status);
