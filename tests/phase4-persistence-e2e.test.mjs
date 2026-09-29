import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("phase4 pricing tax delivery data persists in SQLite",async t=>{
  let driver;
  try{driver=await openNodeSqlite(":memory:");}catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
  try{
    const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);
    await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-29T00:00:00.000Z");
    const now="2026-09-29T08:00:00.000Z";
    const supplier=(await db.all("SELECT id FROM suppliers LIMIT 1"))[0];
    if(!supplier)return t.skip("no seeded supplier");

    await db.run("INSERT INTO master_products(id,product_key,name,base_unit,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["p","p1","Ürün","KG","PUBLISHED",1,now,now]);
    await db.run("INSERT INTO supplier_offers(id,supplier_id,master_product_id,offer_status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["o",supplier.id,"p","ACTIVE",now,now]);

    await db.run("INSERT INTO tax_profiles(id,name,country_code,tax_rate_bps,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["t","KDV %20","TR",2000,"ACTIVE",now,now]);
    await db.run("INSERT INTO price_books(id,name,currency,status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["pb","Ana Liste","TRY","ACTIVE",now,now]);
    await db.run("INSERT INTO supplier_offer_prices(id,supplier_offer_id,price_book_id,tax_profile_id,unit_price_minor,currency,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",["op","o","pb","t",12500,"TRY","ACTIVE",1,now,now]);

    await db.run("INSERT INTO delivery_zones(id,organization_id,name,zone_code,status,rules_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["z",supplier.id,"İstanbul Avrupa","IST-AVR","ACTIVE","{}",now,now]);
    await db.run("INSERT INTO delivery_calendars(id,organization_id,name,timezone,weekly_schedule_json,exception_days_json,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["c",supplier.id,"Hafta İçi","Europe/Istanbul","{}","[]","ACTIVE",now,now]);
    await db.run("INSERT INTO delivery_slas(id,organization_id,delivery_zone_id,delivery_calendar_id,name,min_lead_minutes,max_lead_minutes,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",["s",supplier.id,"z","c","Standart",120,1440,"ACTIVE",now,now]);

    const price=(await db.all("SELECT unit_price_minor,currency FROM supplier_offer_prices WHERE id='op'"))[0];
    const sla=(await db.all("SELECT min_lead_minutes,max_lead_minutes FROM delivery_slas WHERE id='s'"))[0];
    assert.deepEqual(price,{unit_price_minor:12500,currency:"TRY"});
    assert.deepEqual(sla,{min_lead_minutes:120,max_lead_minutes:1440});
  }finally{driver.close();}
});
