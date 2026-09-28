PRAGMA foreign_keys=ON;

CREATE TABLE catalog_categories(
 id TEXT PRIMARY KEY,parent_id TEXT REFERENCES catalog_categories(id),name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','PUBLISHED','UNPUBLISHED','ARCHIVED')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL
);
CREATE TABLE catalog_brands(
 id TEXT PRIMARY KEY,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','PUBLISHED','UNPUBLISHED','ARCHIVED')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL
);
CREATE TABLE master_products(
 id TEXT PRIMARY KEY,product_key TEXT NOT NULL UNIQUE,name TEXT NOT NULL,brand_id TEXT REFERENCES catalog_brands(id),category_id TEXT REFERENCES catalog_categories(id),gtin TEXT,barcode TEXT,base_unit TEXT NOT NULL,net_quantity TEXT,origin TEXT,storage_requirements TEXT,allergen_json TEXT NOT NULL DEFAULT '[]',specifications_json TEXT NOT NULL DEFAULT '{}',status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','PUBLISHED','UNPUBLISHED','ARCHIVED')),version INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX idx_master_products_gtin ON master_products(gtin) WHERE gtin IS NOT NULL;
CREATE UNIQUE INDEX idx_master_products_barcode ON master_products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_master_products_category ON master_products(category_id,status);
CREATE INDEX idx_master_products_brand ON master_products(brand_id,status);

CREATE TABLE product_variants(
 id TEXT PRIMARY KEY,master_product_id TEXT NOT NULL REFERENCES master_products(id),variant_key TEXT NOT NULL,package_type TEXT,unit TEXT NOT NULL,quantity TEXT,sku TEXT,gtin TEXT,barcode TEXT,status TEXT NOT NULL CHECK(status IN('ACTIVE','INACTIVE','ARCHIVED')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL,UNIQUE(master_product_id,variant_key)
);
CREATE UNIQUE INDEX idx_product_variants_gtin ON product_variants(gtin) WHERE gtin IS NOT NULL;
CREATE UNIQUE INDEX idx_product_variants_barcode ON product_variants(barcode) WHERE barcode IS NOT NULL;

CREATE TABLE product_media(
 id TEXT PRIMARY KEY,master_product_id TEXT NOT NULL REFERENCES master_products(id),media_asset_id TEXT NOT NULL REFERENCES media_assets(id),position INTEGER NOT NULL DEFAULT 0,role TEXT NOT NULL DEFAULT 'GALLERY',created_at TEXT NOT NULL,UNIQUE(master_product_id,media_asset_id)
);

CREATE TABLE supplier_offers(
 id TEXT PRIMARY KEY,supplier_id TEXT NOT NULL REFERENCES suppliers(id),master_product_id TEXT NOT NULL REFERENCES master_products(id),variant_id TEXT REFERENCES product_variants(id),supplier_sku TEXT,offer_status TEXT NOT NULL CHECK(offer_status IN('DRAFT','REVIEW','ACTIVE','PAUSED','REJECTED','ARCHIVED')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL,UNIQUE(supplier_id,master_product_id,variant_id)
);
CREATE INDEX idx_supplier_offers_supplier ON supplier_offers(supplier_id,offer_status);
CREATE INDEX idx_supplier_offers_product ON supplier_offers(master_product_id,offer_status);

CREATE TABLE new_product_requests(
 id TEXT PRIMARY KEY,supplier_id TEXT NOT NULL REFERENCES suppliers(id),proposed_name TEXT NOT NULL,proposed_brand TEXT,proposed_category TEXT,gtin TEXT,barcode TEXT,package_json TEXT NOT NULL DEFAULT '{}',evidence_json TEXT NOT NULL DEFAULT '[]',status TEXT NOT NULL CHECK(status IN('NEW','UNDER_REVIEW','APPROVED','REJECTED','NEEDS_INFO')),resolved_master_product_id TEXT REFERENCES master_products(id),created_by TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL
);
CREATE INDEX idx_new_product_requests_status ON new_product_requests(status,created_at);

CREATE TABLE catalog_quality_issues(
 id TEXT PRIMARY KEY,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,issue_code TEXT NOT NULL,severity TEXT NOT NULL CHECK(severity IN('INFO','WARNING','ERROR')),status TEXT NOT NULL CHECK(status IN('OPEN','ACKNOWLEDGED','RESOLVED','DISMISSED')),details_json TEXT NOT NULL DEFAULT '{}',created_at TEXT NOT NULL,resolved_at TEXT,resolved_by TEXT
);
CREATE INDEX idx_catalog_quality_open ON catalog_quality_issues(status,severity,entity_type);

CREATE TABLE duplicate_candidates(
 id TEXT PRIMARY KEY,left_product_id TEXT NOT NULL REFERENCES master_products(id),right_product_id TEXT NOT NULL REFERENCES master_products(id),score_basis_json TEXT NOT NULL DEFAULT '{}',confidence REAL NOT NULL CHECK(confidence BETWEEN 0 AND 1),status TEXT NOT NULL CHECK(status IN('OPEN','CONFIRMED_DUPLICATE','NOT_DUPLICATE','RESOLVED')),created_at TEXT NOT NULL,reviewed_at TEXT,reviewed_by TEXT,CHECK(left_product_id<>right_product_id)
);
CREATE UNIQUE INDEX idx_duplicate_pair ON duplicate_candidates(left_product_id,right_product_id);
