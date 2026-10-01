import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/deniz-worker.js';

test('rendered storefront navigation resolves every internal link including EDT pages and member tools',async()=>{
 const origin='https://www.okyonusedt.com',ctx={waitUntil(){}},targets=new Set();
 for(const path of ['/','/urunler','/sepet','/yardim','/iletisim','/uye','/kvkk','/gizlilik']){
  const response=await worker.fetch(new Request(origin+path),{},ctx);
  assert.equal(response.status,200,path);
  for(const match of (await response.text()).matchAll(/href=["']([^"']+)["']/g)){
   if(match[1].startsWith('/')&&!match[1].startsWith('//'))targets.add(match[1].split('#')[0]);
  }
 }
 assert.ok(targets.size>=200,'EDT navigation inventory unexpectedly missing');
 for(const path of targets){
  const response=await worker.fetch(new Request(origin+path),{},ctx);
  assert.ok(response.status<400,`${path}: ${response.status}`);
 }
});
