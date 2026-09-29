import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("phase4 stock and reservation schema persists invariants in SQLite",async t=>{
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
    await db.run("INSERT INTO stock_locations(id,organization_id,name,location_type,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["l",supplier.id,"Ana Depo","WAREHOUSE","ACTIVE",now,now]);
    await db.run("INSERT INTO stock_balances(id,stock_location_id,supplier_offer_id,on_hand_qty,reserved_qty,version,updated_at) VALUES(?,?,?,?,?,?,?)",["b","l","o",10,3,1,now]);
    assert.equal((await db.all("SELECT on_hand_qty-reserved_qty available FROM stock_balances WHERE id='b'"))[0].available,7);
  }finally{driver.close();}
});
