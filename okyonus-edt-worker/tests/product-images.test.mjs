import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import worker from '../dist/deniz-worker.monolithic.final.js';
const manifest=JSON.parse(fs.readFileSync(new URL('../assets/storefront/verified-product-images.json',import.meta.url)));
const approved=Object.entries(manifest).filter(([,v])=>v.asset);
const source=fs.readFileSync(new URL('../src/commerce-v2.js',import.meta.url),'utf8');
const resolver=vm.runInNewContext(source.slice(source.indexOf('const VERIFIED_PRODUCT_IMAGES'),source.indexOf('// V24_FLUID_3COL'))+'\ncommerceProductImage;');
test('all approved photographs have intact original bytes and rejected references have no deployed asset',()=>{
 assert.equal(approved.length,134);
 for(const [id,v] of Object.entries(manifest)) {
  if(v.asset){const bytes=fs.readFileSync(new URL('../'+v.asset,import.meta.url));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),v.sha256,id);assert.ok(v.source&&v.evidence,id)}
  else assert.equal(v.status,'rejected-after-visual-review',id);
 }
});
test('complete legacy catalog resolves only its reviewed product photographs',async()=>{
 const response=await worker.fetch(new Request('https://www.okyonusedt.com/api/products'),{}, {waitUntil(){}});
 assert.equal(response.status,200);const body=await response.json();const products=body.products||body;assert.equal(products.length,1319);
 const mapped=products.filter(p=>p.image);assert.equal(mapped.length,134);
 for(const p of products){const entry=manifest[p.id];assert.equal(Boolean(p.image),Boolean(entry?.asset),p.id);if(p.image)assert.ok(p.image.endsWith('/'+entry.asset),p.id)}
});
test('default photographs cannot leak onto renamed, repackaged or different-brand products',()=>{
 const [id,v]=approved.find(([,v])=>v.amount||v.package);const p={id,name:v.name,brand:v.brand,amount:v.amount,package:v.package};const url=resolver(p);assert.ok(url);
 assert.equal(resolver({...p,name:p.name+' başka'}),'');assert.equal(resolver({...p,brand:'Başka marka'}),'');assert.equal(resolver({...p,package_text:'Farklı ambalaj'}),'');
 assert.equal(resolver({...p,id:'managed-id',source_product_id:id,package_text:[v.amount,v.package].filter(Boolean).join(' • ')}),url);
 assert.equal(resolver({...p,image_url:null}),url);assert.equal(resolver({...p,image_url:''}),'');assert.equal(resolver({...p,image:''}),'');
 assert.equal(resolver({...p,image_url:'https://example.com/own-product.jpg'}),'https://example.com/own-product.jpg');assert.equal(resolver({id:'unknown',name:'Unknown'}),'');
 assert.equal(resolver({id:'unknown',name:'Unknown',image:'https://example.com/seafood-fish.svg'}),'');
});
