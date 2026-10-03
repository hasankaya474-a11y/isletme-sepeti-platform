import assert from 'node:assert/strict';import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';import {pathToFileURL} from 'node:url';
class D1 {
 constructor(){this.db=new DatabaseSync(':memory:');this.queries=[]}
 prepare(sql){const owner=this;let values=[];return {bind(...args){values=args;return this},async first(column){owner.queries.push(sql);const row=owner.db.prepare(sql).get(...values);return column?row?.[column]:row||null},async all(){owner.queries.push(sql);return {success:true,results:owner.db.prepare(sql).all(...values)}},async run(){owner.queries.push(sql);const r=owner.db.prepare(sql).run(...values);return {success:true,meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}}}}
 async batch(items){this.db.exec('BEGIN');try{const out=[];for(const item of items)out.push(await item.run());this.db.exec('COMMIT');return out}catch(e){this.db.exec('ROLLBACK');throw e}}
}

const deniz=(await import(pathToFileURL(process.argv[2]||'repo/okyonus-edt-worker/releases/r43/deniz.mjs'))).default;
const source=fs.readFileSync(process.argv[3]||'repo/okyonus-edt-worker/releases/r41/zaman.mjs','utf8');
const {commerceAdminApi}=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {commerceAdminApi};').toString('base64'));
const db=new D1(),env={DB:db,ADMIN_DB:db},owner={user:{role:'owner',id:'test-owner'}};
const req=(route,method='GET',body)=>new Request('https://www.okyonusedt.com'+route,{method,...(body!==undefined?{headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})});
const call=(route,body,role=owner)=>commerceAdminApi(req('/api/commerce/'+route,body===undefined?'GET':'POST',body),env,role,new Headers());
async function storefront(){return(await deniz.fetch(req('/api/storefront-v2'),env,{})).json()}
await call('summary');
async function get(id){return(await storefront()).products.find(p=>p.id===id)}
let response=await call('products',{name:'SQLite test product',category:'Deniz Ürünleri',unit:'Kg',packageText:'1 kg',imageUrl:'https://example.com/a.webp',description:'First description',price:125,listPrice:150,salePrice:100,featured:true,active:true});assert.equal(response.status,201);const id=(await response.json()).id;
let p=await get(id);assert.equal(p.description,'First description');assert.equal(p.image,'https://example.com/a.webp');assert.equal(p.effectivePrice,100);assert.equal(Number(p.featured),1);console.log('PASS create + description/image/base/list/sale/featured');
response=await call('products/'+id,{description:'Edited description',imageUrl:'https://example.com/b.webp',price:175,salePrice:null,listPrice:200});assert.equal(response.status,200);p=await get(id);assert.equal(p.description,'Edited description');assert.equal(p.image,'https://example.com/b.webp');assert.equal(p.effectivePrice,175);console.log('PASS edit atomic data propagation');
await call('products/'+id,{imageUrl:'',description:'',price:null,listPrice:null,salePrice:null});p=await get(id);assert.equal(p.image,'');assert.equal(p.description,'');assert.equal(p.basePrice,null);assert.equal(p.effectivePrice,null);console.log('PASS explicit empty image/description/prices stay removed');
await call('products/'+id,{price:95,imageUrl:'https://example.com/c.webp',description:'Keep me'});await call('products/'+id,{name:'Renamed'});p=await get(id);assert.equal(p.effectivePrice,95);assert.equal(p.description,'Keep me');assert.equal(p.image,'https://example.com/c.webp');console.log('PASS omitted fields preserved');
await call('product-featured/'+id,{featured:0});p=await get(id);assert.equal(Number(p.featured),0);await call('product-featured/'+id,{featured:1});assert.equal(Number((await get(id)).featured),1);console.log('PASS select/unselect propagation');
await call('products/'+id,{active:false});assert.equal(await get(id),undefined);await call('products/'+id,{active:true});assert.equal(Number((await get(id)).featured),1);console.log('PASS inactive hidden + reactivation');
for(const body of [{price:-1},{price:'abc'},{imageUrl:'javascript:alert(1)'}]){assert.equal((await call('products/'+id,body)).status,400);assert.equal((await get(id)).effectivePrice,95)}
assert.equal((await call('products/'+id,{price:500},{user:{role:'viewer',id:'viewer'}})).status,403);assert.equal((await get(id)).effectivePrice,95);console.log('PASS invalid writes/read-only role rejected unchanged');
const originalFetch=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify(await storefront()));const check=await(await call('publication-check')).json();globalThis.fetch=originalFetch;console.log('publication-check',JSON.stringify(check));if(process.env.EXPECT_PATCHED)assert.equal(check.match,true);
db.db.prepare("UPDATE b2b_prices_v1 SET valid_from='2020-01-01' WHERE product_id=? AND active=1").run(id);db.db.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active,valid_from,valid_until) VALUES(?,?,999,'TRY',1,'2025-01-01','2025-02-01')").run('expired-'+id,id);assert.equal((await get(id)).effectivePrice,95);globalThis.fetch=async()=>new Response(JSON.stringify(await storefront()));const expiryCheck=await(await call('publication-check')).json();globalThis.fetch=originalFetch;if(process.env.EXPECT_PATCHED)assert.equal(expiryCheck.match,true);if(process.env.EXPECT_PATCHED)assert.equal((await(await call('products')).json()).data.find(x=>x.id===id).current_price,95);console.log('PASS expired active price excluded consistently including panel');
globalThis.fetch=async()=>{const b=await storefront();b.products.find(x=>x.id===id).description='STALE VALUE';return new Response(JSON.stringify(b))};let mismatch=await(await call('publication-check')).json();assert.equal(mismatch.match,false);assert.ok(mismatch.mismatchedIds.includes(id));globalThis.fetch=originalFetch;console.log('PASS publication stale values correctly fail');
const batch=db.batch.bind(db);db.batch=items=>batch([...items,db.prepare('INSERT INTO missing_failure_injection VALUES(1)')]);await assert.rejects(()=>call('products/'+id,{description:'Should roll back',price:888,imageUrl:'https://example.com/bad.webp'}));db.batch=batch;p=await get(id);assert.equal(p.description,'Keep me');assert.equal(p.effectivePrice,95);assert.equal(p.image,'https://example.com/c.webp');console.log('PASS batch failure rolls back image description price');
const before=db.db.prepare('select count(*) n from b2b_price_history_v1 where product_id=?').get(id).n;assert.ok(before>=4);console.log('PASS price history recorded',before);
if(process.env.EXPECT_IMAGE_PATCH){
 const legacy='https://static.wixstatic.com/media/73bc28_8fe872225e3748e9840daeb5e2a8fb5e~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',official='https://www.toccosauce.com/wp-content/uploads/2024/03/SRIRACHA-tocco-packaging-900x900.png';
 const response=await call('products',{name:'Tocco Sriracha 2200 g legacy scenario',category:'Soslar',imageUrl:legacy,featured:true});const tocco=(await response.json()).id;
 db.db.prepare('UPDATE b2b_products_v1 SET source_product_id=? WHERE id=?').run('EDT-0127',tocco);
 assert.equal((await get(tocco)).image,official);assert.equal(db.db.prepare('SELECT image_url FROM b2b_products_v1 WHERE id=?').get(tocco).image_url,legacy);
 for(const saved of [legacy,'https://example.com/custom-tocco.webp','']){
  db.db.prepare('UPDATE b2b_products_v1 SET image_url=? WHERE id=?').run(saved,tocco);
  assert.equal((await get(tocco)).image,saved===legacy?official:saved);
  globalThis.fetch=async()=>new Response(JSON.stringify(await storefront()));const check=await(await call('publication-check')).json();globalThis.fetch=originalFetch;assert.equal(check.match,true,JSON.stringify(check));
 }
 console.log('PASS exact Tocco legacy normalization, custom/blank preservation, D1 unchanged and publication match');
}
