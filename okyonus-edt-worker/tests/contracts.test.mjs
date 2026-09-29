import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const deniz=fs.readFileSync(new URL('../src/deniz-worker.js',import.meta.url),'utf8');
const zaman=fs.readFileSync(new URL('../src/zaman-worker.js',import.meta.url),'utf8');
const shared=fs.readFileSync(new URL('../src/shared.js',import.meta.url),'utf8');
const readme=fs.readFileSync(new URL('../README.md',import.meta.url),'utf8');

test('critical public contracts preserved',()=>{
  for(const p of ['/api/quote','/api/contact','/api/photo-inquiries','/api/b2b/products','/fotografla-teklif','/dijital-menu']) assert.ok(deniz.includes(p),p);
});

test('sales-first feature state is locked',()=>{
  for(const key of ['PRODUCTS: true','QUOTE: true','PHOTO: true','WHATSAPP: true','SEO: true','MEMBERSHIP: true','DIGITAL_MENU: true','COST: false','COST_RADAR: false','ACADEMY: false','CESNI: false']) assert.ok(shared.includes(key),key);
});

test('digital menu has minimum 30 themes and 30 templates',async()=>{
  const mod=await import(new URL('../src/shared.js',import.meta.url));
  assert.ok(mod.DIGITAL_MENU_THEMES.length>=30);
  assert.ok(mod.DIGITAL_MENU_TEMPLATES.length>=30);
});

test('email happens after durable quote/contact/photo records',()=>{
  assert.ok(deniz.indexOf('INSERT INTO b2b_quotes_v1') < deniz.indexOf("subject:`Okyanus EDT · Yeni teklif talebi"));
  assert.ok(deniz.indexOf('INSERT INTO contact_messages') < deniz.indexOf("subject:`Okyanus EDT · Yeni müşteri mesajı"));
  assert.ok(deniz.indexOf('INSERT INTO photo_inquiries') < deniz.indexOf("subject:`Okyanus EDT · Fotoğraflı teklif"));
  assert.ok(deniz.includes("notification='EMAIL_FAILED'"));
  assert.ok(deniz.includes("WAITING_CONFIGURATION"));
});

test('existing email binding contract preserved',()=>{
  assert.ok(shared.includes("env.EMAIL.send({to:target,from,replyTo:clean(replyTo,180),subject:clean(subject,180),text:"));
  assert.ok(readme.includes('EMAIL.send({to,from,replyTo,subject,text})'));
});

test('help only exposes active modules',()=>{
  assert.ok(deniz.includes("features.PRODUCTS&&['Ürün seçimi'"));
  assert.ok(deniz.includes("features.DIGITAL_MENU&&['Dijital Menü'"));
  assert.ok(!deniz.includes("['COST yardım'"));
});

test('admin can control feature visibility and audit changes',()=>{
  assert.ok(zaman.includes("p==='/api/features'&&request.method==='POST'"));
  assert.ok(zaman.includes("action:'FEATURE_CHANGED'"));
  assert.ok(zaman.includes('Feature Control'));
});

test('visual dimensions locked in shared architecture',()=>{
  for(const n of ['1600,height:1200','1600,height:600','900,height:1200','1080,height:1440','1200,height:900']) assert.ok(shared.includes(n),n);
});

test('production secrets are not hard-coded',()=>{
  const all=deniz+zaman+shared;
  for(const bad of ['ghp_','sk_live_','BEGIN PRIVATE KEY','SESSION_PEPPER=','BOOTSTRAP_TOKEN=']) assert.ok(!all.includes(bad),bad);
});

test('existing 200 EDT SEO route inventory is preserved as migration reference',()=>{
  const routes=JSON.parse(fs.readFileSync(new URL('../docs/seo-routes.json',import.meta.url),'utf8'));
  assert.equal(routes.length,200);
  assert.ok(routes.includes('/edt-deniz-urunleri-tedarikcisi'));
  assert.ok(routes.includes('/edt-horeca-gida-tedarikcisi'));
});