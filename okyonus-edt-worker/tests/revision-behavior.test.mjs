import test from 'node:test';
import assert from 'node:assert/strict';
import { commerceRoute } from '../src/commerce-v2.js';
import { commerceAdminApi, commerceAdminPage } from '../src/commerce-admin-v2.js';
import worker from '../src/deniz-worker.js';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

function parseScripts(html, label) {
  let count=0;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/application\/ld\+json|application\/json/.test(match[1])) continue;
    if (!match[2].trim()) continue;
    count++;
    assert.doesNotThrow(()=>new Function(match[2]), `${label} inline script ${count}`);
  }
  assert.ok(count>0, `${label}: no browser scripts checked`);
}

test('rendered public catalog, cart and product pages have parseable browser programs',async()=>{
  for(const path of ['/','/urunler','/sepet','/urun/test-product']) {
    const response=await commerceRoute(new Request('https://www.okyonusedt.com'+path),{});
    assert.equal(response.status,200,path);
    parseScripts(await response.text(),path);
  }
});

test('rendered commercial control panel has parseable browser programs',async()=>{
  parseScripts(await commerceAdminPage({}).text(),'/commerce');
});

test('anonymous quote submissions fail before catalog or message database writes',async()=>{
 for(const path of ['/api/quote','/api/photo-inquiries','/api/b2b/quotes','/api/b2b/quotes/fake/repeat']) {
  let writes=0;
  const env={DB:{prepare(){return {bind(){return this},first:async()=>null,all:async()=>({results:[]}),run:async()=>{writes++;return {success:true}}}}}};
  const response=await worker.fetch(new Request('https://www.okyonusedt.com'+path,{
    method:'POST',headers:{'content-type':'application/json',origin:'https://www.okyonusedt.com'},
    body:JSON.stringify({customer:{name:'Anonymous',phone:'05323469925'},products:[{id:'fake',name:'Test',quantity:1,unit:'Kg'}],consent:{kvkk:true}})
  }),env,{waitUntil(){}});
  assert.equal(response.status,401);
  assert.equal(writes,0,'anonymous quote touched database');
 }
});

function bulkDB() {
  const batches=[], writes=[];
  return {batches,writes,prepare(sql){return {sql,args:[],bind(...args){this.args=args;return this},async first(){
    if(sql.includes('SELECT value FROM oky_schema_meta_v1')) return {value:'ready'};
    if(sql.includes('SELECT p.*')) return this.args[0]==='p1'?{id:'p1',name:'Test Ürün',current_price:12}:null;
    return null;
  },async run(){writes.push(sql);return {success:true}}}},async batch(statements){batches.push(statements);return statements.map(()=>({success:true}))}};
}
const row={id:'p1',name:'Test Ürün',price:'20,25',imageUrl:'https://example.com/product.webp',description:'Güncel açıklama',active:'1',featured:'1'};
async function bulk(db,items,preview=false,role='owner') {
  return commerceAdminApi(new Request('https://admin.example/api/commerce/bulk-products',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({items,preview})}),{DB:db},{user:{id:'owner-1',role}},{});
}
test('bulk import validates every row and rejects whole submission before product writes',async()=>{
  for(const bad of [null,{...row,id:'missing'},{...row,price:'NaN'},{...row,price:'Infinity'},{...row,price:'-1'},{...row,name:'Wrong product'},{...row,active:'yes'},{...row,imageUrl:'javascript:alert(1)'}]) {
    const db=bulkDB();const response=await bulk(db,[row,bad]);
    assert.equal(response.status,400,JSON.stringify(bad));
    assert.equal(db.batches.length,0);
    assert.ok(db.writes.every(sql=>sql.startsWith('CREATE TABLE')), 'product writes before validation');
  }
  const db=bulkDB();assert.equal((await bulk(db,[row,row])).status,400);assert.equal(db.batches.length,0);
});
test('bulk preview is read-only and validated save is a single atomic D1 batch',async()=>{
  const db=bulkDB();let response=await bulk(db,[row],true);assert.equal(response.status,200);assert.equal(db.batches.length,0);
  const preview=await response.json();assert.equal(preview.data[0].price,20.25);
  response=await bulk(db,[row]);assert.equal(response.status,200);assert.equal(db.batches.length,1);
  assert.ok(db.batches[0].some(st=>st.sql.includes('b2b_price_history_v1')));
  assert.ok(db.batches[0].some(st=>st.sql.includes('sale_price=NULL')),'old sale price can mask imported price');
  assert.ok(db.batches[0].every(st=>st.args.includes('p1')));
});
function customerDB() {
  const calls=[];
  const records=[{user:'u1',business:'b1',path:'/urun/p1',title:'First user'},{user:'u2',business:'b1',path:'/urun/p2',title:'Other user'},{user:'u1',business:'b2',path:'/urun/p3',title:'Other business'}];
  return {calls,prepare(sql){return {args:[],bind(...args){this.args=args;return this},async first(){
    calls.push({sql,args:this.args});
    if(sql.includes('FROM member_sessions_v3 s JOIN'))return {user_id:'u1',business_id:'b1',session_id:'s1',email:'u1@example.com',first_name:'Bir',last_name:'Üye'};
    return null;
  },async run(){calls.push({sql,args:this.args});return {success:true}},async all(){calls.push({sql,args:this.args});return {success:true,results:records.filter(x=>x.user===this.args[0]&&x.business===this.args[1]).map(({path,title})=>({path,title,created_at:new Date().toISOString()}))}}}}};
}
async function customerRequest(db,path,method='GET',body) {
  return worker.fetch(new Request('https://www.okyonusedt.com'+path,{method,headers:{cookie:'__Host-oky_session=test-token',origin:'https://www.okyonusedt.com','content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})}),{DB:db},{waitUntil(){}});
}
test('customer activity read and delete scope to authenticated user and business',async()=>{
  const db=customerDB();let response=await customerRequest(db,'/api/member/activity?user_id=u2&business_id=b2');
  assert.equal(response.status,200);const body=await response.json();assert.equal(body.visits.length,1);assert.equal(body.visits[0].title,'First user');
  response=await customerRequest(db,'/api/member/activity?user_id=u2','DELETE');assert.equal(response.status,200);
  const deletion=db.calls.find(x=>x.sql.startsWith('DELETE FROM member_customer_activity_v1 WHERE user_id='));assert.deepEqual(deletion.args,['u1','b1']);
});
test('customer activity cannot forge another user and rejects arbitrary tracking paths',async()=>{
  const db=customerDB();let response=await customerRequest(db,'/api/member/activity','POST',{path:'/urun/p1',title:'Product',user_id:'u2',business_id:'b2'});
  assert.equal(response.status,200);
  const insert=db.calls.find(x=>x.sql.startsWith('INSERT INTO member_customer_activity_v1'));
  assert.deepEqual(insert.args.slice(1,3),['u1','b1']);
  response=await customerRequest(db,'/api/member/activity','POST',{path:'/api/member/me',title:'Private'});assert.equal(response.status,400);
});
test('anonymous activity and quote history are inaccessible',async()=>{
  for(const path of ['/api/member/activity','/api/member/quote-history']) {
    const response=await worker.fetch(new Request('https://www.okyonusedt.com'+path),{}, {waitUntil(){}});assert.equal(response.status,401,path);
  }
});
test('member entry and personalized account page rendered browser scripts parse',async()=>{
 const db=customerDB();
 for(const path of ['/uye','/benim-okyanusum']) {
   const response=await customerRequest(db,path);assert.equal(response.status,200,path);parseScripts(await response.text(),path);
 }
});
test('bulk imports deny non-owner commercial users',async()=>{
  const db=bulkDB();assert.equal((await bulk(db,[row],false,'member')).status,403);assert.equal(db.batches.length,0);
});
test('commerce quote adapter accepts new and storefront products, canonicalizes names and rejects whole invalid selections',async()=>{
 const source=fs.readFileSync(new URL('../src/deniz-worker.js',import.meta.url),'utf8');
 const start=source.indexOf('async function memberCommerceQuoteAPI('),end=source.indexOf('async function quoteAPI(',start);
 assert.ok(start>=0&&end>start);
 let saved=[];
 const responseJSON=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
 const adapter=new Function('commerceRoute','okyContactMessageAPI','responseJSON','ACTIVE_PRODUCT_CATALOG','SEAFOOD_B2B_QUOTE_CATALOG',source.slice(start,end)+';return memberCommerceQuoteAPI')(
   async()=>responseJSON({products:[{id:'sea-gigas-u5-10',name:'Gigas Karides',unit:'Kg'},{id:'new-admin-id',source_product_id:'new-admin-sku',name:'Yeni Yönetilen Ürün',unit:'Kg'}]}),
   async request=>{saved.push(await request.json());return responseJSON({ok:true,id:'quote1',notification:'SENT'},201)}, responseJSON,[],[]);
 const submit=products=>adapter(new Request('https://www.okyonusedt.com/api/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({customer:{name:'Test User',business:'Test İşletme',phone:'05323469925',email:'test@example.com'},products,consent:{kvkk:true}})}),{});
 let response=await submit([{id:'sea-gigas-u5-10',name:'Forged Name',quantity:2,unit:'Kg'},{id:'new-admin-id',name:'Forged Price',quantity:3,unit:'Kg'}]);
 assert.equal(response.status,201);assert.equal(saved.length,1);assert.ok(saved[0].message.includes('Gigas Karides'));assert.ok(saved[0].message.includes('Yeni Yönetilen Ürün'));assert.ok(!saved[0].message.includes('Forged'));
 for(const products of [
   [{id:'new-admin-id',quantity:1,unit:'Kg'},{id:'unknown-id',quantity:1,unit:'Kg'}],
   [{id:'new-admin-id',quantity:1,unit:'Kg'},{id:'new-admin-id',quantity:1,unit:'Kg'}],
   [{id:'new-admin-id',quantity:1,unit:'Kg'},{id:'new-admin-sku',quantity:1,unit:'Kg'}],
   [{id:'new-admin-id',quantity:0,unit:'Kg'}]
 ]) {response=await submit(products);assert.equal(response.status,400,JSON.stringify(products));assert.equal(saved.length,1,'invalid selection partially saved');}
});

function sqliteD1() {
 const sqlite=new DatabaseSync(':memory:');
 return {sqlite,prepare(sql){return {sql,args:[],bind(...args){this.args=args;return this},async run(){const r=sqlite.prepare(sql).run(...this.args);return {success:true,meta:{changes:Number(r.changes)}}},async first(){return sqlite.prepare(sql).get(...this.args)||null},async all(){return {success:true,results:sqlite.prepare(sql).all(...this.args)}}}},async batch(statements){sqlite.exec('BEGIN');try{const results=[];for(const st of statements)results.push(await st.run());sqlite.exec('COMMIT');return results}catch(error){sqlite.exec('ROLLBACK');throw error}}};
}
test('real SQLite admin initialization, import, storefront price and disable round trip',async()=>{
 const db=sqliteD1(),env={DB:db},auth={user:{id:'owner1',role:'owner'}};
 const admin=async(path,method='GET',body)=>commerceAdminApi(new Request('https://admin.example/api/commerce/'+path,{method,...(body?{headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})}),env,auth,{});
 try {
   let response=await admin('products');assert.equal(response.status,200);const {data}=await response.json();assert.ok(data.length>0);
   const p=data[0];
   const readStore=async()=> (await (await commerceRoute(new Request('https://www.okyonusedt.com/api/storefront-v2'),env)).json()).products;
   let products=await readStore();let published=products.find(x=>x.id===p.id);assert.ok(published,'managed product missing from storefront SQL query');
   response=await bulk(db,[{id:p.id,name:p.name,price:'123.45',imageUrl:'https://example.com/new.webp',description:'Updated from bulk',active:'1',featured:'1'}]);assert.equal(response.status,200);
   products=await readStore();published=products.find(x=>x.id===p.id);assert.equal(published.effectivePrice,123.45);assert.equal(published.description,'Updated from bulk');
   response=await admin('products/'+p.id,'DELETE');assert.equal(response.status,200);
   products=await readStore();assert.ok(!products.some(x=>x.id===p.id||x.id===p.source_product_id||x.source_product_id===p.source_product_id),'disabled product reappeared through fallback merge');
 } finally {db.sqlite.close();}
});
test('authenticated full Worker saves quotes for newly managed product and rejects disabled or unknown IDs',async()=>{
 const db=sqliteD1(),env={DB:db,ADMIN_DB:db},auth={user:{id:'owner1',role:'owner'}};
 try {
  const created=await commerceAdminApi(new Request('https://admin.example/api/commerce/products',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Yeni Test Ürünü',category:'Deniz Ürünleri',unit:'Kg',price:44})}),env,auth,{});
  assert.equal(created.status,201);const p=await created.json();
  await worker.fetch(new Request('https://www.okyonusedt.com/api/member/me',{headers:{cookie:'__Host-oky_session=test-token'}}),env,{waitUntil(){}});
  const now=new Date().toISOString(),expires=new Date(Date.now()+86400000).toISOString(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('test-token'))),b=>b.toString(16).padStart(2,'0')).join('');
  db.sqlite.prepare('INSERT INTO member_users_v3(id,email,password_hash,password_salt,first_name,last_name,business_name,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run('u1','test@example.com','unused','unused','Test','User','Test İşletme','active',now,now);
  db.sqlite.prepare('INSERT INTO member_businesses_v3(id,name,owner_user_id,created_at,updated_at) VALUES(?,?,?,?,?)').run('b1','Test İşletme','u1',now,now);
  db.sqlite.prepare('INSERT INTO member_business_members_v3(business_id,user_id,created_at) VALUES(?,?,?)').run('b1','u1',now);
  db.sqlite.prepare('INSERT INTO member_sessions_v3(id,user_id,business_id,token_hash,expires_at,created_at,last_seen_at) VALUES(?,?,?,?,?,?,?)').run('s1','u1','b1',hash,expires,now,now);
  db.sqlite.exec('CREATE TABLE inquiries(id TEXT PRIMARY KEY,source TEXT,name TEXT,email TEXT,phone TEXT,company TEXT,subject TEXT,message TEXT,locale TEXT,consent_at TEXT,consent_version TEXT,status TEXT,request_ip_hash TEXT,user_agent TEXT,metadata_json TEXT,created_at TEXT,updated_at TEXT)');
  const submit=async ids=>worker.fetch(new Request('https://www.okyonusedt.com/api/quote',{method:'POST',headers:{cookie:'__Host-oky_session=test-token',origin:'https://www.okyonusedt.com','content-type':'application/json'},body:JSON.stringify({customer:{name:'Test User',business:'Test İşletme',phone:'05323469925',email:'test@example.com'},products:ids.map(id=>({id,name:'Forged',quantity:1,unit:'Kg'})),consent:{kvkk:true}})}),env,{waitUntil(){}});
  let response=await submit([p.id]);assert.equal(response.status,201,await response.clone().text());
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM inquiries').get().n,1);
  assert.ok(db.sqlite.prepare('SELECT message FROM inquiries').get().message.includes('Yeni Test Ürünü'));
  assert.equal((await submit([p.id,'unknown-id'])).status,400);assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM inquiries').get().n,1);
  await commerceAdminApi(new Request('https://admin.example/api/commerce/products/'+p.id,{method:'DELETE'}),env,auth,{});
  assert.equal((await submit([p.id])).status,400);assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM inquiries').get().n,1);
 } finally {db.sqlite.close();}
});
