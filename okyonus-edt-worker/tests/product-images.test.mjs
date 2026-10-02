import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import worker from '../dist/deniz-worker.monolithic.final.js';
const manifest=JSON.parse(fs.readFileSync(new URL('../assets/storefront/verified-product-images.json',import.meta.url)));
const approved=Object.entries(manifest).filter(([,v])=>v.asset);
const source=fs.readFileSync(new URL('../src/commerce-v2.js',import.meta.url),'utf8');
const resolver=vm.runInNewContext(source.slice(source.indexOf('function commerceProductImage(product){'),source.indexOf('// V24_FLUID_3COL'))+'\ncommerceProductImage;');
test('all approved photographs have intact original bytes and rejected references have no deployed asset',()=>{
 assert.equal(approved.length,134);
 for(const [id,v] of Object.entries(manifest)) {
  if(v.asset){const bytes=fs.readFileSync(new URL('../'+v.asset,import.meta.url));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),v.sha256,id);assert.ok(v.source&&v.evidence,id)}
  else assert.equal(v.status,'rejected-after-visual-review',id);
 }
});
test('complete legacy catalog keeps identity while default photographs are removed',async()=>{
 const response=await worker.fetch(new Request('https://www.okyonusedt.com/api/products'),{}, {waitUntil(){}});
 assert.equal(response.status,200);const body=await response.json();const products=body.products||body;assert.equal(products.length,1319);
 assert.equal(new Set(products.map(p=>p.id)).size,1319);
 assert.ok(products.every(p=>typeof p.name==='string'&&p.name.length>0));
 assert.equal(products.filter(p=>p.image||p.image_url).length,0);
});
test('managed photographs use only explicit current images and respect removal',()=>{
 const [id,v]=approved.find(([,v])=>v.amount||v.package);const p={id,name:v.name,brand:v.brand,amount:v.amount,package:v.package};
 assert.equal(resolver(p),'');
 assert.equal(resolver({...p,image_url:null,image:'https://example.com/old.jpg'}),'');
 assert.equal(resolver({...p,image_url:'',image:'https://example.com/old.jpg'}),'');
 assert.equal(resolver({...p,image:''}),'');
 assert.equal(resolver({...p,image_url:'https://example.com/own-product.jpg'}),'https://example.com/own-product.jpg');
 assert.equal(resolver({...p,image:'https://example.com/current.webp'}),'https://example.com/current.webp');
 assert.equal(resolver({id:'unknown',name:'Unknown'}),'');
});
