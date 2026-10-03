import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import vm from 'node:vm';
const root=process.argv[2]||new URL('..',import.meta.url).pathname;
let source=await readFile(root+'/deniz.mjs','utf8');const start=source.indexOf('async function okyR44ReadStudioAsset');assert(start>=0,'Media adapter must be integrated before this test');source=source.slice(start);const end=source.indexOf('\n}\n');assert(end>=0);source=source.slice(0,end+3);const c={URL,Headers,Response};vm.createContext(c);vm.runInContext(source,c);
let reads=0;const store={getWithMetadata:async(key)=>{reads++;assert(key.startsWith('studio/'));return {value:new Uint8Array([137,80,78,71,13,10,26,10]),metadata:{mime:'image/png',size:8}}}};
for(const path of ['/studio-media/private','/studio-media/secret.txt','/studio-media/%2e%2e%2fphoto','/studio-media/11111111-1111-1111-1111-111111111111.svg','/studio-media/11111111-1111-1111-1111-111111111111.png/other']){
 const r=await c.okyR44ReadStudioAsset(new Request('https://example.com'+path),{MEDIA_STORE:store});assert.equal(r.status,404,path);
}assert.equal(reads,0);
const valid='https://example.com/studio-media/11111111-1111-1111-1111-111111111111.png';let r=await c.okyR44ReadStudioAsset(new Request(valid,{method:'POST'}),{MEDIA_STORE:store});assert.equal(r.status,405);assert.equal(reads,0);
r=await c.okyR44ReadStudioAsset(new Request(valid),{MEDIA_STORE:store});assert.equal(r.status,200);assert.equal((await r.arrayBuffer()).byteLength,8);assert.equal(reads,1);
r=await c.okyR44ReadStudioAsset(new Request(valid,{method:'HEAD'}),{MEDIA_STORE:store});assert.equal(r.status,200);assert.equal(await r.text(),'');
r=await c.okyR44ReadStudioAsset(new Request(valid),{MEDIA_STORE:{get:async(key)=>({body:new Uint8Array([1]),httpMetadata:{contentType:'text/html'},size:1})}});assert.equal(r.status,415);
console.log('Media public security PASS: malformed/private/traversal IDs never read; POST refused; public raster GET/HEAD allowed; unsafe MIME refused.');
