import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../deniz.mjs';
const response = await worker.fetch(new Request('https://www.okyonusedt.com/'), {}, {});
const home = await response.text();
const modules = [...home.matchAll(/<details class="seoModule">([\s\S]*?)<\/details>/g)];
assert.equal(modules.length, 4);
const paths = [];
for (const module of modules) {
  const links = [...module[1].matchAll(/<a href="([^"]+)"/g)].map(m => m[1]);
  assert.equal(links.length, 50);
  paths.push(...links);
}
assert.equal(new Set(paths).size, 200);
assert.match(home, /<h1[^>]*>Okyanus EDT/);
assert.match(home, /rel="canonical" href="https:\/\/www.okyonusedt.com\/"/);
assert.match(home, /EDT Restoran Gıda Tedarikçisi/);
assert.match(home, /application\/ld\+json/);
const sitemap = await (await worker.fetch(new Request('https://www.okyonusedt.com/sitemap.xml'), {}, {})).text();
for (const path of paths) {
  const res = await worker.fetch(new Request('https://www.okyonusedt.com' + path), {}, {});
  assert.equal(res.status, 200, path);
  const html = await res.text();
  assert.ok(html.includes('https://www.okyonusedt.com' + path), path + ' canonical');
  assert.ok(sitemap.includes('https://www.okyonusedt.com' + path), path + ' sitemap');
}
for (const path of ['/uye', '/sepet']) {
  const res = await worker.fetch(new Request('https://www.okyonusedt.com' + path), {}, {});
  assert.match(res.headers.get('x-robots-tag'), /noindex/);
}
const statusScript = [...home.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('okyServiceStatus') && s.includes('/api/health'));
assert.ok(statusScript);
const element = {textContent:'', title:''}, listeners = {}, navigator = {onLine:true};
let success = true;
const context = {
  document:{getElementById:()=>element, hidden:false, addEventListener:(n,f)=>listeners[n]=f},
  navigator, AbortController, Date, setTimeout:()=>1, clearTimeout(){}, setInterval(){},
  addEventListener:(n,f)=>listeners[n]=f,
  fetch:async()=>new Response(JSON.stringify(success?{ok:true}:{ok:false}), {status:success?200:503}),
};
vm.runInNewContext(statusScript, context);
await new Promise(resolve=>setImmediate(resolve));
assert.match(element.textContent, /Site çevrimiçi · Kontrol/);
success = false;
listeners.online();
await new Promise(resolve=>setImmediate(resolve));
assert.equal(element.textContent, 'Site bağlantısı doğrulanamadı');
navigator.onLine = false;
listeners.offline();
assert.equal(element.textContent, 'İnternet bağlantısı yok');
console.log('PASS 200 routes, four 50-link modules, canonical/sitemap/Turkish/H1/noindex; actual status script success/error/offline.');
