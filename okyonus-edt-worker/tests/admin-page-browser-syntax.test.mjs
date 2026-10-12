import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('canonical admin renders valid browser script and catalog controls',async()=>{
const source=fs.readFileSync(new URL('../src/zaman-admin-worker.js',import.meta.url),'utf8').replace(/export default\s*\{/,'globalThis.__worker={');
const context=vm.createContext({console,Response,Request,Headers,URL,URLSearchParams,crypto:globalThis.crypto,TextEncoder,TextDecoder,setTimeout,clearTimeout,atob,btoa});
vm.runInContext(source,context);
const response=vm.runInContext('commerceAdminPage({})',context),html=await response.text();let scripts=0;
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)){if(match[1].trim()){assert.doesNotThrow(()=>new vm.Script(match[1]));scripts++}}
assert.ok(scripts>0);
for(const text of ['Ürün Adı','Ürün Görseli','İndirimli Fiyat','Görseli Kaldır','Görsel Yükle','Kampanya Kuralları','Teslimat Günleri'])assert.ok(html.includes(text),text);
assert.match(html,/X-CSRF-Token/);assert.match(html,/bindImageEditors/);
});
