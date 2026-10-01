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
  const pageHtml=await (await commerceAdminPage()).text();parseScripts(pageHtml,'opening admin');assert.equal(pageHtml.match(/<button data-r="([^"]+)"/)[1],'opening');assert.ok(pageHtml.includes("let current='opening'"));
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
