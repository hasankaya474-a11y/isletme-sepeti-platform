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
    assert.match(doc,/005_product_meta\.sql/);
  }
  assert.match(checklist,/WhatsApp public module remains HIDDEN/);
  assert.match(runbook,/hidden flags: WHATSAPP/);
  assert.doesNotMatch(runbook,/active flags: PRODUCTS, QUOTE, PHOTO, WHATSAPP/);
});


test('Commerce V2 managed storefront content reaches homepage',()=>{
  assert.match(commerce,/id="commerce-categories"/);
  assert.match(commerce,/id="commerce-campaign"/);
  assert.match(commerce,/id="commerce-managed-sections"/);
  assert.match(commerce,/oky_storefront_sections_v1/);
  assert.match(commerce,/oky_campaigns_v1/);
  assert.match(commerce,/categories,sections,campaigns/);
  assert.match(commerce,/Array\.isArray\(j\.categories\)/);
  assert.match(commerce,/Array\.isArray\(j\.campaigns\)/);
  assert.match(commerce,/Array\.isArray\(j\.sections\)/);
});


test('Commerce V2 managed subpages use admin-backed storefront data',()=>{
  for(const key of ['brands','delivery','help:helpArticles']) assert.match(commerce,new RegExp(key.replace(':','\\s*:\\s*')));
  assert.match(commerce,/oky_brands_v1/);
  assert.match(commerce,/oky_delivery_rules_v1/);
  assert.match(commerce,/oky_help_articles_v1/);
  assert.match(commerce,/id="campaignList"/);
  assert.match(commerce,/id="deliveryList"/);
  assert.match(commerce,/id="managed-help"/);
  assert.match(commerce,/Array\.isArray\(j\.brands\)/);
  assert.match(commerce,/Array\.isArray\(j\.delivery\)/);
  assert.match(commerce,/Array\.isArray\(j\.help\)/);
});


test('Commerce V2 catalog URL filters and product detail stay wired',()=>{
  assert.match(commerce,/new URLSearchParams\(location\.search\)/);
  assert.match(commerce,/params\.get\('q'\)/);
  assert.match(commerce,/params\.get\('category'\)/);
  assert.match(commerce,/params\.get\('filter'\)/);
  assert.match(commerce,/fetch\('\/api\/storefront-v2'/);
  assert.match(commerce,/pdAdd/);
  assert.match(commerce,/Sepete \/ Teklife Ekle/);
  assert.match(commerce,/effectivePrice/);
  assert.match(commerce,/stock_status/);
});


test('Commerce V2 cart quote flow keeps product integrity',()=>{
  assert.match(commerce,/cartSummary/);
  assert.match(commerce,/Ürün kodu eksik/);
  assert.match(commerce,/Nihai fiyat teklif aşamasında netleşir/);
  assert.match(commerce,/Array\.isArray\(a\)\?a\.filter\(x=>x&&x\.id&&x\.name\)/);
  assert.match(commerce,/qf\.reset\(\)/);
  assert.match(commerce,/grid-template-columns:minmax\(0,1fr\) 68px 44px/);
  assert.match(commerce,/min-width:44px;min-height:44px/);
});


test('Commerce V2 product admin supports create edit and safe soft-delete',()=>{
  assert.match(commerceAdmin,/request\.method==="POST"&&!id/);
  assert.match(commerceAdmin,/INSERT INTO b2b_products_v1/);
  assert.match(commerceAdmin,/request\.method==="DELETE"&&id/);
  assert.match(commerceAdmin,/UPDATE b2b_products_v1 SET active=0/);
  assert.match(commerceAdmin,/UPDATE b2b_prices_v1 SET active=0/);
  assert.match(commerceAdmin,/function productForm\(/);
  assert.match(commerceAdmin,/function disableProduct\(/);
  assert.match(commerceAdmin,/Pasife Al/);
  assert.match(commerceAdmin,/NAME_CATEGORY_REQUIRED/);
});


test('Commerce V2 final admin and release state are locked',()=>{
  assert.match(commerceAdmin,/resource==="product-history"/);
  assert.match(commerceAdmin,/b2b_price_history_v1/);
  assert.match(commerceAdmin,/function showPriceHistory\(/);
  assert.match(commerceAdmin,/Fiyat Geçmişi/);
  assert.match(commerceAdmin,/min-height:44px/);
  const runbook=fs.readFileSync(new URL('../docs/WORKER_COPY_RUNBOOK.md',import.meta.url),'utf8');
  const checklist=fs.readFileSync(new URL('../DEPLOYMENT_CHECKLIST.md',import.meta.url),'utf8');
  assert.match(runbook,/CODE COMPLETE \/ READY FOR CONTROLLED DEPLOYMENT/);
  assert.match(runbook,/Production DENİZ\/ZAMAN Workers: NOT DEPLOYED/);
  assert.match(runbook,/Production D1: NOT MODIFIED/);
  assert.match(checklist,/Product create\/edit\/soft-delete and price history controls wired/);
  assert.match(checklist,/\[ \] Production deployment performed/);
});


test('release dry-run command pack is non-destructive',()=>{
  const dry=fs.readFileSync(new URL('../scripts/release-dry-run.mjs',import.meta.url),'utf8');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.equal(pkg.scripts['release:dry-run'],'node scripts/release-dry-run.mjs');
  assert.match(dry,/No Cloudflare or D1 changes are performed by this script/);
  assert.match(dry,/001_sales_mode\.sql/);
  assert.match(dry,/003_commerce_v2\.sql/);
  assert.match(dry,/004_commerce_extended\.sql/);
  assert.match(dry,/Production remains blocked until staging smoke-test evidence/);
  assert.doesNotMatch(dry,/execSync|spawnSync|child_process/);
});


test('staging preflight is offline and production-gated',()=>{
  const pre=fs.readFileSync(new URL('../scripts/staging-preflight.mjs',import.meta.url),'utf8');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.equal(pkg.scripts['staging:preflight'],'node scripts/staging-preflight.mjs');
  assert.match(pre,/No network, Cloudflare, D1, email, R2 or production action is performed/);
  assert.match(pre,/DENIZ_QUOTE_API/);
  assert.match(pre,/ZAMAN_B2B/);
  assert.match(pre,/RESPONSIVE_360/);
  assert.match(pre,/every row above requires real staging evidence before production/);
  assert.doesNotMatch(pre,/fetch\(|https?:\/\/|child_process|execSync|spawnSync/);
});


test('staging Wrangler templates keep isolated binding placeholders',()=>{
  const deniz=fs.readFileSync(new URL('../wrangler.deniz.staging.example.toml',import.meta.url),'utf8');
  const zaman=fs.readFileSync(new URL('../wrangler.zaman.staging.example.toml',import.meta.url),'utf8');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.equal(pkg.scripts['staging:config-check'],'node scripts/staging-config-check.mjs');
  assert.match(deniz,/name = "deniz-edt-v2-staging"/);
  assert.match(zaman,/name = "okyanus-edt-admin-staging"/);
  for(const x of [deniz,zaman]){
    assert.match(x,/binding = "DB"/);
    assert.match(x,/REPLACE_WITH_STAGING_D1_NAME/);
    assert.match(x,/REPLACE_WITH_STAGING_D1_ID/);
    assert.match(x,/ENVIRONMENT = "staging"/);
  }
  assert.match(deniz,/binding = "PHOTO_TEMP"/);
  assert.match(zaman,/binding = "PHOTO_TEMP"/);
  assert.match(zaman,/binding = "MEDIA_STORE"/);
  assert.match(zaman,/REQUIRE_CF_ACCESS = "true"/);
});


test('binding consistency audit locks canonical and legacy names',()=>{
  const audit=fs.readFileSync(new URL('../scripts/binding-consistency-check.mjs',import.meta.url),'utf8');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  const matrix=fs.readFileSync(new URL('../docs/BINDINGS_MATRIX.md',import.meta.url),'utf8');
  assert.equal(pkg.scripts['staging:binding-check'],'node scripts/binding-consistency-check.mjs');
  assert.match(audit,/BINDING CONSISTENCY PASS/);
  assert.match(matrix,/Legacy compatibility aliases/);
  assert.match(matrix,/Veritabanı/);
  assert.match(matrix,/FOTOĞRAF_TEMP/);
  assert.match(matrix,/MEDYA_MAĞAZASI/);
  assert.doesNotMatch(audit,/fetch\(|https?:\/\/|child_process|execSync|spawnSync/);
});


test('managed section kinds render products categories and promo payloads',()=>{
  assert.match(commerce,/PRODUCT_GRID/);
  assert.match(commerce,/CATEGORY_STRIP/);
  assert.match(commerce,/CAMPAIGN/);
  assert.match(commerce,/managedBlock/);
  assert.match(commerce,/function renderSection\(/);
  assert.match(commerceAdmin,/payloadJson/);
  assert.match(commerceAdmin,/INVALID_SECTION_PAYLOAD_JSON/);
  assert.match(commerceAdmin,/sectionKinds/);
  assert.match(commerceAdmin,/PRODUCT_GRID/);
  assert.match(commerceAdmin,/CATEGORY_STRIP/);
});


test('catalog bulk import preserves product identity and price history',()=>{
  assert.match(commerceAdmin,/resource==="catalog-import"/);
  assert.match(commerceAdmin,/INVALID_IMPORT_SIZE/);
  assert.match(commerceAdmin,/source_product_id=\?/);
  assert.match(commerceAdmin,/SELECT \* FROM b2b_products_v1 WHERE name=\? AND category=\?/);
  assert.match(commerceAdmin,/b2b_price_history_v1/);
  assert.match(commerceAdmin,/Toplu Katalog İçe Aktar/);
  assert.match(commerceAdmin,/runCatalogImport/);
  assert.match(commerceAdmin,/En fazla 500 ürün/);
});


test('product metadata extension is additive and storefront-wired',()=>{
  const sql=fs.readFileSync(new URL('../migrations/005_product_meta.sql',import.meta.url),'utf8');
  assert.match(sql,/oky_product_meta_v1/);
  assert.match(sql,/brand_id/);
  assert.match(sql,/seo_title/);
  assert.match(sql,/featured/);
  for(const table of ['b2b_products_v1','audit_log','users','sessions','inquiries','photo_inquiries','digital_menus']){
    assert.doesNotMatch(sql,new RegExp('ALTER\\s+TABLE\\s+'+table+'\\b','i'),table);
  }
  assert.match(commerceAdmin,/async function upsertProductMeta/);
  assert.match(commerceAdmin,/LEFT JOIN oky_product_meta_v1/);
  assert.match(commerceAdmin,/brandId/);
  assert.match(commerceAdmin,/seoTitle/);
  assert.match(commerceAdmin,/featured/);
  assert.match(commerce,/oky_product_meta_v1/);
  assert.match(commerce,/m\.description/);
  assert.match(commerce,/m\.brand_id/);
  assert.match(commerce,/m\.featured/);
  assert.match(commerce,/p\.description/);
});

test('release dry-run includes product metadata migration',()=>{
  const dry=fs.readFileSync(new URL('../scripts/release-dry-run.mjs',import.meta.url),'utf8');
  assert.match(dry,/005_product_meta\.sql/);
});


test('product metadata admin UX and SEO detail wiring are present',()=>{
  assert.match(commerceAdmin,/list="brandIds"/);
  assert.match(commerceAdmin,/api\('brands'\)/);
  assert.match(commerceAdmin,/SEO başlık/);
  assert.match(commerceAdmin,/SEO açıklama/);
  assert.match(commerceAdmin,/Öne çıkar/);
  assert.match(commerce,/document\.title=esc\(p\.seo_title/);
  assert.match(commerce,/querySelector\('meta\[name=/);
  assert.match(commerce,/p\.seo_description/);
});


test('final release record pins canonical code and migration 005',()=>{
  const manifest=fs.readFileSync(new URL('../docs/OKYANUS_EDT_COMMERCE_V2_FINAL_RELEASE_MANIFEST_2026-09-30.md',import.meta.url),'utf8');
  const bundle=fs.readFileSync(new URL('../docs/OKYANUS_EDT_FINAL_DEPLOYMENT_BUNDLE_INDEX_2026-09-30.md',import.meta.url),'utf8');
  for(const doc of [manifest,bundle]){
    assert.match(doc,/23c27fb7a07a9327184171631867c9ee296625ba/);
    assert.match(doc,/005_product_meta\.sql/);
  }
  assert.match(bundle,/2a06751a21252552e63986450d28066c94bdead2/);
  assert.match(bundle,/1c30be2a38e80b74bf57fa9af6ef7871ef0dfbd4/);
  assert.match(bundle,/001 → 003 → 004 → 005/);
});


test('single-file Worker bundles need no sibling modules',()=>{
  const denizSingle=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  const zamanSingle=fs.readFileSync(new URL('../dist/zaman-admin-worker.single.js',import.meta.url),'utf8');
  assert.match(denizSingle,/const \{ commerceRoute \} = \(\(\) => \{/);
  assert.match(zamanSingle,/const \{ commerceAdminApi, commerceAdminPage \} = \(\(\) => \{/);
  assert.doesNotMatch(denizSingle,/from "\.\/commerce-v2\.js"/);
  assert.doesNotMatch(zamanSingle,/from "\.\/commerce-admin-v2\.js"/);
  assert.match(denizSingle,/export default/);
  assert.match(zamanSingle,/export default/);
});
