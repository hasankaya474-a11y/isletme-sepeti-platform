import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("phase6 RFQ quote and message data persists in SQLite",async t=>{
 let driver;try{driver=await openNodeSqlite(":memory:");}catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
 try{
  const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-29T00:00:00.000Z");
  const now="2026-09-29T10:00:00.000Z";
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cb","Buyer Ltd","ACTIVE",now,now]);
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cs","Supplier Ltd","ACTIVE",now,now]);
  await db.run("INSERT INTO businesses(id,company_id,status,created_at,updated_at) VALUES(?,?,?,?,?)",["b","cb","ACTIVE",now,now]);
  await db.run("INSERT INTO suppliers(id,company_id,verification_status,status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["s","cs","VERIFIED","ACTIVE",now,now]);
  await db.run("INSERT INTO master_products(id,product_key,name,base_unit,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["p","patates","Patates","KG","PUBLISHED",1,now,now]);
  await db.run("INSERT INTO rfqs(id,business_id,title,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["r","b","Haftalık","OPEN","u",now,now]);
  await db.run("INSERT INTO rfq_lines(id,rfq_id,master_product_id,quantity_milli,unit,created_at) VALUES(?,?,?,?,?,?)",["l","r","p",10000,"KG",now]);
  await db.run("INSERT INTO rfq_invitations(id,rfq_id,supplier_id,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["i","r","s","RESPONDED","u",now,now]);
  await db.run("INSERT INTO quotes(id,rfq_id,supplier_id,status,currency,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["q","r","s","SUBMITTED","TRY","u",now,now]);
  await db.run("INSERT INTO quote_lines(id,quote_id,rfq_line_id,unit_price_minor,tax_rate_bps,created_at) VALUES(?,?,?,?,?,?)",["ql","q","l",1000,2000,now]);
  await db.run("INSERT INTO rfq_messages(id,rfq_id,sender_org_type,sender_org_id,sender_user_id,body,message_type,created_at) VALUES(?,?,?,?,?,?,?,?)",["m","r","SUPPLIER","s","u","Hazır","TEXT",now]);
  assert.equal((await db.all("SELECT COUNT(*) n FROM quotes WHERE rfq_id='r' AND status='SUBMITTED'"))[0].n,1);
  assert.equal((await db.all("SELECT COUNT(*) n FROM rfq_messages WHERE rfq_id='r'"))[0].n,1);
 }finally{driver.close();}
});
