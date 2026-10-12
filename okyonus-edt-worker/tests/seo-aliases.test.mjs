import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/deniz-worker.js';
const fetch=(host,path,method='GET')=>worker.fetch(new Request('https://'+host+path,{method}),{}, {waitUntil(){}});

test('legacy wholesale mince route redirects to its exact canonical SEO page on both hosts',async()=>{
 for(const host of ['okyonusedt.com','www.okyonusedt.com'])for(const method of ['GET','HEAD']){
  let response=await fetch(host,'/toptan-kiyma?utm_source=legacy&q=k%C4%B1yma',method);assert.equal(response.status,301,host+' '+method);if(host==='okyonusedt.com'){assert.equal(response.headers.get('location'),'https://www.okyonusedt.com/toptan-kiyma?utm_source=legacy&q=k%C4%B1yma');response=await fetch('www.okyonusedt.com','/toptan-kiyma?utm_source=legacy&q=k%C4%B1yma',method);assert.equal(response.status,301);}assert.equal(response.headers.get('location'),'https://www.okyonusedt.com/edt-toptan-et-urunleri?utm_source=legacy&q=k%C4%B1yma');if(method==='HEAD')assert.equal(await response.text(),'');
 }
 const response=await fetch('www.okyonusedt.com','/edt-toptan-et-urunleri');assert.equal(response.status,200);const html=await response.text();assert.match(html,/<h1>EDT Toptan Et Ürünleri<\/h1>/);assert.match(html,/<link rel="canonical" href="https:\/\/www\.okyonusedt\.com\/edt-toptan-et-urunleri">/);
});

test('unknown SEO-like paths remain 404 without catch-all redirect',async()=>{
 for(const host of ['okyonusedt.com','www.okyonusedt.com'])for(const path of ['/toptan-kiyma-olmayan','/toptan-bilinmeyen-urun','/edt-toptan-et-urunleri-olmayan']){
  let response=await fetch(host,path);if(host==='okyonusedt.com'){assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://www.okyonusedt.com'+path);response=await fetch('www.okyonusedt.com',path);}assert.equal(response.status,404,host+path);assert.equal(response.headers.get('location'),null,host+path);
 }
});

test('legacy mince alias applies only to read requests',async()=>{
 const response=await fetch('www.okyonusedt.com','/toptan-kiyma','POST');assert.equal(response.status,405);assert.equal(response.headers.get('location'),null);
});
