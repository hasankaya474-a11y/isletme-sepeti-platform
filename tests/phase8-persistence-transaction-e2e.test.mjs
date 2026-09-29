import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("order and outbox participate in one SQLite transaction",async t=>{
 let driver;try{driver=await openNodeSqlite(":memory:");}catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
 try{
  const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-29T00:00:00.000Z");
  const now="2026-09-29T12:00:00.000Z";
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cb","Buyer","ACTIVE",now,now]);
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cs","Supplier","ACTIVE",now,now]);
  await db.run("INSERT INTO businesses(id,company_id,status,created_at,updated_at) VALUES(?,?,?,?,?)",["b","cb","ACTIVE",now,now]);
  await db.run("INSERT INTO suppliers(id,company_id,verification_status,status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["s","cs","VERIFIED","ACTIVE",now,now]);
  await db.run("INSERT INTO carts(id,business_id,name,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["c","b","Sepet","PO_READY","u",now,now]);
  await db.run("INSERT INTO purchase_requisitions(id,cart_id,business_id,status,currency,estimated_net_minor,estimated_tax_minor,estimated_gross_minor,requested_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",["r","c","b","PO_READY","TRY",100,20,120,"u",now,now]);

  await assert.rejects(db.transaction(async()=>{
    await db.run("INSERT INTO orders(id,business_id,supplier_id,requisition_id,state,currency,net_minor,tax_minor,gross_minor,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",["o1","b","s","r","NEW","TRY",100,20,120,"u",now,now]);
    await db.run("INSERT INTO outbox_events(id,aggregate_type,aggregate_id,event_type,payload_json,status,attempts,created_at) VALUES(?,?,?,?,?,?,?,?)",["e1","order","o1","order.created","{}","PENDING",0,now]);
    throw new Error("ROLLBACK");
  }),/ROLLBACK/);
  assert.equal((await db.all("SELECT COUNT(*) n FROM orders"))[0].n,0);
  assert.equal((await db.all("SELECT COUNT(*) n FROM outbox_events"))[0].n,0);

  await db.transaction(async()=>{
    await db.run("INSERT INTO orders(id,business_id,supplier_id,requisition_id,state,currency,net_minor,tax_minor,gross_minor,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",["o2","b","s","r","NEW","TRY",100,20,120,"u",now,now]);
    await db.run("INSERT INTO order_snapshots(id,order_id,snapshot_json,snapshot_sha256,created_at) VALUES(?,?,?,?,?)",["snap","o2","{}", "a".repeat(64),now]);
    await db.run("INSERT INTO outbox_events(id,aggregate_type,aggregate_id,event_type,payload_json,status,attempts,created_at) VALUES(?,?,?,?,?,?,?,?)",["e2","order","o2","order.created","{}","PENDING",0,now]);
    await db.run("INSERT INTO idempotency_records(id,scope_type,scope_id,idempotency_key,operation,resource_type,response_json,created_at) VALUES(?,?,?,?,?,?,?,?)",["i","BUSINESS","b","key","order.create_from_requisition","order_batch","{}",now]);
  });
  assert.equal((await db.all("SELECT COUNT(*) n FROM orders"))[0].n,1);
  assert.equal((await db.all("SELECT COUNT(*) n FROM outbox_events"))[0].n,1);
  assert.equal((await db.all("SELECT COUNT(*) n FROM order_snapshots"))[0].n,1);
 }finally{driver.close();}
});
