import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const write=(p,s)=>fs.writeFileSync(new URL('../'+p,import.meta.url),s);

function inlineDeniz(){
  let commerce=read('src/commerce-v2.js')
    .replace('export async function commerceRoute','async function commerceRoute')
    .replace(/\nexport const OKY_COMMERCE_V2_BUILD=BUILD;\s*$/,'');
  let deniz=read('src/deniz-worker.js')
    .replace(/^import \{ commerceRoute \} from "\.\/commerce-v2\.js";\s*/,'');
  return '/* OKYANUS EDT - SINGLE FILE DENIZ WORKER\nGenerated from canonical release sources.\ncommerce-v2.js is isolated in an internal scope so Cloudflare only needs this one file.\n*/\nconst { commerceRoute } = (() => {\n'+commerce+'\nreturn { commerceRoute };\n})();\n'+deniz;
}

function inlineZaman(){
  let adminModule=read('src/commerce-admin-v2.js')
    .replace('export async function commerceAdminApi','async function commerceAdminApi')
    .replace('export function commerceAdminPage','function commerceAdminPage');
  let zaman=read('src/zaman-admin-worker.js')
    .replace(/^import \{ commerceAdminApi, commerceAdminPage \} from "\.\/commerce-admin-v2\.js";\s*/,'');
  return '/* OKYANUS EDT - SINGLE FILE ZAMAN/ADMIN WORKER\nGenerated from canonical release sources.\ncommerce-admin-v2.js is isolated in an internal scope so Cloudflare only needs this one file.\n*/\nconst { commerceAdminApi, commerceAdminPage } = (() => {\n'+adminModule+'\nreturn { commerceAdminApi, commerceAdminPage };\n})();\n'+zaman;
}

write('dist/deniz-worker.single.js',inlineDeniz());
write('dist/zaman-admin-worker.single.js',inlineZaman());
console.log('SINGLE WORKER BUNDLES BUILT');
