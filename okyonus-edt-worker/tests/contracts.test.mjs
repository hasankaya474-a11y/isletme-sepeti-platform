import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const deniz=fs.readFileSync(new URL('../src/deniz-worker.js',import.meta.url),'utf8');
const denizBase=fs.readFileSync(new URL('../baseline/deniz-worker.js',import.meta.url),'utf8');
const admin=fs.readFileSync(new URL('../src/zaman-admin-worker.js',import.meta.url),'utf8');
const adminBase=fs.readFileSync(new URL('../baseline/zaman-admin-worker.js',import.meta.url),'utf8');
const commerce=fs.readFileSync(new URL('../src/commerce-v2.js',import.meta.url),'utf8');
const commerceAdmin=fs.readFileSync(new URL('../src/commerce-admin-v2.js',import.meta.url),'utf8');

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
  for(const x of ['PRODUCTS:true','QUOTE:true','PHOTO:true','SEO:true','MEMBERSHIP:true','DIGITAL_MENU:true']) assert.ok(deniz.includes(x),x);
  assert.ok(deniz.includes('WHATSAPP:false'),'WhatsApp remains hidden until verified');
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


test('Commerce V2 storefront is wired without replacing critical engines',()=>{
  assert.match(deniz,/from "\.\/commerce-v2\.js"/);
  assert.match(deniz,/commerceRoute\(request,env\)/);
  assert.match(commerce,/Profesyonel mutfağın alışverişi burada başlar/);
  assert.match(commerce,/Kategoriler/);
  assert.match(commerce,/Sepet \/ Teklif/);
  assert.match(commerce,/İçerik Stüdyo/);
});

test('Commerce V2 mobile tablet contact and help locks are present',()=>{
  assert.match(commerce,/@media\(max-width:1024px\)/);
  assert.match(commerce,/@media\(max-width:900px\)/);
  assert.match(commerce,/@media\(max-width:620px\)/);
  assert.match(commerce,/Mobil alt menü/);
  assert.match(commerce,/Site Yardım/);
  assert.match(commerce,/İletişim/);
  assert.match(commerce,/\/site-yardim/);
  assert.doesNotMatch(commerce,/wa\.me\//);
});

test('Commerce V2 mobile navigation routes and touch targets are correct',()=>{
  assert.match(commerce,/href="\/sepet">▣<br>Sepet\/Teklif/);
  assert.match(commerce,/href="\/yardim" title="Site Yardım"/);
  assert.match(commerce,/\.mobile a\{[^}]*min-height:44px/);
  assert.match(commerce,/\.qty button,\.add\{[^}]*height:44px/);
});

test('Commerce V2 admin supports storefront record edit and delete',()=>{
  assert.match(commerceAdmin,/function startEdit\(/);
  assert.match(commerceAdmin,/function removeRow\(/);
  assert.match(commerceAdmin,/method:'DELETE'/);
  assert.match(commerceAdmin,/editingId/);
});

test('Commerce V2 admin can manage product image price banner category and help',()=>{
  assert.match(admin,/from "\.\/commerce-admin-v2\.js"/);
  assert.match(admin,/commerceAdminApi/);
  assert.match(commerceAdmin,/Ürün & Fiyat/);
  assert.match(commerceAdmin,/Kategoriler/);
  assert.match(commerceAdmin,/Banner/);
  assert.match(commerceAdmin,/Site Yardım/);
  assert.match(commerceAdmin,/imageUrl/);
  assert.match(commerceAdmin,/price/);
});

test('Commerce V2 migration is additive and avoids protected baseline tables',()=>{
 const sql=fs.readFileSync(new URL('../migrations/003_commerce_v2.sql',import.meta.url),'utf8');
 for(const table of ['audit_log','users','sessions','inquiries','photo_inquiries','digital_menus']){
   assert.doesNotMatch(sql,new RegExp('CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+'+table+'\\b','i'),table);
 }
 for(const table of ['oky_storefront_categories_v1','oky_storefront_banners_v1','oky_storefront_sections_v1','oky_help_articles_v1']){
   assert.match(sql,new RegExp(table));
 }
});


test('Commerce extended catalog/cart routes are present',()=>{
  assert.match(commerce,/commerceCatalogPage/);
  assert.match(commerce,/commerceCartPage/);
  assert.match(commerce,/commerceProductPage/);
  assert.match(commerce,/\/markalar/);
  assert.match(commerce,/\/kampanyalar/);
  assert.match(commerce,/\/teslimat/);
  assert.match(commerce,/oky-commerce-cart-v2/);
});

test('Commerce extended schema remains additive',()=>{
  const sql=fs.readFileSync(new URL('../migrations/004_commerce_extended.sql',import.meta.url),'utf8');
  for(const table of ['oky_brands_v1','oky_campaigns_v1','oky_delivery_rules_v1','oky_media_assets_v1']) assert.match(sql,new RegExp(table));
  for(const table of ['audit_log','users','sessions','inquiries','photo_inquiries','digital_menus']) assert.doesNotMatch(sql,new RegExp('CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+'+table+'\\b','i'));
});


test('Commerce admin extended controls are present',()=>{
  for(const x of ['oky_brands_v1','oky_campaigns_v1','oky_delivery_rules_v1','oky_media_assets_v1']) assert.match(commerceAdmin,new RegExp(x));
  for(const x of ['Markalar','Kampanyalar','Teslimat','Medya']) assert.match(commerceAdmin,new RegExp(x));
  assert.match(commerceAdmin,/resource==="brands"/);
  assert.match(commerceAdmin,/resource==="campaigns"/);
  assert.match(commerceAdmin,/resource==="delivery"/);
  assert.match(commerceAdmin,/resource==="media"/);
});


test('release docs match Commerce V2 production contract',()=>{
  const checklist=fs.readFileSync(new URL('../DEPLOYMENT_CHECKLIST.md',import.meta.url),'utf8');
  const runbook=fs.readFileSync(new URL('../docs/WORKER_COPY_RUNBOOK.md',import.meta.url),'utf8');
  for(const doc of [checklist,runbook]){
    assert.match(doc,/003_commerce_v2\.sql/);
    assert.match(doc,/004_commerce_extended\.sql/);
  }
  assert.match(checklist,/WhatsApp public module remains HIDDEN/);
  assert.match(runbook,/hidden flags: WHATSAPP/);
  assert.doesNotMatch(runbook,/active flags: PRODUCTS, QUOTE, PHOTO, WHATSAPP/);
});
