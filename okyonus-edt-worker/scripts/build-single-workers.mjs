// Current-final generator: keeps canonical DENIZ source, single-file deploy bundles and TXT exports byte-synchronized.
// FOUR_SLIDE_HERO_EXTERNAL_ASSETS_LOCK: hero-01.webp..hero-04.webp stay external and are never base64-inlined.
import fs from 'node:fs';
// V24 regression tests synchronized: final outputs are rebuilt from the three-column mobile/tablet source.

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
// Delivery bundles are ASCII-only: clipboard/text-editor encoding cannot corrupt Turkish text.
// Preserve String.raw runtime scripts byte-for-byte using cooked Unicode interpolations.
function asciiBundle(source){
  const escape=c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0');
  let result='',cursor=0;
  for(;;){
    const tag=source.indexOf('String.raw`',cursor);
    if(tag<0){result+=source.slice(cursor).replace(/[^\x00-\x7f]/g,escape);break}
    const start=tag+'String.raw`'.length;
    result+=source.slice(cursor,start).replace(/[^\x00-\x7f]/g,escape);
    let end=start;
    while(end<source.length){if(source[end]==='\\'){end+=2;continue}if(source[end]==='`')break;end++}
    if(end>=source.length)throw new Error('ASCII_RAW_TEMPLATE_UNTERMINATED');
    const raw=source.slice(start,end);
    if(raw.includes('${'))throw new Error('ASCII_RAW_TEMPLATE_INTERPOLATION_REQUIRES_REVIEW');
    result+=raw.replace(/[^\x00-\x7f]/g,c=>'${"'+escape(c)+'"}')+'`';
    cursor=end+1;
  }
  return result;
}
const write=(p,s)=>fs.writeFileSync(new URL('../'+p,import.meta.url),s,'utf8');
const START='/* ===== OKYANUS COMMERCE V20 CONTROLLED LAYER ===== */';
const END='/* ===== /OKYANUS COMMERCE V20 CONTROLLED LAYER ===== */';

function commerceBody({inlineHero=null}={}){
  let commerce=read('src/commerce-v2.js')
    .replace('export async function commerceRoute','async function commerceRoute')
    .replace('export const OKY_COMMERCE_V2_BUILD=BUILD;','const OKY_COMMERCE_V2_BUILD=BUILD;');
  if(inlineHero){
    commerce=commerce.replace(
      'const MOBILE_HERO_INLINE=DEFAULT_HERO_URL; // __OKYANUS_MOBILE_HERO_INLINE__',
      'const MOBILE_HERO_INLINE='+JSON.stringify(inlineHero)+';'
    );
  }
  return commerce;
}

function replaceCommerceBlock(base,commerce){
  const a=base.indexOf(START),b=base.indexOf(END,a);
  if(a<0||b<0) throw new Error('DENIZ_COMMERCE_BLOCK_NOT_FOUND');
  const wrapped=START+'\nconst { commerceRoute, OKY_COMMERCE_V2_BUILD } = (() => {\n'+commerce+'\nreturn { commerceRoute, OKY_COMMERCE_V2_BUILD };\n})();\n'+END;
  return base.slice(0,a)+wrapped+base.slice(b+END.length);
}

function syncDenizSource(){
  const base=read('src/deniz-worker.js');
  const synced=replaceCommerceBlock(base,commerceBody());
  if(synced!==base) write('src/deniz-worker.js',synced);
  return synced;
}

function inlineDeniz(){
  const base=syncDenizSource();
  const commerce=commerceBody();
  const full=replaceCommerceBlock(base,commerce);
  for(const token of [
    'commerce-v2-2026-10-01-mobile-storefront-v24-fluid-3col',
    'grid-template-columns:repeat(3,minmax(0,1fr))',
    'aspect-ratio:4/3;max-height:96px',
    'cat-deniz-ai.webp','cat-donuk-ai.webp','cat-et-ai.webp','cat-kuru-ai.webp',
    'cat-yag-ai.webp','cat-sut-ai.webp','cat-sos-ai.webp','cat-baharat-ai.webp',
    'Hasan Kaya','Orhan Güngör','905323469925','905358813264',
    'Listeni Fotoğrafla Gönder','Ürün Seç • Teklif Al',
    'hero-01.webp','hero-02.webp','hero-03.webp','hero-04.webp',
    'async function quoteAPI','async function photoInquiryAPI','async function okyContactMessageAPI'
  ]) if(!full.includes(token)) throw new Error('DENIZ_FINAL_CONTRACT_MISSING:'+token);

  if(!full.includes('mobile-storefront-v24-fluid-3col')) throw new Error('DENIZ_V24_MOBILE_STOREFRONT_REQUIRED');
  for(const forbidden of [
    '.products{grid-template-columns:repeat(2',
    '.products,.seafoodProducts{grid-template-columns:repeat(2',
    '.products{grid-template-columns:1fr',
    '.products,.seafoodProducts{grid-template-columns:1fr'
  ]) if(commerce.includes(forbidden)) throw new Error('DENIZ_MOBILE_PRODUCT_GRID_REGRESSION:'+forbidden);
  if(!full.includes('SEAFOOD_PRODUCTS')||!full.includes('seoCompact')||!full.includes('CATEGORY_ASSET_ROOT')) throw new Error('DENIZ_V24_CONTRACT_MISSING');
  if(!full.includes('hero-01.webp')||!full.includes('hero-04.webp')||!full.includes('mobileTop')) throw new Error('DENIZ_V24_MOBILE_ASSETS_MISSING');
  if((full.match(/export default/g)||[]).length!==1) throw new Error('DENIZ_SINGLE_EXPORT_REQUIRED');
  return full;
}

function inlineZaman(){
  let adminModule=read('src/commerce-admin-v2.js')
    .replace('export async function commerceAdminApi','async function commerceAdminApi')
    .replace('export function commerceAdminPage','function commerceAdminPage');
  let zaman=read('src/zaman-admin-worker.js')
    .replace(/^import \{ commerceAdminApi, commerceAdminPage \} from "\.\/commerce-admin-v2\.js";\s*/,'');
  return `/* OKYANUS EDT - SINGLE FILE ZAMAN/ADMIN WORKER
Generated from canonical release sources. No relative imports.
*/
const { commerceAdminApi, commerceAdminPage } = (() => {
${adminModule}
return { commerceAdminApi, commerceAdminPage };
})();
${zaman}`;
}

const deniz=inlineDeniz();
const zaman=inlineZaman();

for(const p of [
  'dist/deniz-worker.monolithic.final.js',
  'dist/deniz-worker.single.js',
  'exports/OKYANUS_DENIZ_MONOLITHIC_FINAL_V18_2026-09-30.txt',
  'exports/OKYANUS_DENIZ_FINAL_R4_TAM_KOD_2026-09-30.txt',
  'exports/OKYANUS_DENIZ_CURRENT_FINAL.txt',
  'exports/OKYANUS_DENIZ_FINAL_2026-10-01.txt'
]) write(p,'/* OKYANUS DENIZ RELEASE 2026-10-01 CROSSCHECKED R28 */\n'+asciiBundle(deniz));

write('dist/zaman-admin-worker.single.js','/* OKYANUS ZAMAN RELEASE 2026-10-01 CROSSCHECKED R28 */\n'+asciiBundle(zaman));
write('exports/OKYANUS_ZAMAN_ADMIN_CURRENT_FINAL.txt','/* OKYANUS ZAMAN RELEASE 2026-10-01 CROSSCHECKED R28 */\n'+asciiBundle(zaman));
console.log('CANONICAL DENIZ SOURCE + SINGLE WORKER + FINAL TXT ALIASES SYNCHRONIZED');
