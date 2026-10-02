import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Match the exact escaped delivery token; do not unescape arbitrary source.
const asciiToken=s=>s.replace(/[^\x00-\x7f]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));

const logicalText=s=>s.replace(/\\u([0-9a-f]{4})/gi,(_,h)=>String.fromCharCode(parseInt(h,16)));

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
  assert.ok(deniz.length>100_000);
  assert.ok(admin.length>100_000);
});

test('critical DENIZ engines remain byte-preserved',()=>{
  for(const fn of ['sendBoundEmail','quoteAPI','photoInquiryAPI','okyContactMessageAPI']) assert.equal(extractFunction(deniz,fn),extractFunction(denizBase,fn),fn);
});

test('critical ZAMAN message/photo engines remain byte-preserved',()=>{
  for(const fn of ['messageCenterRoute','photoMessageRouteV2']) assert.equal(extractFunction(admin,fn),extractFunction(adminBase,fn),fn);
});

test('current commerce public face is wired',()=>{
  assert.match(logicalText(commerce),/function home\(opening=\{\}\)/);
  assert.match(logicalText(commerce),/Ürün Seç • Teklif Al/);
  assert.match(logicalText(commerce),/Listeni Fotoğrafla Gönder/);
  assert.match(logicalText(commerce),/secondWhatsapp:"905358813264"/);
});

test('legacy business modules remain preserved behind current commerce storefront',()=>{
  for(const x of ['function costRadarPage','function academyPage','function cesniPageVNext','function digitalMenuPage']) assert.ok(deniz.includes(x),x);
  for(const x of ['path === "/cost-radar"','path === "/akademi"','path === "/cesni"','path === "/dijital-menu"']) assert.ok(deniz.includes(x),x);
  assert.match(admin,/moduleFlagsRoute/);
  assert.match(admin,/Satış Modu & Modül Kontrolü/);
});

test('Digital Menu engine and public menu routes are preserved',()=>{
  assert.match(deniz,/function digitalMenuEnsureSchema/);
  assert.match(deniz,/function digitalMenuPage/);
  assert.match(deniz,/function publicDigitalMenuPage/);
  assert.match(deniz,/\/digital-menu-app\.js/);
  assert.match(deniz,/path === "\/dijital-menu"/);
  assert.match(deniz,/path\.startsWith\("\/menu\/"\)/);
});

test('Commerce Help stays wired to current storefront assistance',()=>{
  const help=extractFunction(commerce,'help');
  assert.match(logicalText(help),/ürün|Ürün/);
  assert.match(logicalText(help),/teklif/i);
  assert.match(logicalText(help),/İletişim|iletişim/);
  assert.match(logicalText(commerce),/p==="\/yardim"\|\|p==="\/site-yardim"/);
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
  assert.match(denizWrangler,/main\s*=\s*"dist\/deniz-worker\.single\.js"/);
  assert.match(zamanWrangler,/main\s*=\s*"dist\/zaman-admin-worker\.single\.js"/);
});

test('optional migration never redefines baseline communication/security tables',()=>{
  const sql=fs.readFileSync(new URL('../migrations/002_sales_data.sql',import.meta.url),'utf8');
  for(const table of ['audit_log','users','sessions','inquiries','photo_inquiries','digital_menus']){
    assert.doesNotMatch(sql,new RegExp('CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+'+table+'\\b','i'),table);
  }
});


test('Commerce V24 storefront is wired without replacing critical engines',()=>{
  assert.match(deniz,/commerceRoute\(request,env\)/);
  assert.match(logicalText(commerce),/commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col/);
  assert.match(logicalText(commerce),/Profesyonel mutfağın alışverişi burada başlar/);
  assert.match(logicalText(commerce),/Kategoriler/);
  assert.match(logicalText(commerce),/Sepet \/ Teklif/);
  assert.match(logicalText(commerce),/İçerik Stüdyo/);
});

test('Commerce V2 mobile tablet contact and help locks are present',()=>{
  assert.match(logicalText(commerce),/@media\(max-width:1024px\)/);
  assert.match(logicalText(commerce),/@media\(max-width:900px\)/);
  assert.match(logicalText(commerce),/@media\(max-width:620px\)/);
  assert.match(logicalText(commerce),/Mobil alt menü/);
  assert.match(logicalText(commerce),/Site Yardım/);
  assert.match(logicalText(commerce),/İletişim/);
  assert.match(logicalText(commerce),/\/site-yardim/);
  assert.doesNotMatch(commerce,/wa\.me\//);
});

test('Commerce V2 mobile navigation routes and touch targets are correct',()=>{
  assert.match(logicalText(commerce),/href="\/sepet">▣<br>Sepet\/Teklif/);
  assert.match(logicalText(commerce),/href="\/yardim" title="Site Yardım"/);
  assert.match(logicalText(commerce),/\.mobile a\{[^}]*min-height:44px/);
  assert.match(logicalText(commerce),/\.qty button,\.add\{[^}]*height:44px/);
});

test('Commerce V2 admin supports storefront record edit and delete',()=>{
  assert.match(logicalText(commerceAdmin),/function startEdit\(/);
  assert.match(logicalText(commerceAdmin),/function removeRow\(/);
  assert.match(logicalText(commerceAdmin),/method:'DELETE'/);
  assert.match(logicalText(commerceAdmin),/editingId/);
});

test('Commerce V2 admin can manage product image price banner category and help',()=>{
  assert.match(admin,/async function commerceAdminApi/);
  assert.doesNotMatch(admin,/from "\.\/commerce-admin-v2\.js"/);
  assert.match(admin,/commerceAdminApi/);
  assert.match(logicalText(commerceAdmin),/Ürün & Fiyat/);
  assert.match(logicalText(commerceAdmin),/Kategoriler/);
  assert.match(logicalText(commerceAdmin),/Banner/);
  assert.match(logicalText(commerceAdmin),/Site Yardım/);
  assert.match(logicalText(commerceAdmin),/imageUrl/);
  assert.match(logicalText(commerceAdmin),/price/);
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
  assert.match(logicalText(commerce),/commerceCatalogPage/);
  assert.match(logicalText(commerce),/commerceCartPage/);
  assert.match(logicalText(commerce),/commerceProductPage/);
  assert.match(logicalText(commerce),/\/markalar/);
  assert.match(logicalText(commerce),/\/kampanyalar/);
  assert.match(logicalText(commerce),/\/teslimat/);
  assert.match(logicalText(commerce),/oky-commerce-cart-v2/);
});

test('Commerce extended schema remains additive',()=>{
  const sql=fs.readFileSync(new URL('../migrations/004_commerce_extended.sql',import.meta.url),'utf8');
  for(const table of ['oky_brands_v1','oky_campaigns_v1','oky_delivery_rules_v1','oky_media_assets_v1']) assert.match(sql,new RegExp(table));
  for(const table of ['audit_log','users','sessions','inquiries','photo_inquiries','digital_menus']) assert.doesNotMatch(sql,new RegExp('CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+'+table+'\\b','i'));
});


test('Commerce admin extended controls are present',()=>{
  for(const x of ['oky_brands_v1','oky_campaigns_v1','oky_delivery_rules_v1','oky_media_assets_v1']) assert.match(logicalText(commerceAdmin),new RegExp(x));
  for(const x of ['Markalar','Kampanyalar','Teslimat','Medya']) assert.match(logicalText(commerceAdmin),new RegExp(x));
  assert.match(logicalText(commerceAdmin),/resource==="brands"/);
  assert.match(logicalText(commerceAdmin),/resource==="campaigns"/);
  assert.match(logicalText(commerceAdmin),/resource==="delivery"/);
  assert.match(logicalText(commerceAdmin),/resource==="media"/);
});


test('release docs match Commerce V2 production contract',()=>{
  const checklist=fs.readFileSync(new URL('../DEPLOYMENT_CHECKLIST.md',import.meta.url),'utf8');
  const runbook=fs.readFileSync(new URL('../docs/WORKER_COPY_RUNBOOK.md',import.meta.url),'utf8');
  for(const doc of [checklist,runbook]){
    assert.match(doc,/003_commerce_v2\.sql/);
    assert.match(doc,/004_commerce_extended\.sql/);
    assert.match(doc,/005_product_meta\.sql/);
    assert.match(doc,/006_commerce_control_plane\.sql/);
  }
  assert.match(checklist,/WhatsApp public module remains HIDDEN/);
  assert.match(runbook,/hidden flags: WHATSAPP/);
  assert.doesNotMatch(runbook,/active flags: PRODUCTS, QUOTE, PHOTO, WHATSAPP/);
});


test('Commerce V2 managed storefront content reaches homepage',()=>{
  assert.match(logicalText(commerce),/id="commerce-categories"/);
  assert.match(logicalText(commerce),/id="commerce-campaign"/);
  assert.match(logicalText(commerce),/id="commerce-managed-sections"/);
  assert.match(logicalText(commerce),/oky_storefront_sections_v1/);
  assert.match(logicalText(commerce),/oky_campaigns_v1/);
  assert.match(logicalText(commerce),/categories,sections,campaigns/);
  assert.match(logicalText(commerce),/Array\.isArray\(j\.categories\)/);
  assert.match(logicalText(commerce),/Array\.isArray\(j\.campaigns\)/);
  assert.match(logicalText(commerce),/Array\.isArray\(j\.sections\)/);
});


test('Commerce V2 managed subpages use admin-backed storefront data',()=>{
  for(const key of ['brands','delivery','help:helpArticles']) assert.match(logicalText(commerce),new RegExp(key.replace(':','\\s*:\\s*')));
  assert.match(logicalText(commerce),/oky_brands_v1/);
  assert.match(logicalText(commerce),/oky_delivery_rules_v1/);
  assert.match(logicalText(commerce),/oky_help_articles_v1/);
  assert.match(logicalText(commerce),/id="campaignList"/);
  assert.match(logicalText(commerce),/id="deliveryList"/);
  assert.match(logicalText(commerce),/id="managed-help"/);
  assert.match(logicalText(commerce),/Array\.isArray\(j\.brands\)/);
  assert.match(logicalText(commerce),/Array\.isArray\(j\.delivery\)/);
  assert.match(logicalText(commerce),/Array\.isArray\(j\.help\)/);
});


test('Commerce V2 catalog URL filters and product detail stay wired',()=>{
  assert.match(logicalText(commerce),/new URLSearchParams\(location\.search\)/);
  assert.match(logicalText(commerce),/params\.get\('q'\)/);
  assert.match(logicalText(commerce),/params\.get\('category'\)/);
  assert.match(logicalText(commerce),/params\.get\('filter'\)/);
  assert.match(logicalText(commerce),/fetch\('\/api\/storefront-v2'/);
  assert.match(logicalText(commerce),/pdAdd/);
  assert.match(logicalText(commerce),/Sepete \/ Teklife Ekle/);
  assert.match(logicalText(commerce),/effectivePrice/);
  assert.match(logicalText(commerce),/stock_status/);
});


test('Commerce V2 cart quote flow keeps product integrity',()=>{
  assert.match(logicalText(commerce),/cartSummary/);
  assert.match(logicalText(commerce),/Ürün kodu eksik/);
  assert.match(logicalText(commerce),/ürünün fiyatı teklifte netleşecek/);
  assert.match(logicalText(commerce),/Array\.isArray\(raw\)\?raw:\[\]/);
  assert.match(logicalText(commerce),/qf\.reset\(\)/);
  assert.match(logicalText(commerce),/grid-template-columns:minmax\(0,1fr\) 128px 44px/);
  assert.match(logicalText(commerce),/min-width:44px;min-height:44px/);
  assert.match(logicalText(commerce),/Sepet güncel katalog, fiyat ve ürün bilgileriyle doğrulandı/);
});


test('Commerce V2 product admin supports create edit and safe soft-delete',()=>{
  assert.match(logicalText(commerceAdmin),/request\.method==="POST"&&!id/);
  assert.match(logicalText(commerceAdmin),/INSERT INTO b2b_products_v1/);
  assert.match(logicalText(commerceAdmin),/request\.method==="DELETE"&&id/);
  assert.match(logicalText(commerceAdmin),/UPDATE b2b_products_v1 SET active=0/);
  assert.match(logicalText(commerceAdmin),/UPDATE b2b_prices_v1 SET active=0/);
  assert.match(logicalText(commerceAdmin),/function productForm\(/);
  assert.match(logicalText(commerceAdmin),/function disableProduct\(/);
  assert.match(logicalText(commerceAdmin),/Pasife Al/);
  assert.match(logicalText(commerceAdmin),/NAME_CATEGORY_REQUIRED/);
});


test('Commerce V2 final admin and release state are locked',()=>{
  assert.match(logicalText(commerceAdmin),/resource==="product-history"/);
  assert.match(logicalText(commerceAdmin),/b2b_price_history_v1/);
  assert.match(logicalText(commerceAdmin),/function showPriceHistory\(/);
  assert.match(logicalText(commerceAdmin),/Fiyat Geçmişi/);
  assert.match(logicalText(commerceAdmin),/min-height:44px/);
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
  assert.match(dry,/005_product_meta\.sql/);
  assert.match(dry,/006_commerce_control_plane\.sql/);
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
  assert.match(logicalText(commerce),/PRODUCT_GRID/);
  assert.match(logicalText(commerce),/CATEGORY_STRIP/);
  assert.match(logicalText(commerce),/CAMPAIGN/);
  assert.match(logicalText(commerce),/managedBlock/);
  assert.match(logicalText(commerce),/function renderSection\(/);
  assert.match(logicalText(commerceAdmin),/payloadJson/);
  assert.match(logicalText(commerceAdmin),/INVALID_SECTION_PAYLOAD_JSON/);
  assert.match(logicalText(commerceAdmin),/sectionKinds/);
  assert.match(logicalText(commerceAdmin),/PRODUCT_GRID/);
  assert.match(logicalText(commerceAdmin),/CATEGORY_STRIP/);
});


test('catalog bulk import preserves product identity and price history',()=>{
  assert.match(logicalText(commerceAdmin),/resource==="catalog-import"/);
  assert.match(logicalText(commerceAdmin),/INVALID_IMPORT_SIZE/);
  assert.match(logicalText(commerceAdmin),/source_product_id=\?/);
  assert.match(logicalText(commerceAdmin),/SELECT \* FROM b2b_products_v1 WHERE name=\? AND category=\?/);
  assert.match(logicalText(commerceAdmin),/b2b_price_history_v1/);
  assert.match(logicalText(commerceAdmin),/Toplu Katalog İçe Aktar/);
  assert.match(logicalText(commerceAdmin),/runCatalogImport/);
  assert.match(logicalText(commerceAdmin),/En fazla 500 ürün/);
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
  assert.match(logicalText(commerceAdmin),/async function upsertProductMeta/);
  assert.match(logicalText(commerceAdmin),/LEFT JOIN oky_product_meta_v1/);
  assert.match(logicalText(commerceAdmin),/brandId/);
  assert.match(logicalText(commerceAdmin),/seoTitle/);
  assert.match(logicalText(commerceAdmin),/featured/);
  assert.match(logicalText(commerce),/oky_product_meta_v1/);
  assert.match(logicalText(commerce),/\['description','seo_title','seo_description','featured'/);
  assert.match(logicalText(commerce),/pick\(mCols,'m',n/);
  assert.match(logicalText(commerce),/m\.brand_id/);
  assert.match(logicalText(commerce),/m\.featured/);
  assert.match(logicalText(commerce),/p\.description/);
});

test('release dry-run includes product metadata migration',()=>{
  const dry=fs.readFileSync(new URL('../scripts/release-dry-run.mjs',import.meta.url),'utf8');
  assert.match(dry,/005_product_meta\.sql/);
});


test('product metadata admin UX and SEO detail wiring are present',()=>{
  assert.match(logicalText(commerceAdmin),/list="brandIds"/);
  assert.match(logicalText(commerceAdmin),/api\('brands'\)/);
  assert.match(logicalText(commerceAdmin),/seoTitle/);
  assert.match(logicalText(commerceAdmin),/seoDescription/);
  assert.match(logicalText(commerceAdmin),/featured/);
  assert.match(logicalText(commerce),/document\.title=esc\(p\.seo_title/);
  assert.match(logicalText(commerce),/querySelector\('meta\[name=/);
  assert.match(logicalText(commerce),/p\.seo_description/);
});


test('final release record pins architecture v15 canonical code and migration 006',()=>{
  const manifest=fs.readFileSync(new URL('../docs/OKYANUS_EDT_COMMERCE_V2_FINAL_RELEASE_MANIFEST_2026-09-30.md',import.meta.url),'utf8');
  const bundle=fs.readFileSync(new URL('../docs/OKYANUS_EDT_FINAL_DEPLOYMENT_BUNDLE_INDEX_2026-09-30.md',import.meta.url),'utf8');
  for(const doc of [manifest,bundle]){
    assert.match(doc,/a0a33335755d626e68043bd2779eb78e036c4932/);
    assert.match(doc,/005_product_meta\.sql/);
    assert.match(doc,/006_commerce_control_plane\.sql/);
    assert.match(doc,/commerce-v2-2026-09-30-architecture-v15/);
  }
  assert.match(bundle,/7b8ff552ce0fa7fb0ee64ad7ace34eac5838ea60/);
  assert.match(bundle,/9356588dc60e7427932bb86b6c56724f6d52132b/);
  assert.match(bundle,/3d4220e55a4b4d480d715e49316859f2acf2e86a/);
  assert.match(bundle,/7c810e3b56ce4a5916351f3bc02a5e94a90ea07c/);
  assert.match(bundle,/001 → 003 → 004 → 005 → 006/);
});


test('single-file Worker bundles need no sibling modules',()=>{
  const denizSingle=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  const zamanSingle=fs.readFileSync(new URL('../dist/zaman-admin-worker.single.js',import.meta.url),'utf8');
  assert.ok(Buffer.byteLength(denizSingle,'utf8')>100000);
  assert.match(denizSingle,/commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col/);
  assert.match(denizSingle,/heroVisualSlide/);
  assert.match(denizSingle,/hero-01\.webp/);
  assert.match(denizSingle,/hero-04\.webp/);
  assert.doesNotMatch(denizSingle,/data:image\/webp;base64,/);
  assert.match(zamanSingle,/const \{ commerceAdminApi, commerceAdminPage \} = \(\(\) => \{/);
  assert.doesNotMatch(denizSingle,/from "\.\/commerce-v2\.js"/);
  assert.doesNotMatch(zamanSingle,/from "\.\/commerce-admin-v2\.js"/);
  assert.equal((denizSingle.match(/export default/g)||[]).length,1);
  assert.equal((zamanSingle.match(/export default/g)||[]).length,1);
});


test('complete storefront exposes logo legacy catalog and central admin controls',()=>{
  const logo=new URL('../assets/okyanus-logo.webp',import.meta.url);
  assert.ok(fs.existsSync(logo));
  assert.ok(fs.statSync(logo).size>1000);
  assert.match(logicalText(commerce),/DEFAULT_LOGO_URL/);
  assert.match(logicalText(commerce),/okyanus-logo\.webp/);
  assert.match(logicalText(commerce),/visualFallback/);
  assert.match(logicalText(commerce),/legacyCatalogEndpoint:"\/api\/products"/);
  assert.match(logicalText(commerce),/fetch\('\/api\/products'/);
  assert.match(logicalText(commerce),/Fiyat için teklif alın/);
  assert.match(logicalText(commerce),/← Ana Sayfa/);
  assert.match(logicalText(commerce),/contactStrip/);
  assert.match(logicalText(commerce),/fetch\("\/api\/contact"|fetch\('\/api\/contact'/);
  assert.match(logicalText(commerceAdmin),/resource==="settings"/);
  assert.match(logicalText(commerceAdmin),/Site Ayarları/);
  assert.match(logicalText(commerceAdmin),/resource==="legacy-catalog-sync"/);
  assert.match(logicalText(commerceAdmin),/Eski Okyanus Kataloğunu D1’e Aktar/);
  assert.match(logicalText(commerceAdmin),/imageUrl/);
  assert.match(logicalText(commerceAdmin),/price/);
  assert.match(logicalText(commerceAdmin),/featured/);
});

test('managed storefront section semantics remain functional',()=>{
  assert.match(logicalText(commerce),/function renderSection\(/);
  for(const kind of ['PRODUCT_GRID','CATEGORY_STRIP','CAMPAIGN','PROMO','CONTENT']) assert.match(logicalText(commerce),new RegExp(kind));
  assert.match(logicalText(commerce),/j\.sections\.map\(renderSection\)/);
});

test('single-file bundles are byte-current with generated delivery aliases',()=>{
  const denizSingle=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  const denizFull=fs.readFileSync(new URL('../dist/deniz-worker.monolithic.final.js',import.meta.url),'utf8');
  const denizTxt=fs.readFileSync(new URL('../exports/OKYANUS_DENIZ_FINAL_2026-10-02.txt',import.meta.url),'utf8');
  const denizCurrent=fs.readFileSync(new URL('../exports/OKYANUS_DENIZ_CURRENT_FINAL.txt',import.meta.url),'utf8');
  const zamanSingle=fs.readFileSync(new URL('../dist/zaman-admin-worker.single.js',import.meta.url),'utf8');
  assert.equal(denizSingle,denizFull);
  assert.equal(denizSingle,denizTxt);
  assert.equal(denizSingle,denizCurrent);
  assert.ok(Buffer.byteLength(denizSingle,'utf8')>100000);
  assert.doesNotMatch(zamanSingle,/from "\.\/commerce-admin-v2\.js"/);
  assert.match(zamanSingle,/commerceAdminApi/);
  assert.match(zamanSingle,/commerceAdminPage/);
});


test('cart flow keeps product selection quote scenario intact',()=>{
  assert.match(logicalText(commerce),/commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col/);
  assert.match(logicalText(commerce),/data-cart-count/);
  assert.match(logicalText(commerce),/cartRuntimeScript/);
  assert.match(logicalText(commerce),/Sepet güncel katalog, fiyat ve ürün bilgileriyle doğrulandı/);
  assert.match(logicalText(commerce),/Güncel katalog doğrulanamadı/);
  assert.match(logicalText(commerce),/data-inc/);
  assert.match(logicalText(commerce),/data-dec/);
  assert.match(logicalText(commerce),/Sepeti Temizle/);
  assert.match(logicalText(commerce),/Katalogda bulunamayan ürünü silip yeniden ekleyin/);
  assert.match(logicalText(commerce),/Telefon numarasını kontrol edin/);
  assert.match(logicalText(commerce),/2026-09-30-commerce-v2-cart/);
  assert.match(logicalText(commerce),/quoteNo\|\|j\.requestNo\|\|j\.inquiryNo/);
  assert.match(logicalText(commerce),/Bağlantı hatası\. Sepetiniz korunuyor/);
  assert.match(logicalText(commerce),/document\.dispatchEvent\(new Event\('oky-cart-change'\)\)/);
});

test('cart add paths carry current price and product metadata',()=>{
  assert.match(logicalText(commerce),/package_text:pack,category,image/);
  assert.match(logicalText(commerce),/effectivePrice\?\?p\.sale_price\?\?p\.price\?\?p\.list_price\?\?null/);
  assert.match(logicalText(commerce),/stok yok\|tükendi\|pasif\|inactive\|out of stock/);
  assert.match(logicalText(commerce),/Math\.min\(999/);
  assert.match(logicalText(commerce),/x\.price=price/);
  assert.match(logicalText(commerce),/x\.package_text=pack/);
  assert.match(logicalText(commerce),/x\.category=category/);
  assert.match(logicalText(commerce),/x\.image=image/);
});

test('cart quote payload preserves legacy quote contract',()=>{
  assert.match(logicalText(commerce),/products:a\.map\(x=>\(\{id:String\(x\.id\),name:String\(x\.name\),quantity:qty\(x\.qty,x\),unit:String\(x\.unit\|\|'Adet'\)\}\)\)/);
  assert.match(logicalText(commerce),/customer:\{name:String\(f\.name/);
  assert.match(logicalText(commerce),/consent:\{kvkk:true,textVersion:'2026-09-30-commerce-v2-cart'\}/);
  assert.match(logicalText(commerce),/fetch\('\/api\/quote'/);
});


test('architecture v15 commerce control plane is additive',()=>{
  const sql=fs.readFileSync(new URL('../migrations/006_commerce_control_plane.sql',import.meta.url),'utf8');
  for(const table of ['oky_product_commerce_v1','oky_seo_links_v1','oky_campaign_rules_v1','oky_newsletter_subscribers_v1']) assert.match(sql,new RegExp(table));
  for(const table of ['b2b_products_v1','audit_log','users','sessions','inquiries','photo_inquiries','digital_menus']){
    assert.doesNotMatch(sql,new RegExp('ALTER\\s+TABLE\\s+'+table+'\\b','i'),table);
  }
  assert.match(sql,/min_order_qty/);
  assert.match(sql,/qty_step/);
  assert.match(sql,/list_price/);
  assert.match(sql,/sale_price/);
});

test('current public storefront matches locked sales architecture',()=>{
  assert.match(logicalText(commerce),/commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col/);
  assert.match(logicalText(commerce),/contactName:"Hasan Kaya"/);
  assert.match(logicalText(commerce),/\+90 532 346 99 25/);
  assert.match(logicalText(commerce),/905323469925/);
  assert.match(logicalText(commerce),/oky-cookie-consent-v1/);
  assert.match(logicalText(commerce),/Yalnız Zorunlu/);
  assert.match(logicalText(commerce),/Tümünü Kabul Et/);
  assert.match(logicalText(commerce),/function sideNav\(/);
  assert.match(logicalText(commerce),/commerceLayout/);
  assert.match(logicalText(commerce),/oky-favorites-v1/);
  assert.match(logicalText(commerce),/helpSearch/);
  assert.match(logicalText(commerce),/runtimeSettingsScript\(\)/);
});

test('managed banner category and SEO presentation is functional',()=>{
  assert.match(logicalText(commerce),/function managedHero\(/);
  assert.match(logicalText(commerce),/desktop_image/);
  assert.match(logicalText(commerce),/mobile_image/);
  assert.match(logicalText(commerce),/data-prev/);
  assert.match(logicalText(commerce),/data-next/);
  assert.match(logicalText(commerce),/touchstart/);
  assert.match(logicalText(commerce),/ArrowLeft/);
  assert.match(logicalText(commerce),/c\.image_url/);
  assert.match(logicalText(commerce),/const SEO_ROUTES=/);
  const routes=JSON.parse(fs.readFileSync(new URL('../docs/seo-routes.json',import.meta.url),'utf8'));
  assert.equal(routes.length,200);
  for(const label of ['HORECA & İşletme','Ürün & Kategori','İstanbul & Tedarik','EDT Rehberi']) assert.match(logicalText(commerce),new RegExp(label));
  assert.match(logicalText(commerceAdmin),/oky_seo_links_v1/);
  assert.match(logicalText(commerceAdmin),/SEO 200 Link/);
});

test('full product commerce fields are admin managed and storefront visible',()=>{
  for(const field of ['sku','barcode','subcategory','origin','storage_conditions','cold_chain','min_order_qty','qty_step','list_price','sale_price','new_until','best_seller']) {
    assert.match(logicalText(commerceAdmin),new RegExp(field));
    assert.match(logicalText(commerce),new RegExp(field));
  }
  for(const field of ['sku','barcode','subcategory','minOrderQty','qtyStep','listPrice','salePrice','coldChain','bestSeller']) assert.match(logicalText(commerceAdmin),new RegExp(field));
  assert.match(logicalText(commerce),/Minimum:/);
  assert.match(logicalText(commerce),/Adım:/);
});

test('campaign rules and newsletter have real control flows',()=>{
  assert.match(logicalText(commerceAdmin),/oky_campaign_rules_v1/);
  assert.match(logicalText(commerceAdmin),/Kampanya Kuralları/);
  assert.match(logicalText(commerceAdmin),/PERCENT/);
  assert.match(logicalText(commerceAdmin),/FIXED/);
  assert.match(logicalText(commerce),/campaignRules/);
  assert.match(logicalText(commerce),/discount_value/);
  assert.match(logicalText(commerce),/target_type/);
  assert.match(logicalText(commerce),/async function newsletterApi/);
  assert.match(logicalText(commerce),/\/api\/newsletter/);
  assert.match(logicalText(commerce),/E-bülten/);
  assert.match(logicalText(commerceAdmin),/oky_newsletter_subscribers_v1/);
  assert.match(logicalText(commerceAdmin),/E-bülten/);
  assert.match(logicalText(commerce),/CONSENT_REQUIRED/);
});

test('admin exposes locked architecture control fields',()=>{
  for(const x of ['parentId','seoTitle','seoDescription','audience','deviceTarget','coldChain','campaignId','targetType','discountType','discountValue']) assert.match(logicalText(commerceAdmin),new RegExp(x));
  assert.match(logicalText(commerceAdmin),/contactName/);
  assert.match(logicalText(commerceAdmin),/Hasan Kaya/);
  assert.match(logicalText(commerceAdmin),/0532|532 346 99 25/);
});

test('staging matrix includes architecture v15 checks',()=>{
  const pre=fs.readFileSync(new URL('../scripts/staging-preflight.mjs',import.meta.url),'utf8');
  for(const id of ['DENIZ_BANNER','DENIZ_CATEGORY_MEDIA','DENIZ_CAMPAIGN_PRICE','DENIZ_QTY_RULES','DENIZ_CONTACT_OWNER','DENIZ_COOKIE','DENIZ_SEO_200','DENIZ_NEWSLETTER']) assert.match(pre,new RegExp(id));
});


test('single bundles carry architecture v15 control plane',()=>{
  const denizSingle=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  const zamanSingle=fs.readFileSync(new URL('../dist/zaman-admin-worker.single.js',import.meta.url),'utf8');
  for(const token of ['commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col','oky-cookie-consent-v1','oky-favorites-v1','oky_newsletter_subscribers_v1','oky_campaign_rules_v1','Orhan Güngör','heroVisualSlide','mobileTop']) assert.ok(logicalText(denizSingle).includes(token),token);
  for(const token of ['oky_product_commerce_v1','oky_seo_links_v1','oky_campaign_rules_v1','oky_newsletter_subscribers_v1','Kampanya Kuralları','SEO 200 Link']) assert.ok(logicalText(zamanSingle).includes(token),token);
});


test('SEO admin CRUD persists all 200 inventory routes safely',()=>{
  assert.match(logicalText(commerceAdmin),/resource==="seo"/);
  assert.match(logicalText(commerceAdmin),/INSERT INTO oky_seo_links_v1/);
  assert.match(logicalText(commerceAdmin),/ON CONFLICT\(id\) DO UPDATE SET path=excluded\.path/);
  assert.match(logicalText(commerceAdmin),/INVALID_SEO_PATH/);
  assert.match(logicalText(commerceAdmin),/SEO_LABEL_REQUIRED/);
  assert.match(logicalText(commerceAdmin),/seoPath=clean\(b\.path/);
  assert.match(logicalText(commerceAdmin),/\.test\(seoPath\)/);
  const routes=JSON.parse(fs.readFileSync(new URL('../docs/seo-routes.json',import.meta.url),'utf8'));
  assert.equal(routes.length,200);
  assert.ok(routes.every(x=>/^\/[a-z0-9-]+$/.test(x)));
});

test('full monolithic DENIZ final preserves legacy engines and Commerce V24 layer',()=>{
  const full=fs.readFileSync(new URL('../dist/deniz-worker.monolithic.final.js',import.meta.url),'utf8');
  assert.ok(Buffer.byteLength(full,'utf8')>=100000,'full DENIZ worker must retain its engines');
  assert.ok(full.includes('async function quoteAPI'),'full DENIZ worker retains the quote engine');
  assert.equal((full.match(/export default/g)||[]).length,1);
  for(const token of [
    'async function quoteAPI',
    'async function photoInquiryAPI',
    'async function okyContactMessageAPI',
    'SEO_200_ROUTE_DATA',
    'CESNI_SOURCE_MANIFEST',
    'memberSession',
    'commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col',
    'heroVisualSlide',
    'oky_product_commerce_v1',
    'oky_campaign_rules_v1',
    'newsletterApi',
    'const SEO_ROUTES=',
    'Orhan Güngör',
    '905358813264',
    'p==="/yonetici"'
  ]) assert.ok(full.includes(asciiToken(token)),token);
  assert.match(full,/buildId: "v1\.53-contact-admin-products-monolithic"|commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col/);
});

test('full monolithic DENIZ avoids archived catalog TDZ and all exports are complete',()=>{
  const full=fs.readFileSync(new URL('../dist/deniz-worker.monolithic.final.js',import.meta.url),'utf8');
  const txt=fs.readFileSync(new URL('../exports/OKYANUS_DENIZ_FINAL_2026-10-02.txt',import.meta.url),'utf8');
  const single=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  const legacyAlias=fs.readFileSync(new URL('../exports/OKYANUS_DENIZ_CURRENT_FINAL.txt',import.meta.url),'utf8');
  assert.equal(full,txt);
  assert.equal(full,single);
  assert.equal(full,legacyAlias);
  assert.match(full,/const SEO_200_ROUTE_DATA = Object\.freeze/);
  assert.match(full,/const SEO_ROUTES=/);
  assert.match(full,/commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col/);
  assert.ok(Buffer.byteLength(full,'utf8')>100000);
  assert.ok(full.includes('async function photoInquiryAPI')); 
});

test('contact admin and product v19 public contract',()=>{
  for(const token of [
    'contactName:"Hasan Kaya"',
    'secondContactName:"Orhan Güngör"',
    'secondPhone:"+90 535 881 32 64"',
    'secondWhatsapp:"905358813264"',
    'adminUrl:"https://okyanus-edt-admin.hasan-kaya474.workers.dev/commerce"',
    'contactWhatsapp1Page',
    'contactWhatsapp2Page',
    'https://api.whatsapp.com/send?phone=905358813264',
    'data-admin-link',
    'p==="/yonetici"',
    'class="desc"'
  ]) assert.ok(logicalText(commerce).includes(token),token);
  assert.match(logicalText(commerce),/!Number\.isFinite\(n\)\|\|n<=0/);
  assert.ok(logicalText(commerce).includes("description:String(x.detail||x.description||'')"));
});

test('commerce admin controls both contacts and admin URL',()=>{
  for(const token of ['secondContactName','secondPhone','secondWhatsapp','adminUrl','Orhan Güngör','+90 535 881 32 64','905358813264']) assert.ok(logicalText(commerceAdmin).includes(token),token);
  assert.ok(admin.includes('href="/commerce">🛒 Ticaret Yönetimi'));
  assert.ok(admin.includes("url.pathname === '/commerce'"));
});

test('product cards do not publish zero as a real price',()=>{
  assert.ok(logicalText(commerce).includes('n<=0'));
  assert.ok(logicalText(commerce).includes('Fiyat için teklif alın'));
  assert.ok(logicalText(commerce).includes('p.description||p.detail'));
  assert.ok(logicalText(commerce).includes("image:String(x.image||x.image_url||x.imageUrl||'')"));
});


test('Commerce management is owner-only',()=>{
  assert.match(logicalText(commerceAdmin),/function canWrite\(auth\)\{return auth\?\.user\?\.role==="owner"\}/);
  assert.ok((admin.match(/OWNER_ONLY/g)||[]).length>=2);
  assert.match(admin,/url\.pathname === '\/commerce'/);
  assert.match(admin,/resource === 'commerce-admin'/);
});

test('staging preflight keeps newsletter and quote checks as separate entries',()=>{
  const pre=fs.readFileSync(new URL('../scripts/staging-preflight.mjs',import.meta.url),'utf8');
  assert.match(pre,/Newsletter explicit-consent signup',\s*\n\s*'POST \/api\/quote creates request'/);
});


test('V24 mobile storefront follows controlled compact flow',()=>{
  for(const token of [
    'commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col',
    'class="mobileTop"',
    'class="mobileDrawer"',
    'class="mobileSearchPanel"',
    'heroVisualSlide',
    'homeBest',
    'homeCategories',
    'grid-template-columns:repeat(3,minmax(0,1fr))!important',
    '.sideNav{display:none!important}',
    '.mobile{display:none!important}'
  ]) assert.ok(logicalText(commerce).includes(token),token);
});

test('single-worker builder keeps the approved four-slide hero and V24 storefront',()=>{
  const build=fs.readFileSync(new URL('../scripts/build-single-workers.mjs',import.meta.url),'utf8');
  assert.ok(build.includes('_SINGLE_EXPORT_REQUIRED'));
  assert.ok(build.includes('_RELATIVE_IMPORT_NOT_ALLOWED'));
  assert.ok(build.includes('src/deniz-worker.js'));
  for(const n of ['01','02','03','04'])assert.ok(commerce.includes('hero-'+n+'.webp'));
});


test('final mobile and tablet cards stay three-column compact and dated export is canonical',()=>{
  assert.match(logicalText(commerce),/V24 FINAL RESPONSIVE CASCADE LOCK/);
  assert.match(logicalText(commerce),/@media\(max-width:760px\)[\s\S]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
  assert.match(logicalText(commerce),/\.product \.img\{width:100%!important;aspect-ratio:4\/3!important;max-height:92px!important/);
  assert.match(logicalText(commerce),/@media\(max-width:360px\)[\s\S]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
  assert.doesNotMatch(commerce,/\.products(?:,.seafoodProducts)?\{grid-template-columns:repeat\(2/);
  assert.doesNotMatch(commerce,/\.products(?:,.seafoodProducts)?\{grid-template-columns:1fr/);
  const single=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  const dated=fs.readFileSync(new URL('../exports/OKYANUS_DENIZ_FINAL_2026-10-02.txt',import.meta.url),'utf8');
  assert.equal(single,dated);
  assert.match(single,/cat-deniz-ai\.webp/);
  assert.ok(single.includes(asciiToken("Orhan Güngör")));
  assert.ok(single.includes(asciiToken("Listeni Fotoğrafla Gönder")));
});


test('approved homepage hero is four external visuals with no duplicate text overlay',()=>{
  for(const n of ['01','02','03','04']) assert.ok(logicalText(commerce).includes('hero-'+n+'.webp'));
  assert.match(logicalText(commerce),/HERO_VISUALS\.map/);
  assert.match(logicalText(commerce),/heroVisualSlide/);
  assert.doesNotMatch(commerce,/const hero='[^']*Profesyonel mutfağın alışverişi burada başlar/);
  const single=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  assert.match(single,/hero-01\.webp/);
  assert.match(single,/hero-04\.webp/);
});


test('standalone UTF8 delivery preserves exact public and owner-panel HTML and raw browser scripts',async()=>{
  const source=(await import('../src/deniz-worker.js')).default;
  const delivered=(await import('../dist/deniz-worker.single.js')).default;
  for(const file of ['../dist/deniz-worker.single.js','../dist/zaman-admin-worker.single.js'])
    assert.doesNotMatch(fs.readFileSync(new URL(file,import.meta.url),'utf8'),/\uFFFD/,file+' must not contain replacement characters');
  for(const path of ['/','/urunler','/sepet','/iletisim','/uye','/kvkk','/cerez-politikasi','/digital-menu-app.js']){
    const request=()=>new Request('https://www.okyonusedt.com'+path);
    const a=await source.fetch(request(),{},{}),b=await delivered.fetch(request(),{},{});
    assert.equal(b.status,a.status,path);
    assert.equal(b.headers.get('content-type'),a.headers.get('content-type'),path);
    assert.equal(await b.text(),await a.text(),path+' delivery changed rendered text/scripts');
  }
  // Both String.raw functions must retain the exact generated JavaScript, including literal backslashes.
  const bundle=fs.readFileSync(new URL('../dist/deniz-worker.single.js',import.meta.url),'utf8');
  for(const name of ['digitalMenuAppJS','customerCommerceRuntime']){
    const evaluate=text=>new Function(extractFunction(text,name)+';return '+name+'()')();
    assert.equal(evaluate(bundle),evaluate(deniz),name);
  }
  const owner={id:'owner',session_id:'session',role:'owner',status:'active',display_name:'Türkçe Yönetici',expires_at:'2099-01-01T00:00:00Z'};
  const env={SESSION_PEPPER:'test-only',DB:{prepare(){return {bind(){return this},first:async()=>owner,run:async()=>({success:true})}}}};
  const zamanSource=(await import('../src/zaman-admin-worker.js')).default;
  const zamanDelivered=(await import('../dist/zaman-admin-worker.single.js')).default;
  for(const path of ['/login','/commerce']){
    const request=()=>new Request('https://admin.example'+path,{headers:{cookie:'__Host-oky_admin=test-only'}});
    const a=await zamanSource.fetch(request(),env),b=await zamanDelivered.fetch(request(),env);
    assert.equal(a.status,200,path);assert.equal(b.status,a.status,path);
    assert.equal(await b.text(),await a.text(),path+' delivery changed admin text/scripts');
  }
});
