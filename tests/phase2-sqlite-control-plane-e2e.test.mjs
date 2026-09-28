import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {openNodeSqlite} from "../packages/core/src/sqlite-driver.mjs";
import {SqliteAdapter} from "../packages/core/src/sqlite-adapter.mjs";
import {MigrationRunner} from "../packages/core/src/migration-runner.mjs";
import {loadMigrations} from "../packages/core/src/migration-loader.mjs";

async function withDb(t,fn){
  let driver;
  try{driver=await openNodeSqlite(":memory:");}
  catch(e){if(e.message==="NODE_SQLITE_UNAVAILABLE")return t.skip("node:sqlite unavailable");throw e;}
  try{
    const db=new SqliteAdapter(driver),runner=new MigrationRunner(db);
    await runner.run(await loadMigrations(resolve("database/migrations")),"2026-09-28T00:00:00.000Z");
    await fn(db);
  }finally{driver.close();}
}

test("phase2 control-plane state persists in real SQLite",async t=>withDb(t,async db=>{
  const now="2026-09-28T12:00:00.000Z";
  await db.run("INSERT INTO configurations(id,key,scope_type,scope_id,value_json,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["cfg1","homepage.items","GLOBAL",null,"10","PUBLISHED",1,now,now]);
  await db.run("INSERT INTO feature_flags(id,key,description,enabled,scope_type,scope_id,rollout_percent,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["ff1","pilot","Pilot",1,"GLOBAL",null,25,now,now]);
  await db.run("INSERT INTO content_entries(id,content_key,content_type,locale,status,current_version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["c1","home.hero","TEXT","tr-TR","PUBLISHED",1,now,now]);
  await db.run("INSERT INTO content_versions(id,content_id,version,payload_json,created_by,created_at) VALUES(?,?,?,?,?,?)",["cv1","c1",1,'{"title":"Merhaba"}',"admin",now]);
  await db.run("INSERT INTO help_articles(id,help_key,title,body,context_route,role_scope,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",["h1","buyer.cart","Sepet","Yardım","/cart","BUYER","PUBLISHED",1,now,now]);
  assert.equal((await db.all("SELECT status FROM configurations WHERE id='cfg1'"))[0].status,"PUBLISHED");
  assert.equal((await db.all("SELECT rollout_percent FROM feature_flags WHERE id='ff1'"))[0].rollout_percent,25);
  assert.equal((await db.all("SELECT current_version FROM content_entries WHERE id='c1'"))[0].current_version,1);
  assert.equal((await db.all("SELECT status FROM help_articles WHERE id='h1'"))[0].status,"PUBLISHED");
}));

test("scheduled unpublish data persists with publish job",async t=>withDb(t,async db=>{
  const now="2026-09-28T12:00:00.000Z",later="2026-10-01T18:00:00.000Z";
  await db.run("INSERT INTO content_entries(id,content_key,content_type,locale,status,current_version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",["c2","campaign.banner","BANNER","tr-TR","SCHEDULED",1,now,now]);
  await db.run("INSERT INTO publish_jobs(id,resource_type,resource_id,publish_at,unpublish_at,status,created_by,created_at) VALUES(?,?,?,?,?,?,?,?)",["job1","content","c2",now,later,"SCHEDULED","admin",now]);
  const row=(await db.all("SELECT publish_at,unpublish_at,status FROM publish_jobs WHERE id='job1'"))[0];
  assert.equal(row.unpublish_at,later);
  assert.equal(row.status,"SCHEDULED");
}));

test("vitrin, media security and redirects persist in real SQLite",async t=>withDb(t,async db=>{
  const now="2026-09-28T12:00:00.000Z";
  await db.run("INSERT INTO pages(id,page_key,title,slug,status,seo_json,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["p1","home","Ana Sayfa","ana-sayfa","DRAFT","{}",1,now,now]);
  await db.run("INSERT INTO page_blocks(id,page_id,block_type,position,content_json,visibility_json,schedule_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",["b1","p1","HERO",0,'{"title":"Hero"}',"{}","{}",now,now]);
  await db.run("INSERT INTO media_assets(id,kind,file_ref,alt_text,status,created_at,updated_at,scan_status,content_hash) VALUES(?,?,?,?,?,?,?,?,?)",["m1","IMAGE","asset.webp","Ürün","ACTIVE",now,now,"CLEAN","abc"]);
  await db.run("INSERT INTO redirects(id,from_path,to_path,status_code,active,created_at) VALUES(?,?,?,?,?,?)",["r1","/eski","/yeni",301,1,now]);
  assert.equal((await db.all("SELECT block_type FROM page_blocks WHERE page_id='p1'"))[0].block_type,"HERO");
  assert.equal((await db.all("SELECT scan_status FROM media_assets WHERE id='m1'"))[0].scan_status,"CLEAN");
  assert.equal((await db.all("SELECT status_code FROM redirects WHERE id='r1'"))[0].status_code,301);
}));
