PRAGMA foreign_keys=ON;

CREATE TABLE campaigns(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 campaign_type TEXT NOT NULL CHECK(campaign_type IN('SPONSORED_PRODUCT','SPONSORED_SUPPLIER','BANNER','PROMOTION')),
 owner_organization_id TEXT,
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','SCHEDULED','ACTIVE','PAUSED','ENDED','ARCHIVED')),
 starts_at TEXT,
 ends_at TEXT,
 budget_minor INTEGER,
 currency TEXT,
 rules_json TEXT NOT NULL DEFAULT '{}',
 created_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE campaign_placements(
 id TEXT PRIMARY KEY,
 campaign_id TEXT NOT NULL REFERENCES campaigns(id),
 surface TEXT NOT NULL,
 slot_key TEXT NOT NULL,
 sponsored_label TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('ACTIVE','INACTIVE','ARCHIVED')),
 created_at TEXT NOT NULL,
 UNIQUE(campaign_id,surface,slot_key)
);

CREATE TABLE radar_observations(
 id TEXT PRIMARY KEY,
 observation_type TEXT NOT NULL CHECK(observation_type IN('PRICE_SIGNAL','STOCK_SIGNAL','SEARCH_SIGNAL','DEMAND_SIGNAL')),
 subject_type TEXT NOT NULL,
 subject_id TEXT NOT NULL,
 metric_key TEXT NOT NULL,
 metric_value REAL NOT NULL,
 window_start TEXT,
 window_end TEXT,
 evidence_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL
);

CREATE INDEX idx_campaign_status ON campaigns(status,starts_at,ends_at);
CREATE INDEX idx_radar_subject ON radar_observations(subject_type,subject_id,created_at);
