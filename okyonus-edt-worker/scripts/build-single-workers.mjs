import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const write=(p,s)=>fs.writeFileSync(new URL('../'+p,import.meta.url),s);

function inlineDeniz(){
  const full=read('dist/deniz-worker.monolithic.final.js');
  if(!full.includes('OKY_COMMERCE_ROUTE_V18')) throw new Error('MONOLITH_V18_REQUIRED');
  if(Buffer.byteLength(full,'utf8')<3900000) throw new Error('MONOLITH_TOO_SMALL');
  return full;
}

function inlineZaman(){
  let adminModule=read('src/commerce-admin-v2.js')
    .replace('export async function commerceAdminApi','async function commerceAdminApi')
    .replace('export function commerceAdminPage','function commerceAdminPage');
  let zaman=read('src/zaman-admin-worker.js')
    .replace(/^import \{ commerceAdminApi, commerceAdminPage \} from "\.\/commerce-admin-v2\.js";\s*/,'');
  return '/* OKYANUS EDT - SINGLE FILE ZAMAN/ADMIN WORKER\nGenerated from canonical release sources.\ncommerce-admin-v2.js is isolated in an internal scope so Cloudflare only needs this one file.\n*/\nconst { commerceAdminApi, commerceAdminPage } = (() => {\n'+adminModule+'\nreturn { commerceAdminApi, commerceAdminPage };\n})();\n'+zaman;
}

const denizSingle=inlineDeniz();
const zamanSingle=inlineZaman();
write('dist/deniz-worker.single.js',denizSingle);
write('exports/OKYANUS_DENIZ_FINAL_R4_TAM_KOD_2026-09-30.txt',denizSingle);
write('exports/OKYANUS_DENIZ_MONOLITHIC_FINAL_V19_2026-09-30.txt',denizSingle);
write('dist/zaman-admin-worker.single.js',zamanSingle);
write('exports/OKYANUS_ZAMAN_ADMIN_FINAL_R4_TAM_KOD_2026-09-30.txt',zamanSingle);
write('exports/OKYANUS_ZAMAN_ADMIN_FINAL_V19_OWNER_ONLY_2026-09-30.txt',zamanSingle);
console.log('SINGLE WORKER BUNDLES BUILT + ZAMAN FINAL EXPORTS SYNCED');
