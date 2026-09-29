import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

test("phase5 search list and matching schema persists review-first flow",async t=>{
 let driver;
 try{driver=await openNodeSqlite(":memory:");}catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
 try{
  const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);
  await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-29T00:00:00.000Z");
  const now="2026-09-29T09:00:00.000Z";
  const business=(await db.all("SELECT id FROM businesses LIMIT 1"))[0];
  if(!business)return t.skip("no seeded business");
  await db.run("INSERT INTO master_products(id,product_key,name,base_unit,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["p","patates","Donuk Patates","KG","PUBLISHED",1,now,now]);
  await db.run("INSERT INTO search_synonyms(id,term,synonym,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["s","patates","donuk patates","ACTIVE","admin",now,now]);
  await db.run("INSERT INTO buyer_saved_lists(id,business_id,name,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",["l",business.id,"Haftalık","ACTIVE","u",now,now]);
  await db.run("INSERT INTO matching_requests(id,business_id,source_type,source_text,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["r",business.id,"TEXT_LIST","donuk patates","REVIEW","u",now,now]);
  await db.run("INSERT INTO matching_candidates(id,matching_request_id,source_line,master_product_id,confidence,reason_json,decision) VALUES(?,?,?,?,?,?,?)",["c","r","donuk patates","p",0.9,"{}","PENDING"]);
  const candidate=(await db.all("SELECT decision,confidence FROM matching_candidates WHERE id='c'"))[0];
  assert.deepEqual(candidate,{decision:"PENDING",confidence:0.9});
 }finally{driver.close();}
});
