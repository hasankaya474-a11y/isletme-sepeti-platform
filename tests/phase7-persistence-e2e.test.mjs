import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("phase7 cart requisition and approval persist in SQLite",async t=>{
 let driver;try{driver=await openNodeSqlite(":memory:");}catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
 try{
  const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-29T00:00:00.000Z");
  const now="2026-09-29T11:00:00.000Z";
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cb","Buyer","ACTIVE",now,now]);
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cs","Supplier","ACTIVE",now,now]);
  await db.run("INSERT INTO businesses(id,company_id,status,created_at,updated_at) VALUES(?,?,?,?,?)",["b","cb","ACTIVE",now,now]);
  await db.run("INSERT INTO suppliers(id,company_id,verification_status,status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["s","cs","VERIFIED","ACTIVE",now,now]);
  await db.run("INSERT INTO master_products(id,product_key,name,base_unit,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["p","p","Ürün","KG","PUBLISHED",1,now,now]);
  await db.run("INSERT INTO supplier_offers(id,supplier_id,master_product_id,offer_status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["o","s","p","ACTIVE",now,now]);
  await db.run("INSERT INTO procurement_approval_rules(id,business_id,name,currency,threshold_minor,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["rule","b","Kural","TRY",10000,"ACTIVE","u",now,now]);
  await db.run("INSERT INTO carts(id,business_id,name,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["c","b","Sepet","PENDING_APPROVAL","u",now,now]);
  await db.run("INSERT INTO cart_lines(id,cart_id,master_product_id,supplier_id,supplier_offer_id,quantity_milli,unit_price_minor,currency,tax_rate_bps,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",["cl","c","p","s","o",10000,1000,"TRY",2000,"ACTIVE",now,now]);
  await db.run("INSERT INTO purchase_requisitions(id,cart_id,business_id,status,currency,estimated_net_minor,estimated_tax_minor,estimated_gross_minor,requested_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",["r","c","b","PENDING_APPROVAL","TRY",10000,2000,12000,"u",now,now]);
  await db.run("INSERT INTO procurement_approvals(id,requisition_id,status,requested_by,created_at) VALUES(?,?,?,?,?)",["a","r","PENDING","u",now]);
  assert.equal((await db.all("SELECT status FROM purchase_requisitions WHERE id='r'"))[0].status,"PENDING_APPROVAL");
  assert.equal((await db.all("SELECT status FROM procurement_approvals WHERE id='a'"))[0].status,"PENDING");
 }finally{driver.close();}
});
