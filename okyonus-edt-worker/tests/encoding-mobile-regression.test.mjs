import test from 'node:test';
import assert from 'node:assert/strict';
import deniz from '../src/deniz-worker.js';
import zaman from '../src/zaman-admin-worker.js';
import { commerceAdminPage } from '../src/commerce-admin-v2.js';

const corruptedTurkish = /Ã[¼¶§‡–œ]|Ä[±°Ÿž]|Å[Ÿžž]|â€[“”˜™¦]/;

test('ZAMAN login response preserves Turkish bytes and declares UTF-8', async () => {
  const response = await zaman.fetch(new Request('https://admin.example/login'), {SESSION_PEPPER:'regression-only-session-secret'});
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/html;\s*charset=utf-8$/i);
  const html = new TextDecoder('utf-8', {fatal:true}).decode(await response.arrayBuffer());
  assert.match(html, /<meta charset="utf-8">/i);
  for (const label of ['Yönetici Girişi','Yönetici Paneli','Şifre','Güvenli giriş']) assert.ok(html.includes(label), label);
  assert.doesNotMatch(html, corruptedTurkish);
});

test('commercial management response keeps UTF-8 even when caller supplies another content type', async () => {
  const response = commerceAdminPage({'content-type':'text/plain'});
  assert.match(response.headers.get('content-type'), /^text\/html;\s*charset=utf-8$/i);
  const html = await response.text();
  for (const label of ['Ürün & Fiyat','Ürün Görseli','Görsel Yükle','Teslimat Günleri']) assert.ok(html.includes(label), label);
  assert.doesNotMatch(html, corruptedTurkish);
});

test('served DENIZ mobile layout preserves full hero artwork and moves contact controls into flow', async () => {
  const response = await deniz.fetch(new Request('https://www.okyonusedt.com/'), {}, {waitUntil(){}});
  assert.equal(response.status, 200);
  const html = await response.text();
  const start = html.indexOf('/* R31 mobile:');
  assert.ok(start > 0, 'mobile correction missing from served page');
  const mobile = html.slice(start, html.indexOf('</style>', start));
  assert.match(mobile, /@media\(max-width:1024px\)/);
  assert.match(mobile, /\.heroVisualSlide \.heroMedia img\{[^}]*object-fit:contain!important[^}]*animation:none[^}]*transform:none/);
  assert.match(mobile, /\.float\{position:static!important/);
  assert.match(mobile, /\.float a\{width:44px;height:44px/);
  assert.match(mobile, /\.product \.price\{display:flex!important;flex-direction:column/);
  assert.match(mobile, /\.product \.qty\{grid-template-columns:24px minmax\(0,1fr\) 24px!important/);
  assert.match(mobile, /\.product \.add\{min-height:44px;height:auto!important[^}]*line-height:1\.3!important/);
  assert.match(mobile, /@media\(prefers-reduced-motion:reduce\)\{[^]*animation:none!important/);
  assert.match(html, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
