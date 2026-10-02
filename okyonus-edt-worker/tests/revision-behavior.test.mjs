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

 test('guest cart login destination returns to the cart after member entry',async()=>{
  const response=await commerceRoute(new Request('https://www.okyonusedt.com/sepet'),{}),html=await response.text();
  const match=html.match(/qf\.onsubmit=async e=>\{([\s\S]*?)const a=read\(\);/);assert.ok(match);
  const location={href:''};
  await new Function('window','fetch','location','encodeURIComponent','return (async e=>{'+match[1]+'})({preventDefault(){}})')({},async()=>({json:async()=>({ok:false})}),location,encodeURIComponent);
  const target=new URL(location.href,'https://www.okyonusedt.com');assert.equal(target.pathname,'/uye');assert.equal(target.searchParams.get('next'),'/sepet');
 });

test('personal panel retains available history and adopts only an unowned guest cart',async()=>{
 const response=await customerRequest(customerDB(),'/benim-okyanusum'),html=await response.text();
 const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes("const history=document.getElementById('customerHistory')"));assert.ok(script);
 const node=()=>({children:[],textContent:'',append(x){this.children.push(x)},set onclick(value){this.handler=value}}),elements=new Map();
 const document={getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id)},createElement:node,addEventListener(){}};
 const entries=new Map([['oky-commerce-cart-v2',JSON.stringify([{name:'Guest product',qty:2,unit:'Kg'}])]]),localStorage={getItem:k=>entries.get(k)||null,setItem:(k,v)=>entries.set(k,v)};
 const fetch=async url=>url==='/api/commerce/account'?{ok:false,json:async()=>({ok:false})}:{ok:true,json:async()=>({ok:true,quotes:[{quoteNo:'Q-123',created_at:'2026-10-01',status:'Talep alındı'}],visits:[]})};
 new Function('document','localStorage','fetch',script)(document,localStorage,fetch);await new Promise(resolve=>setImmediate(resolve));
 assert.ok(elements.get('customerHistory').children.some(x=>x.children.some(y=>y.textContent.includes('Q-123'))));
 assert.ok(elements.get('customerCart').children.some(x=>x.children.some(y=>y.textContent.includes('Guest product'))));
 assert.ok(entries.get('oky-commerce-cart-owner-v1'));
});

test('opening campaign works immediately, closes safely and stays dismissed in-session; installation lifecycle works',async()=>{
 const response=await commerceRoute(new Request('https://www.okyonusedt.com/'),{}),html=await response.text();
 const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes("const popup=document.getElementById('campaignPopup')"));assert.ok(script);
 const popupMarkup=html.match(/<dialog id="campaignPopup"[\s\S]*?<\/dialog>/)[0];
 const image=popupMarkup.match(/<img src="(data:image\/[^;]+;base64,[^"]+)"/);assert.ok(image,'opening image is embedded by default');assert.ok(Buffer.from(image[1].split(',')[1],'base64').length>10000);
 const storage=new Map(),sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 function run(path){
  const listeners=new Map(),events=new Map(),install={hidden:false},close={},popup={dataset:{enabled:popupMarkup.match(/data-enabled="([^"]*)"/)[1],campaignKey:popupMarkup.match(/data-campaign-key="([^"]*)"/)[1]},open:false,showModal(){this.open=true},close(){this.open=false;listeners.get('close')?.()},addEventListener(k,v){listeners.set(k,v)}};
  const document={getElementById(id){return {commerceInstall:install,campaignPopup:popup,campaignClose:close}[id]||null},addEventListener(){},dispatchEvent(){},querySelectorAll(){return[]}};
  const window={addEventListener(k,v){events.set(k,v)}},requests=[];
  const fetch=async path=>{requests.push(path);return{ok:false,json:async()=>({ok:false,campaigns:[]})}};
  new Function('document','window','navigator','matchMedia','localStorage','sessionStorage','location','fetch','alert',script)(document,window,{userAgent:'Test'},()=>({matches:false}),{getItem(){return null},setItem(){}},sessionStorage,{pathname:path},fetch,()=>{});
  return {popup,close,install,events,listeners,requests};
 }
 const first=run('/');assert.equal(first.popup.open,true,'homepage popup opens synchronously without managed campaign fetch');assert.deepEqual(first.requests,['/api/member/me']);
 first.close.onclick();assert.equal(first.popup.open,false);assert.equal(run('/').popup.open,false,'same-session dismissal persists');
 storage.clear();const backdrop=run('/');backdrop.listeners.get('click')({target:{}});assert.equal(backdrop.popup.open,true,'content click preserves popup');backdrop.listeners.get('click')({target:backdrop.popup});assert.equal(backdrop.popup.open,false);
 storage.clear();assert.equal(run('/urunler').popup.open,false,'catalog route never opens homepage campaign');
 let prevented=false,prompted=false;first.events.get('beforeinstallprompt')({preventDefault(){prevented=true},async prompt(){prompted=true},userChoice:Promise.resolve({outcome:'accepted'})});assert.equal(prevented,true);assert.equal(first.install.hidden,false);await first.install.onclick();assert.equal(prompted,true);first.events.get('appinstalled')();assert.equal(first.install.hidden,true);
});

test('opening advert settings persist partial edits and explicit image removal without reseeding',async()=>{
 const db=sqliteD1(),env={DB:db,ADMIN_DB:db},auth={user:{id:'owner1',role:'owner'}};
 const call=(method,body)=>commerceAdminApi(new Request('https://admin.example/api/commerce/settings',{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})}),env,auth,{});
 try{
  const initial={siteTitle:'Keep site title',openingCampaignEnabled:'false',openingCampaignImage:'https://example.com/poster.webp',openingCampaignTitle:'Yeni reklam',openingCampaignDescription:'Açılış açıklaması',openingCampaignCtaText:'Ürünlere git',openingCampaignCtaUrl:'/urunler',openingCampaignPhotoCtaText:'Fotoğraf gönder',openingCampaignPhotoCtaUrl:'/fotografla-teklif'};
  assert.equal((await call('POST',initial)).status,200);let result=await (await call('GET')).json();for(const [k,v] of Object.entries(initial))assert.equal(result.data[k],v,k);
  assert.equal((await call('POST',{openingCampaignEnabled:'true',openingCampaignImage:''})).status,200);
  result=await (await call('GET')).json();assert.equal(result.data.openingCampaignImage,'');assert.equal(result.data.openingCampaignEnabled,'true');assert.equal(result.data.siteTitle,'Keep site title');assert.equal(result.data.openingCampaignTitle,'Yeni reklam');
  const pageHtml=await (await commerceAdminPage()).text();parseScripts(pageHtml,'opening admin');assert.equal(pageHtml.match(/<button data-r="([^"]+)"/)[1],'products');assert.ok(pageHtml.includes("data-r=\"opening\""));assert.ok(pageHtml.includes("let current='products'"));
  const uiSource=[...pageHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes('function openingUI'));
  const ui=new Function('esc',uiSource.slice(uiSource.indexOf('function openingUI'),uiSource.indexOf('function bindOpening'))+';return openingUI;')(x=>String(x??''));
  assert.ok(ui({}).includes('opening-post-2026-10-01.jpeg'),'unset image previews default');assert.ok(!ui({openingCampaignImage:''}).includes('opening-post-2026-10-01.jpeg'),'removed image is not reseeded in editor');
 }finally{db.sqlite.close()}
});

test('opening ad admin changes render on the homepage and removal never restores the supplied poster',async()=>{
 const db=sqliteD1(),env={DB:db},auth={user:{id:'owner1',role:'owner'}};
 const save=async body=>commerceAdminApi(new Request('https://admin.example/api/commerce/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),env,auth,{});
 const opening=async()=>{const r=await commerceRoute(new Request('https://www.okyonusedt.com/'),env);assert.equal(r.status,200);const html=await r.text();return html.match(/<dialog id="campaignPopup"[\s\S]*?<\/dialog>/)[0]};
 try{
  assert.equal((await save({openingCampaignEnabled:'true',openingCampaignImage:'https://example.com/changed.webp',openingCampaignTitle:'Yeni Açılış',openingCampaignDescription:'Yeni açıklama',openingCampaignCtaText:'Ürünler',openingCampaignCtaUrl:'/urunler?category=deniz-urunleri',openingCampaignPhotoCtaText:'Fotoğrafla Gönder',openingCampaignPhotoCtaUrl:'/fotografla-teklif'})).status,200);
  const edited=await opening();assert.match(edited,/data-enabled="true"/);assert.match(edited,/<h2>Yeni Açılış<\/h2>/);assert.match(edited,/Yeni açıklama/);assert.match(edited,/src="https:\/\/example.com\/changed.webp"/);assert.match(edited,/href="\/urunler\?category=deniz-urunleri"/);assert.ok(!edited.includes('data:image/jpeg;base64,'));
  await save({openingCampaignImage:''});const removed=await opening();assert.ok(!removed.includes('<img'),'removed image returned');assert.ok(!removed.includes('data:image'));assert.match(removed,/Yeni Açılış/);assert.notEqual(removed.match(/data-campaign-key="([^"]*)"/)[1],edited.match(/data-campaign-key="([^"]*)"/)[1]);
  await save({openingCampaignEnabled:'false'});assert.match(await opening(),/data-enabled="false"/);
  assert.equal((await save({openingCampaignImage:'javascript:alert(1)'})).status,400);assert.equal((await save({openingCampaignEnabled:'true',openingCampaignCtaUrl:'javascript:alert(1)',openingCampaignTitle:'<img onerror=alert(1)>'})).status,200);const safe=await opening();assert.ok(!safe.includes('javascript:'));assert.ok(!safe.includes('<img'));assert.match(safe,/href="\/urunler"/);assert.match(safe,/&lt;img onerror=alert\(1\)&gt;/);
 } finally {db.sqlite.close()}
});

test('opening advert preserves long signed image URLs and rejects invalid images before any settings write',async()=>{
 const db=sqliteD1(),env={DB:db,ADMIN_DB:db},auth={user:{id:'owner1',role:'owner'}};
 const call=(method,body)=>commerceAdminApi(new Request('https://admin.example/api/commerce-admin/settings',{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})}),env,auth,{});
 try{
  const signed='https://images.example.com/poster.webp?signature='+ 'abc123'.repeat(220);
  assert.equal((await call('POST',{openingCampaignImage:signed})).status,200);assert.equal((await(await call('GET')).json()).data.openingCampaignImage,signed);
  assert.equal((await call('POST',{openingCampaignTitle:'Must not write',openingCampaignImage:'javascript:alert(1)'})).status,400);
  assert.equal((await(await call('GET')).json()).data.openingCampaignTitle,undefined);
  assert.equal((await call('POST',{openingCampaignImage:'https://images.example.com/'+ 'x'.repeat(8193)})).status,400);
 }finally{db.sqlite.close()}
});

test('opening editor text-only save preserves default image and explicit clear persists removal',async()=>{
 const html=await commerceAdminPage({}).text(),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const code=script.slice(script.indexOf('function bindOpening'),script.indexOf('function settingsUI'));
 async function submit(clear){
  const events={},image={value:'https://example.com/default.webp',addEventListener(k,v){events[k]=v}},clearButton={addEventListener(k,v){events.clear=v}},button={},out={},saved=[];
  const form={elements:{openingCampaignImage:image},querySelector(selector){return selector==='[data-clear-image]'?clearButton:button}};
  const document={getElementById:id=>id==='openingForm'?form:out};
  const FormData=class{constructor(){return [['openingCampaignTitle','Edited title'],['openingCampaignImage',image.value]][Symbol.iterator]()}};
  const bind=new Function('document','bindImageEditors','FormData','api','summary',code+';return bindOpening;')(document,()=>{},FormData,async(_,options)=>saved.push(JSON.parse(options.body)),async()=>{});
  bind({});if(clear){image.value='';events.clear()};await form.onsubmit({preventDefault(){}});return saved[0];
 }
 assert.equal(Object.prototype.hasOwnProperty.call(await submit(false),'openingCampaignImage'),false);
 assert.equal((await submit(true)).openingCampaignImage,'');
});

test('reopening admin image editors binds one upload and refreshes the current preview',async()=>{
 const html=await commerceAdminPage({}).text(),script=html.match(/<script>([\s\S]*?)<\/script>/)[1],listeners=new Map(),input={value:'https://example.com/one.webp',addEventListener(k,v){listeners.set('input',v)}},image={},file={},clear={},upload={};
 clear.addEventListener=(k,v)=>listeners.set('clear',v);let uploads=0;const uploadHandlers=[];upload.addEventListener=(k,v)=>uploadHandlers.push(v);
 const box={querySelector(selector){return {'[data-image-url]':input,'[data-image-preview]':image,'[data-image-file]':file,'[data-clear-image]':clear,'[data-upload-image]':upload}[selector]||null}},root={querySelectorAll(){return[box]}};
 const code=script.slice(script.indexOf('const imageEditorBindings'),script.indexOf('const dbMap'));
 const bind=new Function('uploadImageToEditor','alert',code+';return bindImageEditors;')(async()=>uploads++,()=>{});
 bind(root);input.value='https://example.com/two.webp';bind(root);assert.equal(image.src,input.value);assert.equal(uploadHandlers.length,1);await uploadHandlers[0]();assert.equal(uploads,1);listeners.get('clear')();assert.equal(input.value,'');assert.equal(image.hidden,true);
});

test('guest photo quote opens login separately while preserving selected photo and form',async()=>{
 const response=await worker.fetch(new Request('https://www.okyonusedt.com/fotografla-teklif'),{},{}),html=await response.text();assert.equal(response.status,200);
 const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes("getElementById('photoForm')"));assert.ok(script);
 const selected={name:'list.jpeg',size:100},photo={files:[selected],value:'chosen'},button={},error={textContent:'',children:[],append(x){this.children.push(x)}},result={style:{}},form={reset(){throw Error('guest form reset')}};
 const document={getElementById:id=>({photoForm:form,photo,submit:button,error,result}[id]),createElement:()=>({})},requests=[];
 const fetch=async path=>{requests.push(path);return {ok:false,status:401}};
 new Function('document','fetch',script)(document,fetch);await form.onsubmit({preventDefault(){}});
 assert.deepEqual(requests,['/api/member/me']);assert.equal(photo.files[0],selected);assert.equal(photo.value,'chosen');assert.equal(button.disabled,false);assert.equal(error.children[0].target,'_blank');assert.equal(new URL(error.children[0].href,'https://www.okyonusedt.com').searchParams.get('next'),'/fotografla-teklif');
});

test('every generic commerce management tab performs SQLite create edit list and delete',async()=>{
 const db=sqliteD1(),env={DB:db},auth={user:{id:'owner1',role:'owner'}};
 const call=(path,method='GET',body)=>commerceAdminApi(new Request('https://admin.example/api/commerce-admin/'+path,{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})}),env,auth,{});
 try{
  const bodies={categories:{name:'Test category',slug:'test-category',imageUrl:'https://example.com/category.webp'},banners:{title:'Test banner',desktopImage:'https://example.com/desktop.webp',mobileImage:'https://example.com/mobile.webp',ctaUrl:'/urunler'},sections:{title:'Test section',kind:'PRODUCT_GRID',source:'Deniz Ürünleri',payloadJson:'{"limit":3}'},brands:{name:'Test brand',slug:'test-brand',logoUrl:'https://example.com/logo.webp'},campaigns:{title:'Test campaign',imageUrl:'https://example.com/campaign.webp'},delivery:{region:'İstanbul',district:'Kadıköy',fee:25,coldChain:true},media:{name:'Test image',url:'https://example.com/image.webp',kind:'IMAGE',altText:'Test'},seo:{path:'/edt-audit-test',label:'EDT audit test',groupName:'EDT'},help:{title:'Test help',slug:'test-help',body:'Test help body'}};
  let campaignId;
  for(const [resource,body] of Object.entries(bodies)){
   const response=await call(resource,'POST',{...body,active:true});assert.equal(response.status,201,resource+' create: '+await response.clone().text());const {id}=await response.json();if(resource==='campaigns')campaignId=id;
   assert.ok((await(await call(resource)).json()).data.some(x=>x.id===id),resource+' list');
   assert.equal((await call(resource+'/'+id,'POST',{...body,active:false})).status,200,resource+' edit');assert.equal((await(await call(resource)).json()).data.find(x=>x.id===id).active,0,resource+' toggle');
   if(resource!=='campaigns'){assert.equal((await call(resource+'/'+id,'DELETE')).status,200);assert.ok(!(await(await call(resource)).json()).data.some(x=>x.id===id),resource+' delete')}
  }
  const rule={campaignId,targetType:'ALL',discountType:'PERCENT',discountValue:10,active:true};let response=await call('campaign-rules','POST',rule);assert.equal(response.status,201,await response.clone().text());const {id}=await response.json();assert.ok((await(await call('campaign-rules')).json()).data.some(x=>x.id===id));assert.equal((await call('campaign-rules/'+id,'POST',{...rule,active:false})).status,200);assert.equal((await call('campaign-rules/'+id,'DELETE')).status,200);assert.equal((await call('campaigns/'+campaignId,'DELETE')).status,200);
 }finally{db.sqlite.close()}
});

test('executed catalog and informational renderers emit real HTML attributes',async()=>{
  const {runInNewContext}=await import('node:vm');
  const product={id:'test',source_product_id:'test',name:'Test Ürün',category:'Deniz Ürünleri',unit:'Kg',price:12,image:'https://example.com/test.webp'};
  const payload={products:[product],brands:[{name:'Test Marka'}],campaigns:[{title:'Test Kampanya',cta_url:'/urunler'}],delivery:[{district:'Kadıköy',min_order:10}],settings:{},sections:[],seo:[]};
  for(const [path,id,selector] of [['/markalar','brands','brands.innerHTML'],['/kampanyalar','campaignList','campaignList.innerHTML'],['/teslimat','deliveryList','deliveryList.innerHTML'],['/urunler','catalogGrid',"const K='oky-commerce-cart-v2'"],['/urun/test-urun','pd','const target=']]){
    const response=await commerceRoute(new Request('https://www.okyonusedt.com'+path),{});
    const html=await response.text(),scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
    const script=scripts.find(s=>s.includes(selector)&&s.includes(id));assert.ok(script,path+' page script found');
    const nodes=new Map();
    const node=key=>{if(!nodes.has(key))nodes.set(key,{innerHTML:'',textContent:'',value:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},querySelectorAll(){return[]},querySelector(){return node('child:'+key)},setAttribute(){}});return nodes.get(key)};
    const doc={getElementById:node,querySelectorAll(){return[]},querySelector:node,addEventListener(){},dispatchEvent(){}};
    const context={document:doc,fetch:async()=>({json:async()=>payload}),localStorage:{getItem:()=>null,setItem(){}},location:{search:''},URLSearchParams,Event,Intl,setTimeout(){},clearTimeout(){},console};
    for(const key of ['brands','campaignList','deliveryList','catalogGrid','catalogCount','cq','cc','pd','rel'])context[key]=node(key);
    runInNewContext(script,context);
    for(let i=0;i<10;i++)await Promise.resolve();
    const markup=node(id).innerHTML;
    assert.ok(markup.includes('Test')||markup.includes('Kadıköy'),path+' renderer completed with fixture data');
    assert.doesNotMatch(markup,/\\["']/ ,path+' HTML attributes contain literal backslashes');
    assert.match(markup,/(?:class|href|src)="[^"\\]*"/,path+' renderer emits quoted attributes');
    if(path==='/markalar')assert.match(markup,/href="\/urunler\?q=Test%20Marka"/);
    if(path==='/kampanyalar')assert.match(markup,/href="\/urunler"/);
  }
});

test('empty managed catalog permits full legacy fallback while inactive managed catalog stays authoritative',async()=>{
 const db=sqliteD1(),env={DB:db},auth={user:{id:'owner1',role:'owner'}};
 try{
  await commerceAdminApi(new Request('https://admin.example/api/commerce-admin/settings'),env,auth,{});
  db.sqlite.exec('DELETE FROM b2b_products_v1');
  const read=async()=> (await(await commerceRoute(new Request('https://www.okyonusedt.com/api/storefront-v2'),env)).json());
  let store=await read();assert.equal(store.catalogAuthoritative,false);assert.equal(store.homepageAuthoritative,true);assert.ok(store.products.length>0,'empty schema retains default products');
  const legacy=await(await worker.fetch(new Request('https://www.okyonusedt.com/api/products'),{},{})).json();assert.ok(legacy.products.some(x=>/Et Ürünleri|Tavuk Ürünleri/.test(x.category)),'full legacy contains meat and poultry');assert.ok(legacy.products.length>1000);
  const created=await commerceAdminApi(new Request('https://admin.example/api/commerce-admin/products',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Disabled only catalog item',category:'Et Ürünleri',unit:'Kg',active:false})}),env,auth,{});assert.equal(created.status,201);store=await read();assert.equal(store.catalogAuthoritative,true);assert.equal(store.products.length,0,'inactive initialized catalog must not resurrect defaults');
  db.sqlite.exec('DROP TABLE b2b_prices_v1');store=await read();assert.equal(store.catalogAuthoritative,true,'initialized query failure must not resurrect disabled defaults');assert.equal(store.products.length,0);
 }finally{db.sqlite.close()}
});

test('catalog category links retain selection and respect authoritative empty catalogs',async()=>{
 const {runInNewContext}=await import('node:vm');
 const page=await (await commerceRoute(new Request('https://www.okyonusedt.com/urunler'),{})).text();
 const script=[...page.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes('catalogGrid')&&x.includes('normalizeLegacy'));
 async function render(managed,legacy,category){
  const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',value:'',textContent:''});return nodes.get(id)};
  const document={getElementById:node,addEventListener(){},dispatchEvent(){}};
  const context={document,fetch:async url=>({json:async()=>url==='/api/storefront-v2'?managed:{products:legacy}}),localStorage:{getItem:()=>null,setItem(){}},location:{search:'?category='+encodeURIComponent(category)},URLSearchParams,Event,Intl,console};
  for(const id of ['cq','cc','catalogGrid','catalogCount'])context[id]=node(id);
  runInNewContext(script,context);for(let i=0;i<12;i++)await Promise.resolve();
  return {markup:node('catalogGrid').innerHTML,count:node('catalogCount').textContent,category:node('cc').value,options:node('cc').innerHTML};
 }
 const meat={id:'meat',name:'Dana Köfte',category:'Et & Şarküteri',price:20};
 let result=await render({products:[meat],catalogAuthoritative:true},[],'et-sarkuteri');
 assert.equal(result.count,'1 ürün');assert.match(result.markup,/Dana Köfte/);assert.equal(result.category,'et-sarkuteri');
 result=await render({products:[],catalogAuthoritative:false},[{id:'legacy',name:'Dana Köfte',category:'Et'}],'et-sarkuteri');
 assert.equal(result.count,'1 ürün');assert.match(result.markup,/Dana Köfte/);
 result=await render({products:[],catalogAuthoritative:true},[{id:'disabled',name:'Dana Köfte',category:'Et'}],'et-sarkuteri');
 assert.equal(result.count,'0 ürün');assert.doesNotMatch(result.markup,/Dana Köfte/);assert.match(result.options,/value="et-sarkuteri"/);assert.equal(result.category,'et-sarkuteri');
 result=await render({products:[],catalogAuthoritative:false},[{id:'sauce',name:'Ketçap',category:'Soslar'}],'soslar');
 assert.equal(result.count,'1 ürün');assert.match(result.markup,/Ketçap/);
 result=await render({products:[],catalogAuthoritative:true},[],'ozel-grup');
 assert.match(result.options,/value="ozel-grup"/);assert.equal(result.category,'ozel-grup');
});

test('managed product image removal is explicit and survives edits imports and schema initialization',async()=>{
 const db=sqliteD1(),env={DB:db},auth={user:{id:'owner1',role:'owner'}};
 const call=(path,method='GET',body)=>commerceAdminApi(new Request('https://admin.example/api/commerce-admin/'+path,{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})}),env,auth,{});
 const image=id=>db.sqlite.prepare('SELECT image_url FROM b2b_products_v1 WHERE id=?').get(id).image_url;
 try{
  let response=await call('products','POST',{name:'Clear Image Test',category:'Deniz Ürünleri',unit:'Kg'});const {id}=await response.json();assert.equal(image(id),null,'new product starts without a photograph');
  await call('products/'+id,'POST',{description:'Edit without image'});assert.equal(image(id),null);
  await call('products/'+id,'POST',{imageUrl:'https://example.com/manual.webp'});assert.equal(image(id),'https://example.com/manual.webp');await call('products/'+id,'POST',{description:'Preserve image'});assert.equal(image(id),'https://example.com/manual.webp');
  await call('products/'+id,'POST',{imageUrl:''});assert.equal(image(id),null);await call('products/'+id,'POST',{description:'Still removed'});assert.equal(image(id),null);
  await call('catalog-import','POST',{items:[{name:'Clear Image Test',category:'Deniz Ürünleri'}]});assert.equal(image(id),null);
  await call('catalog-import','POST',{items:[{name:'Clear Image Test',category:'Deniz Ürünleri',imageUrl:'https://example.com/new.webp'}]});assert.equal(image(id),'https://example.com/new.webp');
  await call('catalog-import','POST',{items:[{name:'Clear Image Test',category:'Deniz Ürünleri'}]});assert.equal(image(id),'https://example.com/new.webp');
  await call('catalog-import','POST',{items:[{name:'Clear Image Test',category:'Deniz Ürünleri',imageUrl:''}]});assert.equal(image(id),null);
  await call('bulk-products','POST',{items:[{id,name:'Clear Image Test',price:'',imageUrl:'',description:'',active:'1',featured:'0'}]});assert.equal(image(id),null);
  const seed=db.sqlite.prepare('SELECT id FROM b2b_products_v1 WHERE source_product_id IS NOT NULL LIMIT 1').get();assert.ok(seed);await call('products/'+seed.id,'POST',{imageUrl:''});db.sqlite.exec("DELETE FROM oky_schema_meta_v1 WHERE key LIKE 'commerce-admin-%'");await call('products');assert.equal(image(seed.id),null,'initialization must never reattach a removed seafood image');
  await call('catalog-import','POST',{items:[{name:'Initially Unset',category:'Et Ürünleri'}]});assert.equal(db.sqlite.prepare("SELECT image_url FROM b2b_products_v1 WHERE name='Initially Unset'").get().image_url,null);
 }finally{db.sqlite.close()}
});

test('admin product preview uses only the saved photograph and never reattaches a default',async()=>{
 const source=fs.readFileSync(new URL('../src/commerce-admin-v2.js',import.meta.url),'utf8');
 const helperSource=source.slice(source.indexOf('function validProductImage'),source.indexOf('const SEO_ROUTES'));
 const helper=new Function(helperSource+';return adminProductImage;')();
 assert.equal(helper({source_product_id:'sea-01',name:'Kalamar',image_url:null}),'');
 assert.equal(helper({image_url:''}),'');assert.equal(helper({image_url:'https://manual.example/own.webp'}),'https://manual.example/own.webp');
 const db=sqliteD1(),env={DB:db},auth={user:{id:'owner1',role:'owner'}};
 const call=(path,method='GET',body)=>commerceAdminApi(new Request('https://admin.example/api/commerce-admin/'+path,{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})}),env,auth,{});
 try{
  await call('catalog-import','POST',{items:[{sourceProductId:'preview-test',name:'Exact product',category:'Test',packageText:'2.5 kg'}]});
  let row=(await(await call('products')).json()).data.find(x=>x.source_product_id==='preview-test');assert.equal(row.image_url,null);
  await call('products/'+row.id,'POST',{imageUrl:'https://manual.example/own.webp'});row=(await(await call('products')).json()).data.find(x=>x.source_product_id==='preview-test');assert.equal(row.image_url,'https://manual.example/own.webp');
  await call('products/'+row.id,'POST',{imageUrl:''});row=(await(await call('products')).json()).data.find(x=>x.source_product_id==='preview-test');assert.equal(row.image_url,null);
 }finally{db.sqlite.close()}
});

test('publication check compares actual D1 selections images descriptions and prices and exposes failures',async()=>{
 const db=sqliteD1(),env={DB:db},auth={user:{id:'owner1',role:'owner'}},originalFetch=globalThis.fetch;
 const call=(path,method='GET',body)=>commerceAdminApi(new Request('https://admin.example/api/commerce-admin/'+path,{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})}),env,auth,{});
 try{
  const created=await(await call('products','POST',{name:'Publish checker test',category:'Test',featured:1,price:123.45,imageUrl:'https://example.com/current.webp',description:'Current description'})).json();
  globalThis.fetch=async url=>{assert.equal(url,'https://www.okyonusedt.com/api/storefront-v2');return commerceRoute(new Request(url),env)};
  let result=await(await call('publication-check')).json();assert.equal(result.match,true);assert.equal(result.selectedCount,result.publishedCount);
  globalThis.fetch=async url=>{const body=await(await commerceRoute(new Request(url),env)).json();body.products.find(p=>p.id===created.id).image='https://example.com/stale.webp';return Response.json(body)};
  result=await(await call('publication-check')).json();assert.equal(result.match,false);assert.ok(result.mismatchedIds.includes(created.id));
  globalThis.fetch=async()=>new Response('',{status:503});result=await(await call('publication-check')).json();assert.equal(result.match,false);assert.equal(result.error,'PUBLIC_STOREFRONT_HTTP_503');
  globalThis.fetch=async()=>{throw Error('network blocked')};result=await(await call('publication-check')).json();assert.equal(result.match,false);assert.equal(result.error,'PUBLIC_STOREFRONT_UNREACHABLE');
 }finally{globalThis.fetch=originalFetch;db.sqlite.close()}
});
