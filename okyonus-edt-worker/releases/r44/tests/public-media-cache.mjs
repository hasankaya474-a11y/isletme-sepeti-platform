import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
const root=process.argv[2]||new URL('..',import.meta.url).pathname;
for(const file of ['deniz.mjs','zaman.mjs']){
 const s=await readFile(root+'/'+file,'utf8'),a=s.indexOf('function okyR40SecureResponse'),b=s.indexOf('\nexport default {',a),c={Headers,Response,URL};vm.createContext(c);vm.runInContext(s.slice(a,b),c);
 const asset='/studio-media/11111111-1111-1111-1111-111111111111.png';
 for(const admin of [false,true])for(const method of ['GET','HEAD']){
  const r=c.okyR40SecureResponse(new Request('https://example.com'+asset,{method,headers:{cookie:'session=value',authorization:'Bearer example'}}),new Response('png',{headers:{'content-type':'image/png','cache-control':'public, max-age=3600'}}),admin);assert.equal(r.headers.get('cache-control'),'public, max-age=3600');
 }
 for(const [path,status,type,setCookie]of [[asset,404,'application/json',false],[asset,200,'text/html',false],[asset,200,'image/png',true],['/studio-media/private.png',200,'image/png',false],['/api/storefront-v2',200,'application/json',false],['/api/member/me',200,'application/json',false],['/commerce',200,'text/html',false]]){
  const headers={'content-type':type};if(setCookie)headers['set-cookie']='session=value';const r=c.okyR40SecureResponse(new Request('https://example.com'+path,{headers:{cookie:'session=value'}}),new Response('data',{status,headers}),true);assert.equal(r.headers.get('cache-control'),'private, no-store',path);
 }
}
console.log('Public media cache PASS: successful UUID raster GET/HEAD caches; errors, nonimages, cookies set, private IDs, settings/member/admin remain no-store.');
