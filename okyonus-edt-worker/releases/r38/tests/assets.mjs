import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../deniz.mjs';
const manifest=JSON.parse(fs.readFileSync(new URL('../assets-manifest.json',import.meta.url)));
for(const [path,asset] of Object.entries(manifest)){
 for(const method of ['GET','HEAD']){
  const response=await worker.fetch(new Request('https://www.okyonusedt.com'+path,{method}),{},{});
  assert.equal(response.status,302);assert.equal(response.headers.get('location'),asset.url);assert.equal(await response.text(),'');
 }
 assert.equal((await worker.fetch(new Request('https://www.okyonusedt.com'+path,{method:'POST'}),{},{})).status,405);
}
assert.equal((await worker.fetch(new Request('https://www.okyonusedt.com/assets/oky-embedded-r36/missing.jpg'),{},{})).status,404);
console.log('PASS 30 immutable assets: GET/HEAD redirects, method guards and missing asset 404');
