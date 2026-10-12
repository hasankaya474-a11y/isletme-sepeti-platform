import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

export class MockD1 {
  constructor(){this.sqlite=new DatabaseSync(':memory:');this.batches=[];this.failPattern=null;this.beforeBatch=null;}
  prepare(sql){const DB=this;return {sql,args:[],bind(...args){this.args=args;return this},async all(){return {results:DB.sqlite.prepare(sql).all(...this.args)}},async first(column){const row=DB.sqlite.prepare(sql).get(...this.args);return column?row?.[column]:row||null},async run(){if(DB.failPattern?.test(sql))throw Error('Injected SQLite/D1 failure');return {success:true,meta:DB.sqlite.prepare(sql).run(...this.args)}}};}
  async batch(statements){if(this.beforeBatch)this.beforeBatch(statements);this.sqlite.exec('BEGIN');try{const rows=[];for(const statement of statements)rows.push(await statement.run());this.sqlite.exec('COMMIT');this.batches.push(statements.map(x=>x.sql));return rows;}catch(error){this.sqlite.exec('ROLLBACK');throw error}}
  async exec(sql){this.sqlite.exec(sql);return {count:1,duration:0}}
  rows(sql,args=[]){return this.sqlite.prepare(sql).all(...args).map(x=>({...x}))}
}

export function loadSnippet(path,bindings={}){
 const context=vm.createContext({...bindings,console,crypto:globalThis.crypto,WeakMap,Map,Set,URL,Response,Request,Date});
 vm.runInContext(fs.readFileSync(path,'utf8'),context,{filename:path});return context;
}

export const canonicalPath=new URL('../src/deniz-worker.js',import.meta.url);
export function migrationPrelude(){const full=fs.readFileSync(canonicalPath,'utf8');const end=full.indexOf('const OKY_IMPORTED_CATALOG');assert.ok(end>0);return full.slice(0,end)}
export function migrationContext(){const context=vm.createContext({console,crypto:globalThis.crypto,WeakMap,Map,Set,URL,Response,Request,Date});vm.runInContext(migrationPrelude(),context);return context}
if(process.argv[1]===new URL(import.meta.url).pathname){
const ctx=migrationContext();
const source=JSON.parse(vm.runInContext('JSON.stringify(OKY_EDT_SOURCE_CATALOG)',ctx));
const sea=JSON.parse(vm.runInContext('JSON.stringify(OKY_EDT_SEAFOOD_SNAPSHOT)',ctx));
const ddl=vm.runInContext('['+migrationPrelude().split('const ddl=[')[1].split('];for(const sql of ddl)')[0]+']',ctx);
function setup(seed=true){const db=new MockD1();for(const sql of ddl)db.sqlite.exec(sql.replace(/(oky_brands_v1\([^;]*?)slug TEXT,/,'$1slug TEXT NOT NULL UNIQUE,'));
 if(seed){for(const p of sea.products){db.sqlite.prepare('INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,image_url) VALUES(?,?,?,?,?,?)').run(p.id,p.source_product_id||p.id,p.name,p.category,p.unit||'Kg',p.image||'');db.sqlite.prepare('INSERT INTO b2b_prices_v1(id,product_id,price) VALUES(?,?,?)').run('live-'+p.id,p.id,123.45);db.sqlite.prepare('INSERT INTO oky_product_meta_v1(product_id,description,featured) VALUES(?,?,?)').run(p.id,'Live seafood description',1);}
 db.sqlite.exec("INSERT INTO b2b_products_v1(id,name,category,image_url) VALUES('old-nonsea','Obsolete potato','OLD-CATEGORY','old.jpg');INSERT INTO b2b_prices_v1(id,product_id,price) VALUES('oldprice','old-nonsea',999);INSERT INTO oky_product_meta_v1(product_id,description,featured) VALUES('old-nonsea','Old description',1);INSERT INTO oky_storefront_categories_v1(id,name,slug) VALUES('old-category','OLD-CATEGORY','old-category');CREATE TABLE b2b_quote_items_v1(id TEXT PRIMARY KEY,product_id TEXT,product_name TEXT);INSERT INTO b2b_quote_items_v1 VALUES('history','old-nonsea','Obsolete potato');");}
 return db;}
function snapshot(db){return Object.fromEntries(['b2b_products_v1','b2b_prices_v1','oky_product_meta_v1'].map(t=>[t,db.rows('SELECT * FROM '+t+' ORDER BY 1')]))}
function assertCatalog(db){const rows=db.rows('SELECT p.*,pr.price,m.description,m.featured,c.sku,c.subcategory FROM b2b_products_v1 p LEFT JOIN b2b_prices_v1 pr ON pr.id=\'edt-initial-\'||p.id LEFT JOIN oky_product_meta_v1 m ON m.product_id=p.id LEFT JOIN oky_product_commerce_v1 c ON c.product_id=p.id');assert.equal(rows.length,833);const lookup=new Map(rows.map(p=>[p.id,p]));for(const p of source){const got=lookup.get(p.id);assert.ok(got,p.id);for(const [a,b]of [['name','name'],['image_url','image'],['price','price'],['description','description'],['category','category'],['sku','code'],['subcategory','subcategory']])assert.equal(got[a],p[b],p.id+':'+a);assert.equal(got.featured,0)}assert.equal(db.rows("SELECT * FROM b2b_products_v1 WHERE id='old-nonsea'").length,0);assert.equal(db.rows("SELECT * FROM oky_storefront_categories_v1 WHERE id='old-category'").length,0);assert.equal(new Set(rows.map(x=>x.id)).size,833)}
const db=setup();const beforeSea=snapshot(db);let intermediate=false;
const oldPrepare=db.prepare.bind(db);db.prepare=(sql)=>{const stmt=oldPrepare(sql);const run=stmt.run.bind(stmt);stmt.run=async()=>{const out=await run();if(sql.startsWith('DELETE FROM b2b_products_v1 ')){assert.equal(db.rows('SELECT * FROM b2b_products_v1').length,44);assert.equal(db.rows("SELECT * FROM b2b_products_v1 WHERE id='old-nonsea'").length,0);intermediate=true}return out};return stmt};
await ctx.okyEnsureEdtCatalog({},db,[]);assert.ok(intermediate);assertCatalog(db);for(const [t,rows]of Object.entries(beforeSea))for(const row of rows.filter(x=>(x.product_id||x.id)!=='old-nonsea'&&x.id!=='oldprice'))assert.deepEqual(db.rows('SELECT * FROM '+t+' WHERE '+(t==='b2b_products_v1'?'id':'product_id')+'=?',[row.product_id||row.id])[0],row);
assert.equal(db.rows('SELECT * FROM b2b_quote_items_v1').length,1);
db.sqlite.exec("UPDATE b2b_products_v1 SET name='Admin changed' WHERE id='edt_106';UPDATE b2b_prices_v1 SET price=777 WHERE product_id='edt_106';UPDATE oky_product_meta_v1 SET featured=1 WHERE product_id='edt_106';");await ctx.okyEnsureEdtCatalog({},db,[]);assert.equal(db.rows("SELECT name FROM b2b_products_v1 WHERE id='edt_106'")[0].name,'Admin changed');assert.equal(db.rows("SELECT price FROM b2b_prices_v1 WHERE product_id='edt_106'")[0].price,777);assert.equal(db.rows('SELECT * FROM b2b_products_v1').length,833);
const empty=setup(false);await ctx.okyEnsureEdtCatalog({},empty,[]);assertCatalog(empty);
const rollback=setup();const rollbackBefore=snapshot(rollback);rollback.failPattern=/INSERT(?: OR IGNORE)? INTO oky_edt_migration_checks_v1/;await assert.rejects(ctx.okyEnsureEdtCatalog({},rollback,[]),/Injected/);assert.deepEqual(snapshot(rollback),rollbackBefore);assert.equal(rollback.rows('SELECT * FROM oky_catalog_import_batches_v1').length,0);rollback.failPattern=null;await ctx.okyEnsureEdtCatalog({},rollback,[]);assertCatalog(rollback);
const concurrent=setup();await Promise.all([ctx.okyEnsureEdtCatalog({},concurrent,[]),ctx.okyEnsureEdtCatalog({},concurrent,[])]);assert.equal(concurrent.batches.length,1);assertCatalog(concurrent);
const corrupt=setup();const corruptBefore=snapshot(corrupt);let sabotaged=false;const corruptPrepare=corrupt.prepare.bind(corrupt);corrupt.prepare=(sql)=>{const stmt=corruptPrepare(sql);const run=stmt.run.bind(stmt);stmt.run=async()=>{const out=await run();if(!sabotaged&&sql.startsWith('INSERT OR IGNORE INTO b2b_products_v1')&&corrupt.rows("SELECT * FROM b2b_products_v1 WHERE id='edt_106'").length){corrupt.sqlite.exec("DELETE FROM b2b_products_v1 WHERE id='edt_106'");sabotaged=true}return out};return stmt};await assert.rejects(ctx.okyEnsureEdtCatalog({},corrupt,[]));assert.ok(sabotaged);assert.deepEqual(snapshot(corrupt),corruptBefore,'Corruption guard must rollback ALL deletions, rather than just omit completion marker');assert.equal(corrupt.rows('SELECT * FROM oky_catalog_import_batches_v1').length,0);
console.log(JSON.stringify({passed:true,checks:['intermediate seafood-only44','final833','exact source789 fields','seafood live edits preserved','obsolete products/categories removed','historical quote retained','unfeatured imports','idempotence/admin edits','empty DB restore44','atomic rollback/retry','concurrent calls single batch','CHECK corruption guard rollback','brand slug NOT NULL UNIQUE compatibility']},null,2));

}
