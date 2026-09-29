PRAGMA foreign_keys=ON;

CREATE TABLE delivery_zones(
 id TEXT PRIMARY KEY,
 organization_id TEXT NOT NULL,
 name TEXT NOT NULL,
 zone_code TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 rules_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(organization_id,zone_code)
);

CREATE TABLE delivery_calendars(
 id TEXT PRIMARY KEY,
 organization_id TEXT NOT NULL,
 name TEXT NOT NULL,
 timezone TEXT NOT NULL,
 weekly_schedule_json TEXT NOT NULL DEFAULT '{}',
 exception_days_json TEXT NOT NULL DEFAULT '[]',
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE delivery_slas(
 id TEXT PRIMARY KEY,
 organization_id TEXT NOT NULL,
 delivery_zone_id TEXT REFERENCES delivery_zones(id),
 delivery_calendar_id TEXT REFERENCES delivery_calendars(id),
 name TEXT NOT NULL,
 cutoff_local_time TEXT,
 min_lead_minutes INTEGER NOT NULL CHECK(min_lead_minutes >= 0),
 max_lead_minutes INTEGER CHECK(max_lead_minutes IS NULL OR max_lead_minutes >= min_lead_minutes),
 status TEXT NOT NULL CHECK(status IN('DRAFT','REVIEW','ACTIVE','INACTIVE','ARCHIVED')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE INDEX idx_delivery_zones_org ON delivery_zones(organization_id,status);
CREATE INDEX idx_delivery_sla_zone ON delivery_slas(delivery_zone_id,status);
