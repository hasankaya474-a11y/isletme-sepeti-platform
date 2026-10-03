import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {DatabaseSync} from 'node:sqlite';
const dir=path.resolve(process.argv[2]||'work'),results=[];
class D1 {
 constructor(){this.db=new DatabaseSync(':memory:');this.queries=[]}
 prepare(sql){const owner=this;let values=[];return {bind(...args){values=args;return this},async first(column){owner.queries.push(sql);const row=owner.db.prepare(sql).get(...values);return column?row?.[column]:row||null},async all(){owner.queries.push(sql);return {success:true,results:owner.db.prepare(sql).all(...values)}},async run(){owner.queries.push(sql);const r=owner.db.prepare(sql).run(...values);return {success:true,meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}}}}
 async batch(items){this.db.exec('BEGIN');try{const out=[];for(const item of items)out.push(await item.run());this.db.exec('COMMIT');return out}catch(e){this.db.exec('ROLLBACK');throw e}}
}
const deniz=(await import(pathToFileURL(path.join(dir,'deniz.mjs'))+'?validation='+Date.now())).default;
const zamanSource=await fs.readFile(path.join(dir,'zaman.mjs'),'utf8');
const zamanModule=await import('data:text/javascript;base64,'+Buffer.from(zamanSource+'\nexport { commerceAdminApi,commerceAdminPage'+(zamanSource.includes('async function dailyInboxRoute(')?',dailyInboxRoute':'')+(zamanSource.includes('async function dailyDetailEnvironment(')?',messageCenterRoute,photoMessageRouteV2':'')+' };').toString('base64'));
const zaman=zamanModule.default,db=new D1(),env={DB:db,ADMIN_DB:db};
const req=(route,method='GET',body)=>new Request('https://www.okyonusedt.com'+route,{method,...(body?{body:JSON.stringify(body),headers:{'content-type':'application/json'}}:{})});
async function test(name,fn){try{await fn();results.push({name,pass:true});console.log('PASS',name)}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL',name,e.message)}}
let home='';
await test('public pages reachable without membership',async()=>{for(const r of ['/','/urunler','/sepet','/iletisim','/yardim','/markalar','/kampanyalar','/teslimat']){const response=await deniz.fetch(req(r),{},{});assert.equal(response.status,200,r);const text=await response.text();assert.ok(text.includes('<html'),r);if(r==='/')home=text}});
await test('About routes execute the commerce shell in its lexical scope',async()=>{
 for(const path of ['/hakkimizda','/about']){
  const response=await deniz.fetch(req(path),{},{});assert.equal(response.status,200,path);
  const html=await response.text();assert.ok(html.includes('Okyanus EDT Hakkında'),path);
  assert.ok(html.includes('Hasan Kaya'));assert.ok(html.includes('Orhan Güngör'));
  assert.ok(html.includes('rel="canonical"'));assert.ok(!html.includes('COST Radar'));
  for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(!match[0].includes('application/ld+json'))new vm.Script(match[1]);
  const head=await deniz.fetch(req(path,'HEAD'),{},{});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }
});
await test('HEAD suppresses all public bodies',async()=>{for(const r of ['/','/urunler','/sepet','/iletisim','/api/storefront-v2']){const response=await deniz.fetch(req(r,'HEAD'),{},{});assert.equal((await response.text()).length,0,r)}});
await test('eight category links and hero before category markup',async()=>{for(const c of ['deniz-urunleri','donuk-urunler','et-sarkuteri','sut-sarkuteri','yaglar','soslar','kuru-gida','baharat'])assert.ok(home.includes('category='+c),c);const hero=home.indexOf('class="hero'),categories=home.indexOf('id="commerce-categories"');assert.ok(hero>=0);assert.ok(categories>hero,'categoryGrid must follow hero');});
await test('anonymous quote blocked',async()=>{const r=await deniz.fetch(req('/api/quote','POST',{products:[]}),{},{});assert.equal(r.status,401);assert.equal((await r.json()).error,'UNAUTHENTICATED')});
await test('admin pages and API require auth',async()=>{assert.equal((await zaman.fetch(req('/commerce'),{},{})).status,302);assert.equal((await zaman.fetch(req('/api/commerce/products'),{},{})).status,401)});
await test('real SQLite D1 commerce schema initializes',async()=>{const r=await zamanModule.commerceAdminApi(req('/api/commerce/summary'),env,{user:{role:'owner',id:'test-owner'}},new Headers());assert.equal(r.status,200);const body=await r.json();assert.equal(body.ok,true);assert.ok(db.db.prepare("SELECT count(*) n FROM sqlite_master WHERE type='table'").get().n>=15)});
await test('schema initialization memoized',async()=>{db.queries=[];await zamanModule.commerceAdminApi(req('/api/commerce/summary'),env,{user:{role:'owner',id:'test-owner'}},new Headers());assert.equal(db.queries.filter(x=>x.includes('CREATE TABLE')).length,0)});
await test('SQLite storefront returns eight categories and 200 SEO entries',async()=>{const r=await deniz.fetch(req('/api/storefront-v2'),env,{});assert.equal(r.status,200);const b=await r.json();assert.equal(b.ok,true);assert.ok(b.categories.length>=8);assert.equal(b.seo.length,200);assert.ok(b.products.length>0);assert.ok(!b.products.some(x=>'cardHtml' in x));});
await test('admin featured selection propagates with no twelve-card cap',async()=>{
 const rows=db.db.prepare('SELECT id FROM b2b_products_v1 WHERE active=1 LIMIT 16').all();assert.equal(rows.length,16);const owner={user:{role:'owner',id:'test-owner'}};
 for(const row of rows){const r=await zamanModule.commerceAdminApi(req('/api/commerce/product-featured/'+row.id,'POST',{featured:1}),env,owner,new Headers());assert.equal(r.status,200)}
 let data=await (await deniz.fetch(req('/api/storefront-v2'),env,{})).json();assert.ok(data.homepageAuthoritative);assert.equal(data.products.filter(p=>Number(p.featured)===1).length,16);
 await zamanModule.commerceAdminApi(req('/api/commerce/product-featured/'+rows[0].id,'POST',{featured:0}),env,owner,new Headers());
 data=await (await deniz.fetch(req('/api/storefront-v2'),env,{})).json();assert.equal(data.products.filter(p=>Number(p.featured)===1).length,15);assert.equal(Number(data.products.find(p=>p.id===rows[0].id).featured),0);
 const denied=await zamanModule.commerceAdminApi(req('/api/commerce/product-featured/'+rows[0].id,'POST',{featured:1}),env,{user:{role:'viewer',id:'read-only'}},new Headers());assert.equal(denied.status,403);
});
await test('cart badge runtime preserves count across reload',async()=>{const scripts=[...home.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);const script=scripts.find(x=>x.includes("const K='oky-commerce-cart-v2'")&&x.includes('[data-cart-count]')&&!x.includes('fetch('));assert.ok(script,'cart count runtime missing');const storage=new Map([['oky-commerce-cart-v2',JSON.stringify([{id:'a',qty:3},{id:'b',qty:1}])]]);for(let reload=0;reload<2;reload++){const count={textContent:''};vm.runInNewContext(script,{localStorage:{getItem:k=>storage.get(k)},window:{addEventListener(){}},document:{querySelectorAll:()=>[count],addEventListener(){}}});assert.equal(count.textContent,'2')}});
await test('catalog browser add, quantities and stock guards',async()=>{
 const h=await (await deniz.fetch(req('/urunler'),{},{})).text();const script=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(x=>x.includes('cq.oninput'));assert.ok(script);
 const listeners={},storage=new Map(),q={value:'1',min:'1',step:'1'},card={querySelector:()=>q};
 const context={window:{},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},location:{search:'',pathname:'/urunler',href:'https://www.okyonusedt.com/urunler'},URLSearchParams,Event,Intl,setTimeout:()=>0,cq:{value:''},cc:{value:'',innerHTML:''},catalogCount:{},catalogGrid:{},catalogTools:{},document:{addEventListener:(name,fn)=>listeners[name]=fn,dispatchEvent(){}},fetch:async url=>({ok:true,json:async()=>url.includes('storefront')?{catalogAuthoritative:true,products:[{id:'available',name:'Test',unit:'Kg',category:'Deniz Ürünleri',price:9,min_order_qty:1,qty_step:1,stock_status:'ORDER'},{id:'out',name:'Out',stock_status:'Stok yok'}]}:{products:[]}})};
 const initializer=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(x=>x.includes('window.okyStorefrontRead=window.okyStorefrontRead||'));assert.ok(initializer,'actual header reader initializer missing');vm.runInNewContext(initializer,context);vm.runInNewContext(script,context);for(let i=0;i<30;i++)await Promise.resolve();
 function click(selector,id='available'){const b={dataset:{add:id,name:'Test',unit:'Kg'},closest:()=>card,matches:s=>s===selector,textContent:''};listeners.click({target:b});return b}
 click('[data-minus]');assert.equal(Number(q.value),1);click('[data-plus]');assert.equal(Number(q.value),2);click('[data-add]');let cart=JSON.parse(storage.get('oky-commerce-cart-v2'));assert.equal(cart[0].qty,2);assert.equal(cart[0].price,9);click('[data-add]');cart=JSON.parse(storage.get('oky-commerce-cart-v2'));assert.equal(cart.length,1);assert.equal(cart[0].qty,4);click('[data-add]','out');assert.equal(JSON.parse(storage.get('oky-commerce-cart-v2')).length,1);
});
await test('HTML inline browser scripts parse',async()=>{for(const route of ['/','/urunler','/sepet','/iletisim']){const h=await (await deniz.fetch(req(route),env,{})).text();for(const [index,m] of [...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries()){if(m[0].includes('application/ld+json'))continue;try{new vm.Script(m[1])}catch(e){throw Error(route+' script '+index+': '+e.message)}}}});
await test('admin generated inline scripts parse',async()=>{
 const r=zamanModule.commerceAdminPage(new Headers()),h=await r.text();let count=0;
 for(const m of h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){new vm.Script(m[1]);count++}assert.ok(count>0);
});
if(zamanModule.dailyInboxRoute)await test('SQLite inbox union, status transitions, filters, role and audit',async()=>{
 const inboxDB=new D1(),inboxEnv={DB:inboxDB};
 inboxDB.db.exec(`CREATE TABLE inquiries(id TEXT PRIMARY KEY,name TEXT,company TEXT,phone TEXT,email TEXT,subject TEXT,created_at TEXT,status TEXT);
 CREATE TABLE photo_inquiries(id TEXT PRIMARY KEY,request_no TEXT,contact_name TEXT,business_name TEXT,phone TEXT,created_at TEXT,status TEXT);
 CREATE TABLE b2b_quotes_v1(id TEXT PRIMARY KEY,quote_no TEXT,contact_name TEXT,company_name TEXT,phone TEXT,email TEXT,created_at TEXT,status TEXT);
 CREATE TABLE audit_log(occurred_at TEXT,actor_user_id TEXT,actor_session_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,request_id TEXT,ip_hash TEXT,before_json TEXT,after_json TEXT,metadata_json TEXT);
 INSERT INTO inquiries VALUES('contact-1','Hasan','Okyanus','1','a@example.com','Test_100%','2026-10-02T01:00:00Z','NEW');
 INSERT INTO photo_inquiries VALUES('photo-1','P1','Fotoğraf','Firma','2','2026-10-02T02:00:00Z','REVIEWING');
 INSERT INTO b2b_quotes_v1 VALUES('quote-1','Q1','Teklif','Firma','3','b@example.com','2026-10-02T03:00:00Z','PRICED');`);
 const owner={user:{role:'owner',id:'owner'},session:{id:'session'}};
 const call=async(url,method='GET',body,auth=owner)=>{const r=req(url,method,body);return zamanModule.dailyInboxRoute(r,inboxEnv,auth,new Headers(),new URL(r.url))};
 let r=await call('/api/daily-inbox?status=WAITING'),b=await r.json();assert.equal(r.status,200);assert.equal(b.total,2);assert.equal(b.counts.NEW,1);assert.equal(b.counts.IN_PROGRESS,1);assert.equal(b.counts.ANSWERED,1);
 r=await call('/api/daily-inbox','POST',{source:'contact',id:'contact-1',status:'ANSWERED'});assert.equal(r.status,200);assert.equal((await r.json()).ok,true);
 b=await (await call('/api/daily-inbox?status=WAITING')).json();assert.equal(b.total,1);assert.equal(b.counts.ANSWERED,2);
 b=await (await call('/api/daily-inbox?source=contact&q='+encodeURIComponent('Test_100%'))).json();assert.equal(b.total,1);
 assert.equal(inboxDB.db.prepare('SELECT count(*) n FROM audit_log').get().n,1);
 await assert.rejects(()=>call('/api/daily-inbox','POST',{source:'contact',id:'contact-1',status:'COMPLETED'},{user:{role:'viewer'}}),e=>e.status===403);
 await assert.rejects(()=>call('/api/daily-inbox','POST',{source:'contact',id:'missing',status:'COMPLETED'}),e=>e.status===404);
 assert.equal(inboxDB.db.prepare('SELECT count(*) n FROM oky_daily_inbox_status_v1').get().n,1);
});
if(zamanModule.messageCenterRoute)await test('separate D1 bindings preserve inbox source, details and auth audit',async()=>{
 const authDB=new D1(),adminDB=new D1(),commerceDB=new D1(),auditSchema=`CREATE TABLE audit_log(occurred_at TEXT,actor_user_id TEXT,actor_session_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,request_id TEXT,ip_hash TEXT,before_json TEXT,after_json TEXT,metadata_json TEXT)`;
 const contactSchema=`CREATE TABLE inquiries(id TEXT PRIMARY KEY,name TEXT,company TEXT,phone TEXT,email TEXT,subject TEXT,created_at TEXT,status TEXT)`;
 const photoSchema=`CREATE TABLE photo_inquiries(id TEXT PRIMARY KEY,request_no TEXT,business_name TEXT,contact_name TEXT,phone TEXT,status TEXT,media_name TEXT,media_mime TEXT,media_size INTEGER,media_expires_at TEXT,opened_at TEXT,downloaded_at TEXT,deleted_at TEXT,claimed_by TEXT,created_at TEXT,updated_at TEXT,temp_media_key TEXT,claimed_at TEXT,last_error TEXT,version INTEGER DEFAULT 0,media_sha256 TEXT,delete_attempts INTEGER DEFAULT 0,deletion_result TEXT)`;
 const quoteSchema=`CREATE TABLE b2b_quotes_v1(id TEXT PRIMARY KEY,quote_no TEXT,contact_name TEXT,company_name TEXT,phone TEXT,email TEXT,created_at TEXT,status TEXT)`;
 for(const database of [authDB,adminDB,commerceDB])database.db.exec(contactSchema+';'+photoSchema+';'+quoteSchema+';'+auditSchema+';');
 authDB.db.exec("INSERT INTO inquiries VALUES('same-contact','Wrong auth source','decoy','0','wrong@example.com','Decoy','2026-10-02T01:00:00Z','NEW'); INSERT INTO b2b_quotes_v1 VALUES('quote-main','Q1','Actual quote','Auth DB','1','q@example.com','2026-10-02T03:00:00Z','NEW')");
 adminDB.db.exec("INSERT INTO inquiries VALUES('same-contact','Actual contact','Admin DB','1','right@example.com','Contact','2026-10-02T01:00:00Z','new'); INSERT INTO b2b_quotes_v1 VALUES('quote-decoy','QD','Wrong admin quote','decoy','0','wrong@example.com','2026-10-02T04:00:00Z','NEW'); INSERT INTO photo_inquiries(id,request_no,business_name,contact_name,phone,status,media_name,media_mime,media_size,created_at,updated_at,temp_media_key) VALUES('photo-main','P1','Admin DB','Actual photo','1','NEW','photo.jpg','image/jpeg',3,'2026-10-02T02:00:00Z','2026-10-02T02:00:00Z','temporary-key')");
 commerceDB.db.exec("INSERT INTO inquiries VALUES('commerce-decoy','Wrong commerce source','decoy','0','wrong@example.com','Decoy','2026-10-02T05:00:00Z','NEW')");
 const separate={DB:authDB,ADMIN_DB:adminDB,COMMERCE_DB:commerceDB,PHOTO_TEMP:{get:async()=>new ArrayBuffer(3)}},owner={user:{role:'owner',id:'owner'},session:{id:'session'}};
 const inbox=async(route,method='GET',body)=>{const r=req(route,method,body);return zamanModule.dailyInboxRoute(r,separate,owner,new Headers(),new URL(r.url))};
 let b=await (await inbox('/api/daily-inbox?status=WAITING')).json();assert.equal(b.total,3);assert.deepEqual(b.data.map(x=>x.id),['quote-main','photo-main','same-contact']);assert.equal(b.data.find(x=>x.source==='contact').name,'Actual contact');
 b=await (await inbox('/api/daily-inbox?status=WAITING&offset=1&limit=1')).json();assert.equal(b.total,3);assert.deepEqual(b.data.map(x=>x.id),['photo-main']);
 await inbox('/api/daily-inbox','POST',{source:'contact',id:'same-contact',status:'ANSWERED'});assert.equal(adminDB.db.prepare("SELECT status FROM oky_daily_inbox_status_v1 WHERE source='contact'").get().status,'ANSWERED');assert.equal(authDB.db.prepare('SELECT count(*) n FROM audit_log').get().n,1);
 assert.equal(adminDB.db.prepare('SELECT count(*) n FROM audit_log').get().n,0);
 const detail=async(fn,id,action='',method='GET',body)=>{const r=req('/api/detail/'+id,method,body);return fn(r,separate,owner,new Headers(),id,action,new URL(r.url))};
 b=await (await detail(zamanModule.messageCenterRoute,'same-contact')).json();assert.equal(b.data.inquiry.name,'Actual contact');assert.deepEqual(b.data.replies,[]);
 await detail(zamanModule.messageCenterRoute,'same-contact','status','POST',{status:'read'});assert.equal(adminDB.db.prepare("SELECT status FROM inquiries WHERE id='same-contact'").get().status,'read');assert.equal(authDB.db.prepare("SELECT status FROM inquiries WHERE id='same-contact'").get().status,'NEW');
 const draft=await detail(zamanModule.messageCenterRoute,'same-contact','reply','POST',{body:'Test draft',mode:'draft'});assert.equal(draft.status,201);assert.equal(adminDB.db.prepare('SELECT recipient FROM inquiry_replies').get().recipient,'right@example.com');
 b=await (await detail(zamanModule.photoMessageRouteV2,'photo-main')).json();assert.equal(b.data.contact_name,'Actual photo');
 const started=await detail(zamanModule.photoMessageRouteV2,'photo-main','view-start','POST',{});assert.equal(started.status,200);assert.ok((await started.json()).transferToken);assert.equal(adminDB.db.prepare("SELECT status FROM photo_inquiries WHERE id='photo-main'").get().status,'OPENED');
 assert.equal(authDB.db.prepare('SELECT count(*) n FROM audit_log').get().n,4);assert.equal(adminDB.db.prepare('SELECT count(*) n FROM audit_log').get().n,0);assert.equal(commerceDB.db.prepare('SELECT count(*) n FROM audit_log').get().n,0);
});
const report={target:dir,date:new Date().toISOString(),passed:results.filter(x=>x.pass).length,failed:results.filter(x=>!x.pass).length,results};
await fs.writeFile(path.join(path.dirname(fileURLToPath(import.meta.url)),'last-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));process.exitCode=report.failed?1:0;
