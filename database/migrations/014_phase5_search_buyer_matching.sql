PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p15','buyer.catalog.search','Katalog ve ürün araması yapar'),
('p16','buyer.list.manage','Satın alma listelerini ve eşleştirme isteklerini yönetir'),
('p17','admin.search.manage','Arama sözlüğü ve eşleştirme incelemesini yönetir');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id) VALUES
('role_business_admin','p15'),('role_business_admin','p16'),
('role_procurement','p15'),('role_procurement','p16'),
('role_chef','p15'),('role_chef','p16'),
('role_commander','p15'),('role_commander','p16'),('role_commander','p17');

CREATE TABLE search_synonyms(
 id TEXT PRIMARY KEY,
 term TEXT NOT NULL,
 synonym TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(term,synonym)
);

CREATE TABLE buyer_saved_lists(
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL REFERENCES businesses(id),
 name TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('ACTIVE','ARCHIVED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE buyer_saved_list_items(
 id TEXT PRIMARY KEY,
 list_id TEXT NOT NULL REFERENCES buyer_saved_lists(id),
 master_product_id TEXT NOT NULL REFERENCES master_products(id),
 variant_id TEXT REFERENCES product_variants(id),
 quantity REAL CHECK(quantity IS NULL OR quantity > 0),
 note TEXT,
 created_at TEXT NOT NULL,
 UNIQUE(list_id,master_product_id,variant_id)
);

CREATE TABLE matching_requests(
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL REFERENCES businesses(id),
 source_type TEXT NOT NULL CHECK(source_type IN('TEXT_LIST','PHOTO')),
 source_text TEXT,
 source_media_asset_id TEXT REFERENCES media_assets(id),
 status TEXT NOT NULL CHECK(status IN('NEW','PROCESSING','REVIEW','COMPLETED','CANCELLED')),
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 CHECK((source_type='TEXT_LIST' AND source_text IS NOT NULL) OR (source_type='PHOTO' AND source_media_asset_id IS NOT NULL))
);

CREATE TABLE matching_candidates(
 id TEXT PRIMARY KEY,
 matching_request_id TEXT NOT NULL REFERENCES matching_requests(id),
 source_line TEXT,
 master_product_id TEXT NOT NULL REFERENCES master_products(id),
 variant_id TEXT REFERENCES product_variants(id),
 confidence REAL NOT NULL CHECK(confidence BETWEEN 0 AND 1),
 reason_json TEXT NOT NULL DEFAULT '{}',
 decision TEXT NOT NULL CHECK(decision IN('PENDING','CONFIRMED','REJECTED')),
 reviewed_by TEXT,
 reviewed_at TEXT
);

CREATE INDEX idx_search_synonyms_term ON search_synonyms(term,status);
CREATE INDEX idx_buyer_lists_business ON buyer_saved_lists(business_id,status);
CREATE INDEX idx_matching_requests_business ON matching_requests(business_id,status);
CREATE INDEX idx_matching_candidates_request ON matching_candidates(matching_request_id,decision);
