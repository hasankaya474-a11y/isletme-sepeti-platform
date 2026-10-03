import assert from 'node:assert/strict';import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';import {pathToFileURL} from 'node:url';
class D1 {
 constructor(){this.db=new DatabaseSync(':memory:');this.queries=[]}
 prepare(sql){const owner=this;let values=[];return {bind(...args){values=args;return this},async first(column){owner.queries.push(sql);const row=owner.db.prepare(sql).get(...values);return column?row?.[column]:row||null},async all(){owner.queries.push(sql);return {success:true,results:owner.db.prepare(sql).all(...values)}},async run(){owner.queries.push(sql);const r=owner.db.prepare(sql).run(...values);return {success:true,meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}}}}
 async batch(items){this.db.exec('BEGIN');try{const out=[];for(const item of items)out.push(await item.run());this.db.exec('COMMIT');return out}catch(e){this.db.exec('ROLLBACK');throw e}}
}


const deniz=(await import(pathToFileURL(process.argv[2]||'/tmp/media-r44-deniz.mjs'))).default;
const source=fs.readFileSync(process.argv[3]||'/tmp/media-r44-zaman.mjs','utf8');
const {commerceAdminApi,studioMediaRoute,publicStudioMedia}=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {commerceAdminApi,studioMediaRoute,publicStudioMedia};').toString('base64'));
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jD1sAAAAASUVORK5CYII=','base64');
const owner={user:{role:'owner',id:'test-owner'},session:{id:'test-session'}};
const req=(route,method='GET',body)=>new Request('https://www.okyonusedt.com'+route,{method,...(body!==undefined?{headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})});
for(const kind of ['KV','R2']){
 const db=new D1(),items=new Map();let reads=0;
 const store={async put(k,b,o){items.set(k,{b,o})},async delete(k){items.delete(k)}};
 if(kind==='KV')store.getWithMetadata=async k=>{reads++;const x=items.get(k);return x?{value:x.b,metadata:x.o.metadata}:null};
 else store.get=async k=>{reads++;const x=items.get(k);return x?{body:x.b,size:x.b.byteLength,httpMetadata:x.o.httpMetadata,customMetadata:x.o.customMetadata}:null};
 const env={DB:db,ADMIN_DB:db,MEDIA_STORE:store};
 const call=(route,b)=>commerceAdminApi(req('/api/commerce/'+route,b===undefined?'GET':'POST',b),env,owner,new Headers());
 await call('summary');
 db.db.exec(`CREATE TABLE media(id TEXT PRIMARY KEY,storage_key TEXT,original_name TEXT,media_type TEXT,mime_type TEXT,byte_size INTEGER,sha256 TEXT,width INTEGER,height INTEGER,duration_ms INTEGER,alt_text TEXT,title TEXT,metadata_json TEXT,status TEXT,created_by TEXT,created_at TEXT,updated_at TEXT);
 CREATE TABLE audit_log(occurred_at TEXT,actor_user_id TEXT,actor_session_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,request_id TEXT,ip_hash TEXT,before_json TEXT,after_json TEXT,metadata_json TEXT)`);
 const fd=new FormData();fd.append('file',new File([png],'actual.png',{type:'image/png'}));
 const uploadRequest=new Request('https://www.okyonusedt.com/api/studio-media',{method:'POST',body:fd});
 const upload=await studioMediaRoute(uploadRequest,env,owner,new Headers(),null,null,new URL(uploadRequest.url));assert.equal(upload.status,201);const data=await upload.json();assert.equal(data.size,png.length);assert.equal(items.size,1);
 const image=await deniz.fetch(req(new URL(data.url).pathname),env,{});assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png');assert.deepEqual(Buffer.from(await image.arrayBuffer()),png);
 const head=await deniz.fetch(req(new URL(data.url).pathname,'HEAD'),env,{});assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
 const adminImage=await publicStudioMedia(req(new URL(data.url).pathname),env,new Headers(),new URL(data.url));assert.equal(adminImage.status,200);assert.deepEqual(Buffer.from(await adminImage.arrayBuffer()),png);
 const product=await(await call('products',{name:kind+' uploaded product',category:'Deniz Ürünleri',imageUrl:data.url,description:'Verified uploaded PNG',featured:true,price:10})).json();
 let home=await(await deniz.fetch(req('/api/storefront-v2'),env,{})).json();assert.equal(home.products.find(x=>x.id===product.id).image,data.url);assert.equal(home.products.find(x=>x.id===product.id).description,'Verified uploaded PNG');
 const bannerResponse=await call('banners',{title:kind+' uploaded banner',desktopImage:data.url,mobileImage:data.url,active:true});assert.equal(bannerResponse.status,201);home=await(await deniz.fetch(req('/api/storefront-v2'),env,{})).json();assert.equal(home.banners[0].desktop_image,data.url);
 const beforeReads=reads;
 for(const invalid of ['/studio-media/not-a-uuid.png','/studio-media/private.pdf','/studio-media/%2E%2E%2Fprivate.png'])assert.equal((await deniz.fetch(req(invalid),env,{})).status,404);
 assert.equal(reads,beforeReads);
 assert.equal((await deniz.fetch(req('/studio-media/../unknown'),env,{})).status,404);
 assert.equal((await deniz.fetch(req(new URL(data.url).pathname,'POST',{}),env,{})).status,405);
 assert.equal(reads,beforeReads);
 console.log('PASS '+kind+' actual PNG upload → metadata → public/admin GET/HEAD → product homepage → banner API');
}
