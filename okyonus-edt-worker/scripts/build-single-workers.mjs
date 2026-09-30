// Current-final generator: keeps Cloudflare single-file deploy bundles and final TXT exports in sync.
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const write=(p,s)=>fs.writeFileSync(new URL('../'+p,import.meta.url),s);

function inlineDeniz(){
  const full=read('src/deniz-worker.js');
  if(!full.includes('controlled-storefront-v20')) throw new Error('DENIZ_V20_REQUIRED');
  if(!full.includes('SEAFOOD_PRODUCTS')||!full.includes('seoCompact')) throw new Error('DENIZ_V20_CONTRACT_MISSING');
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
