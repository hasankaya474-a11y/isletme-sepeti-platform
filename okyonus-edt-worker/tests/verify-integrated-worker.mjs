import assert from 'node:assert/strict';
import vm from 'node:vm';
import {MockD1,migrationContext} from './verify-catalog-migration.mjs';
const worker=(await import(new URL('../src/deniz-worker.js',import.meta.url))).default;
const DB=new MockD1();const env={ADMIN_DB:DB,DB};const context={waitUntil(){}};
async function get(path){const response=await worker.fetch(new Request('https://www.okyonusedt.com'+path),env,context);const body=await response.text();let json;try{json=JSON.parse(body)}catch{};return {status:response.status,body,json}}
const all=await get('/api/storefront-v2');console.log('catalog',all.status,all.json?.products?.length,all.json?.total,all.json?.hasMore);assert.equal(all.status,200);assert.equal(DB.rows('SELECT * FROM b2b_products_v1').length,833);
const source=JSON.parse(vm.runInContext('JSON.stringify(OKY_EDT_SOURCE_CATALOG)',migrationContext()));
for(const category of ['dondurulmus-urunler','icecekler','dondurulmus-patates']){const res=await get('/api/storefront-v2?category='+category);console.log(category,res.status,res.json?.products?.length,res.json?.total);assert.equal(res.status,200);assert.ok(res.json?.products?.length>0)}
const beyond=source[700];const detail=await get('/api/storefront-v2?product='+encodeURIComponent(beyond.id));assert.equal(detail.status,200);console.log('detail target',beyond.id,'returned',detail.json.products.map(p=>[p.id,p.name]));assert.ok(detail.json.products.some(p=>p.name===beyond.name));
const page=await get('/urun/'+beyond.id);assert.equal(page.status,200);assert.ok(page.body.includes(beyond.name));
const old=await get('/api/storefront-v2?product=old-nonsea');assert.equal(old.json.products.length,0);const oldpage=await get('/urun/old-nonsea');assert.equal(oldpage.status,404);
const home=await get('/api/storefront-v2?scope=home');console.log('home',home.json.products.length);assert.equal(home.json.products.length,13);assert.ok(home.json.products.every(p=>!p.id.startsWith('edt_')));
const seafood=await get('/api/b2b/products');console.log('seafood',seafood.status,seafood.json?.count);assert.equal(seafood.status,200);assert.equal(seafood.json.products.length,44);assert.ok(seafood.json.products.every(p=>!p.id.startsWith('edt_')));
const collected=[];for(let offset=0;offset<1000;offset+=200){const res=await get('/api/storefront-v2?offset='+offset+'&productsOnly=1');assert.equal(res.status,200);collected.push(...res.json.products);if(!res.json.hasMore)break}assert.equal(collected.length,833);assert.equal(new Set(collected.map(p=>p.id)).size,833);for(const p of source){const got=collected.find(x=>x.id===p.id);assert.ok(got,p.id);assert.equal(got.name,p.name);assert.equal(got.image,p.image);assert.equal(got.effectivePrice,p.price)}
console.log('Integrated worker API tests PASS');
