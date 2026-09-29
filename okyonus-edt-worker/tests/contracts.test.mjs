import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const deniz=fs.readFileSync(new URL('../src/deniz-worker.js',import.meta.url),'utf8');
const denizBase=fs.readFileSync(new URL('../baseline/deniz-worker.js',import.meta.url),'utf8');
const admin=fs.readFileSync(new URL('../src/zaman-admin-worker.js',import.meta.url),'utf8');
const adminBase=fs.readFileSync(new URL('../baseline/zaman-admin-worker.js',import.meta.url),'utf8');

function extractFunction(source,name){
  const patterns=['async function '+name+'(','function '+name+'('];
  let start=-1; for(const p of patterns){start=source.indexOf(p);if(start>=0)break}
  assert.ok(start>=0,'missing '+name);
  const brace=source.indexOf('{',start); let depth=0,quote='',escape=false,templateDepth=0;
  for(let i=brace;i<source.length;i++){
    const c=source[i],n=source[i+1];
    if(quote){if(escape){escape=false;continue}if(c==='\\'){escape=true;continue}if(quote==='\`'&&c==='$'&&n==='{'){templateDepth++;i++;continue}if(quote==='\`'&&c==='}'&&templateDepth>0){templateDepth--;continue}if(c===quote&&templateDepth===0)quote='';continue}
    if(c==="'"||c==='"'||c==='\`'){quote=c;continue}
    if(c==='/'&&n==='/'){i=source.indexOf('\n',i);if(i<0)return source.slice(start);continue}
    if(c==='/'&&n==='*'){const e=source.indexOf('*/',i+2);assert.ok(e>=0);i=e+1;continue}
    if(c==='{')depth++; if(c==='}'){depth--;if(depth===0)return source.slice(start,i+1)}
  }
  throw new Error('unterminated '+name);
}

test('real DENIZ and ZAMAN sources are present',()=>{
  assert.ok(deniz.length>3_000_000);
  assert.ok(admin.length>100_000);
});

test('critical DENIZ engines remain byte-preserved',()=>{
  for(const fn of ['sendBoundEmail','quoteAPI','photoInquiryAPI','okyContactMessageAPI']) assert.equal(extractFunction(deniz,fn),extractFunction(denizBase,fn),fn);
});

test('critical ZAMAN message/photo engines remain byte-preserved',()=>{
  for(const fn of ['messageCenterRoute','photoMessageRouteV2']) assert.equal(extractFunction(admin,fn),extractFunction(adminBase,fn),fn);
});

test('sales-first public face is wired',()=>{
  assert.match(deniz,/okySalesFirstHomeV1\(\)/);
  assert.match(deniz,/Ürün Seç • Teklif Al/);
  assert.match(deniz,/Listeni Fotoğrafla Gönder/);
  assert.match(deniz,/wa\.me\/905358813264/);
});

test('legacy modules hidden and Digital Menu active',()=>{
  for(const x of ['COST:false','COST_RADAR:false','ACADEMY:false','CESNI:false']) assert.ok(deniz.includes(x),x);
  for(const x of ['PRODUCTS:true','QUOTE:true','PHOTO:true','WHATSAPP:true','SEO:true','MEMBERSHIP:true','DIGITAL_MENU:true']) assert.ok(deniz.includes(x),x);
  assert.match(admin,/moduleFlagsRoute/);
  assert.match(admin,/Satış Modu & Modül Kontrolü/);
});

test('Digital Menu exposes at least 30 themes and 30 templates',()=>{
  const m1=deniz.match(/const OKY_DIGITAL_MENU_THEMES=Object\.freeze\((\[[\s\S]*?\])\);/);
  const m2=deniz.match(/const OKY_DIGITAL_MENU_TEMPLATES=Object\.freeze\((\[[\s\S]*?\])\);/);
  assert.ok(m1&&m2);
  assert.ok(JSON.parse(m1[1]).length>=30);
  assert.ok(JSON.parse(m2[1]).length>=30);
  assert.match(deniz,/\/api\/digital-menu\/presets\//);
});

test('Help lists active modules only',()=>{
  const help=extractFunction(deniz,'okySalesHelpPage');
  assert.match(help,/Ürün Seç • Teklif Al/);
  assert.match(help,/Fotoğrafla Teklif/);
  assert.match(help,/WhatsApp Satış/);
  assert.match(help,/Dijital Menü/);
  assert.doesNotMatch(help,/COST Maliyet|COST Radar|Akademi|ÇEŞNİ/);
});

test('200 EDT SEO migration inventory is retained',()=>{
  const routes=JSON.parse(fs.readFileSync(new URL('../docs/seo-routes.json',import.meta.url),'utf8'));
  assert.equal(routes.length,200);
  assert.ok(routes.includes('/edt-deniz-urunleri-tedarikcisi'));
  assert.ok(routes.includes('/edt-horeca-gida-tedarikcisi'));
});

test('no production secrets are committed',()=>{
  for(const s of [deniz,admin]){
    for(const bad of ['ghp_','sk_live_','BEGIN PRIVATE KEY']) assert.ok(!s.includes(bad),bad);
  }
});


test('deployment examples point to canonical Worker source files',()=>{
  const denizWrangler=fs.readFileSync(new URL('../wrangler.deniz.toml.example',import.meta.url),'utf8');
  const zamanWrangler=fs.readFileSync(new URL('../wrangler.zaman.toml.example',import.meta.url),'utf8');
  assert.match(denizWrangler,/main\s*=\s*"src\/deniz-worker\.js"/);
  assert.match(zamanWrangler,/main\s*=\s*"src\/zaman-admin-worker\.js"/);
});

test('optional migration never redefines baseline communication/security tables',()=>{
  const sql=fs.readFileSync(new URL('../migrations/002_sales_data.sql',import.meta.url),'utf8');
  for(const table of ['audit_log','users','sessions','inquiries','photo_inquiries','digital_menus']){
    assert.doesNotMatch(sql,new RegExp('CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+'+table+'\\b','i'),table);
  }
});
