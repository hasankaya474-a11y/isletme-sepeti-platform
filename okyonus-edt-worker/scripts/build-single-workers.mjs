// Current-final generator: keeps Cloudflare single-file deploy bundles and final TXT exports in sync.
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const write=(p,s)=>fs.writeFileSync(new URL('../'+p,import.meta.url),s);

function inlineDeniz(){
  const base=read('src/deniz-worker.js');
  const hero64=['00','01','02','03','04','05'].map(n=>read('assets/storefront/hero-inline/hero-'+n+'.b64').trim()).join('');
  if(hero64.length<200000) throw new Error('DENIZ_MOBILE_HERO_INCOMPLETE');

  let commerce=read('src/commerce-v2.js')
    .replace('const MOBILE_HERO_INLINE=DEFAULT_LOGO_URL; // __OKYANUS_MOBILE_HERO_INLINE__','const MOBILE_HERO_INLINE='+JSON.stringify('data:image/webp;base64,'+hero64)+';')
    .replace('export async function commerceRoute','async function commerceRoute')
    .replace('export const OKY_COMMERCE_V2_BUILD=BUILD;','const OKY_COMMERCE_V2_BUILD=BUILD;');

  const start='/* ===== OKYANUS COMMERCE V20 CONTROLLED LAYER ===== */';
  const end='/* ===== /OKYANUS COMMERCE V20 CONTROLLED LAYER ===== */';
  const a=base.indexOf(start),b=base.indexOf(end,a);
  if(a<0||b<0) throw new Error('DENIZ_COMMERCE_BLOCK_NOT_FOUND');

  const wrapped=start+'\nconst { commerceRoute, OKY_COMMERCE_V2_BUILD } = (() => {\n'+commerce+'\nreturn { commerceRoute, OKY_COMMERCE_V2_BUILD };\n})();\n'+end;
  const full=base.slice(0,a)+wrapped+base.slice(b+end.length);

  if(!full.includes('mobile-storefront-v22')) throw new Error('DENIZ_V22_MOBILE_STOREFRONT_REQUIRED');
  if(!full.includes('SEAFOOD_PRODUCTS')||!full.includes('seoCompact')||!full.includes('CATEGORY_ASSET_ROOT')) throw new Error('DENIZ_V22_CONTRACT_MISSING');
  if(!full.includes('defaultHeroMedia')||!full.includes('mobileTop')||!full.includes('data:image/webp;base64,')) throw new Error('DENIZ_V22_MOBILE_ASSETS_MISSING');
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
write('dist/deniz-worker.monolithic.final.js',deniz);
write('dist/deniz-worker.single.js',deniz);
write('dist/zaman-admin-worker.single.js',zaman);
write('exports/OKYANUS_DENIZ_MONOLITHIC_FINAL_V18_2026-09-30.txt',deniz);
write('exports/OKYANUS_DENIZ_FINAL_R4_TAM_KOD_2026-09-30.txt',deniz);
write('exports/OKYANUS_DENIZ_CURRENT_FINAL.txt',deniz);
write('exports/OKYANUS_ZAMAN_ADMIN_CURRENT_FINAL.txt',zaman);
console.log('MONOLITH + SINGLE WORKER BUNDLES + ALL FINAL EXPORT ALIASES BUILT');
