import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("phase9 delivery receiving and RMA schema persists invariants",async t=>{
 let driver;try{driver=await openNodeSqlite(":memory:");}catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
 try{
  const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-29T00:00:00.000Z");
  const now="2026-09-29T13:00:00.000Z";
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cb","Buyer","ACTIVE",now,now]);
  await db.run("INSERT INTO companies(id,legal_name,status,created_at,updated_at) VALUES(?,?,?,?,?)",["cs","Supplier","ACTIVE",now,now]);
  await db.run("INSERT INTO businesses(id,company_id,status,created_at,updated_at) VALUES(?,?,?,?,?)",["b","cb","ACTIVE",now,now]);
  await db.run("INSERT INTO suppliers(id,company_id,verification_status,status,created_at,updated_at) VALUES(?,?,?,?,?,?)",["s","cs","VERIFIED","ACTIVE",now,now]);
  await db.run("INSERT INTO carts(id,business_id,name,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["c","b","Sepet","PO_READY","u",now,now]);
  await db.run("INSERT INTO purchase_requisitions(id,cart_id,business_id,status,currency,estimated_net_minor,estimated_tax_minor,estimated_gross_minor,requested_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",["r","c","b","PO_READY","TRY",100,20,120,"u",now,now]);
  await db.run("INSERT INTO orders(id,business_id,supplier_id,requisition_id,state,currency,net_minor,tax_minor,gross_minor,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",["o","b","s","r","SHIPPED","TRY",100,20,120,"u",now,now]);
  await db.run("INSERT INTO master_products(id,product_key,name,base_unit,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["p","p","Ürün","KG","PUBLISHED",1,now,now]);
  await db.run("INSERT INTO order_lines(id,order_id,master_product_id,quantity_milli,unit_price_minor,tax_rate_bps,net_minor,tax_minor,gross_minor,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",["ol","o","p",1000,100,2000,100,20,120,now]);
  await db.run("INSERT INTO delivery_capacity_slots(id,supplier_id,slot_start,slot_end,capacity_units,reserved_units,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["slot","s",now,"2026-09-29T15:00:00.000Z",1,1,"OPEN",now,now]);
  await db.run("INSERT INTO deliveries(id,order_id,business_id,supplier_id,capacity_slot_id,status,eta_at,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",["d","o","b","s","slot","IN_TRANSIT","2026-09-29T14:00:00.000Z","u",now,now]);
  await db.run("INSERT INTO delivery_items(id,delivery_id,order_line_id,planned_qty_milli,delivered_qty_milli) VALUES(?,?,?,?,?)",["di","d","ol",1000,1000]);
  await db.run("INSERT INTO receivings(id,delivery_id,business_id,status,received_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["recv","d","b","COMPLETED","u",now,now]);
  await db.run("INSERT INTO receiving_lines(id,receiving_id,delivery_item_id,accepted_qty_milli,rejected_qty_milli,created_at) VALUES(?,?,?,?,?,?)",["rl","recv","di",1000,0,now]);
  await db.run("INSERT INTO return_rmas(id,order_id,business_id,supplier_id,status,reason,requested_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["rma","o","b","s","REQUESTED","Hasarlı","u",now,now]);
  await db.run("INSERT INTO return_rma_lines(id,rma_id,order_line_id,quantity_milli,created_at) VALUES(?,?,?,?,?)",["rmal","rma","ol",500,now]);
  assert.equal((await db.all("SELECT reserved_units FROM delivery_capacity_slots WHERE id='slot'"))[0].reserved_units,1);
  assert.equal((await db.all("SELECT status FROM return_rmas WHERE id='rma'"))[0].status,"REQUESTED");
  await assert.rejects(db.run("UPDATE delivery_capacity_slots SET reserved_units=2 WHERE id='slot'"));
 }finally{driver.close();}
});
