import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("phase10 invoice match agreements and evidence persist in SQLite",async t=>{
 let driver;try{driver=await openNodeSqlite(":memory:");}catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
 try{
  const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-29T00:00:00.000Z");
  const now="2026-09-29T14:00:00.000Z";
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cb","Buyer","ACTIVE",now,now]);
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cs","Supplier","ACTIVE",now,now]);
  await db.run("INSERT INTO businesses(id,company_id,status,created_at,updated_at) VALUES(?,?,?,?,?)",["b","cb","ACTIVE",now,now]);
  await db.run("INSERT INTO suppliers(id,company_id,verification_status,status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["s","cs","VERIFIED","ACTIVE",now,now]);
  await db.run("INSERT INTO carts(id,business_id,name,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["c","b","Sepet","PO_READY","u",now,now]);
  await db.run("INSERT INTO purchase_requisitions(id,cart_id,business_id,status,currency,estimated_net_minor,estimated_tax_minor,estimated_gross_minor,requested_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",["r","c","b","PO_READY","TRY",1000,200,1200,"u",now,now]);
  await db.run("INSERT INTO orders(id,business_id,supplier_id,requisition_id,state,currency,net_minor,tax_minor,gross_minor,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",["o","b","s","r","DELIVERED","TRY",1000,200,1200,"u",now,now]);
  await db.run("INSERT INTO master_products(id,product_key,name,base_unit,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["p","p","Ürün","KG","PUBLISHED",1,now,now]);
  await db.run("INSERT INTO order_lines(id,order_id,master_product_id,quantity_milli,unit_price_minor,tax_rate_bps,net_minor,tax_minor,gross_minor,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",["ol","o","p",1000,1000,2000,1000,200,1200,now]);
  await db.run("INSERT INTO order_snapshots(id,order_id,snapshot_json,snapshot_sha256,created_at) VALUES(?,?,?,?,?)",["snap","o","{}","a".repeat(64),now]);
  await db.run("INSERT INTO supplier_invoices(id,order_id,business_id,supplier_id,invoice_number,issue_date,currency,status,net_minor,tax_minor,gross_minor,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",["i","o","b","s","F1","2026-09-29","TRY","MATCHED",1000,200,1200,"u",now,now]);
  await db.run("INSERT INTO invoice_lines(id,invoice_id,order_line_id,quantity_milli,unit_price_minor,tax_rate_bps,net_minor,tax_minor,gross_minor,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",["il","i","ol",1000,1000,2000,1000,200,1200,now]);
  await db.run("INSERT INTO three_way_matches(id,invoice_id,status,issues_json,order_snapshot_sha256,matched_at,matched_by) VALUES(?,?,?,?,?,?,?)",["m","i","MATCHED","[]","a".repeat(64),now,"u"]);
  await db.run("INSERT INTO commercial_agreements(id,business_id,supplier_id,name,currency,terms_json,status,version,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",["a","b","s","Anlaşma","TRY","{}","ACTIVE",2,"u",now,now]);
  await db.run("INSERT INTO agreement_acceptances(id,agreement_id,party_type,party_id,accepted_by,accepted_at) VALUES(?,?,?,?,?,?)",["ab","a","BUSINESS","b","u",now]);
  await db.run("INSERT INTO agreement_acceptances(id,agreement_id,party_type,party_id,accepted_by,accepted_at) VALUES(?,?,?,?,?,?)",["as","a","SUPPLIER","s","u",now]);
  await db.run("INSERT INTO commercial_evidence(id,entity_type,entity_id,evidence_type,evidence_sha256,metadata_json,created_by,created_at) VALUES(?,?,?,?,?,?,?,?)",["e","invoice","i","PDF","hash","{}","u",now]);
  assert.equal((await db.all("SELECT status FROM three_way_matches WHERE invoice_id='i'"))[0].status,"MATCHED");
  assert.equal((await db.all("SELECT COUNT(*) n FROM agreement_acceptances WHERE agreement_id='a'"))[0].n,2);
  assert.equal((await db.all("SELECT COUNT(*) n FROM commercial_evidence WHERE entity_id='i'"))[0].n,1);
 }finally{driver.close();}
});
