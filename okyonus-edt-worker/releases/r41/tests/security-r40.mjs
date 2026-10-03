import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const directory=process.argv[2]||new URL('..',import.meta.url).pathname;
const worker=(await import(pathToFileURL(directory+'/deniz.mjs'))).default;
let r=await worker.fetch(new Request('https://example.com/api/health'),{},{});
assert.equal(r.status,200);assert.equal((await r.json()).scope,'web-worker');assert.match(r.headers.get('cache-control'),/no-store/);
r=await worker.fetch(new Request('https://example.com/api/health',{method:'POST'}),{},{});assert.equal(r.status,405);
r=await worker.fetch(new Request('https://example.com/api/health',{method:'HEAD'}),{},{});assert.equal(await r.text(),'');
const source=await readFile(directory+'/deniz.mjs','utf8');
const helper=source.slice(source.indexOf('function okyR40SecureResponse'),source.indexOf('\nexport default {',source.indexOf('function okyR40SecureResponse')));
const context={Request,Response,Headers,URL};vm.createContext(context);vm.runInContext(helper,context);
for(const url of ['/','/api/member/me','/uye']){
 const response=context.okyR40SecureResponse(new Request('https://example.com'+url,{headers:{Cookie:'session=example'}}),new Response('ok',{headers:{'cache-control':'public,max-age=99','set-cookie':'a=b; Secure; HttpOnly'}}));
 assert.equal(response.headers.get('x-frame-options'),'DENY');assert.match(response.headers.get('cache-control'),/private, no-store/);assert.match(response.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.equal(response.headers.get('set-cookie'),'a=b; Secure; HttpOnly');
}
const admin=context.okyR40SecureResponse(new Request('https://example.com/commerce'),new Response('ok'),true);assert.match(admin.headers.get('cache-control'),/no-store/);
console.log('Security R40: health GET/HEAD/POST, hardened headers, session/admin no-store, cookie preservation passed.');
