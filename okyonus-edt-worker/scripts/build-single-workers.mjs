import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const write=(p,s)=>fs.writeFileSync(new URL('../'+p,import.meta.url),s);

function inlineDeniz(){
  let full=read('dist/deniz-worker.monolithic.final.js');
  if(!full.includes('OKY_COMMERCE_ROUTE_V18')) throw new Error('MONOLITH_V18_REQUIRED');
  if(Buffer.byteLength(full,'utf8')<3900000) throw new Error('MONOLITH_TOO_SMALL');
  let commerce=read('src/commerce-v2.js')
    .replace('export async function commerceRoute','async function commerceRoute')
    .replace('export const OKY_COMMERCE_V2_BUILD=BUILD;','const OKY_COMMERCE_V2_BUILD=BUILD;');
  const start=full.indexOf('const BUILD="commerce-v2-2026-09-30-contact-admin-products-v18";');
  if(start<0) throw new Error('COMMERCE_BLOCK_START_NOT_FOUND');
  const endToken='OKY_COMMERCE_V2_BUILD=BUILD;';
  const endBase=full.indexOf(endToken,start);
  if(endBase<0) throw new Error('COMMERCE_BLOCK_END_NOT_FOUND');
  const end=endBase+endToken.length;
  full=full.slice(0,start)+commerce+full.slice(end);
  if(!full.includes('SEAFOOD_PRODUCTS')||!full.includes('seoCompact')) throw new Error('COMMERCE_V19_INJECTION_FAILED');
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

const deniz=inlineDeniz();
const zaman=inlineZaman();
write('dist/deniz-worker.single.js',deniz);
write('dist/zaman-admin-worker.single.js',zaman);
write('exports/OKYANUS_DENIZ_CURRENT_FINAL.txt',deniz);
write('exports/OKYANUS_ZAMAN_ADMIN_CURRENT_FINAL.txt',zaman);
console.log('SINGLE WORKER BUNDLES + CURRENT FINAL EXPORTS BUILT');
