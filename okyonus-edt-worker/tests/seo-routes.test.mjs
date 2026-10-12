import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../src/deniz-worker.js';
const source=fs.readFileSync(new URL('../src/deniz-worker.js',import.meta.url),'utf8');
const start=source.indexOf('const SEO_200_ROUTE_DATA'),end=source.indexOf('const SEO_200_ROUTES',start);
const ctx=vm.createContext({});vm.runInContext(source.slice(start,end),ctx);
const data=JSON.parse(vm.runInContext('JSON.stringify(SEO_200_ROUTE_DATA)',ctx));
const paths=JSON.parse(fs.readFileSync(new URL('../docs/seo-routes.json',import.meta.url),'utf8'));
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const expectedAliases={'deniz-urunleri':'deniz-urunleri','kirmizi-et':'islenmis-et-urunleri','kanatli':'islenmis-et-urunleri','donuk':'dondurulmus-urunler','patates':'dondurulmus-urunler','bakliyat':'bakliyat-kuru-gida-temel-gidalar','bulgur':'bakliyat-kuru-gida-temel-gidalar','yaglar':'yaglar-temel-gidalar','sut-urunleri':'sut-ve-kahvaltilik','soslar':'soslar-temel-gidalar'};

test('all 200 SEO pages render valid Turkish metadata and real catalogue destinations',async()=>{
 assert.equal(paths.length,200);assert.equal(new Set(paths).size,200);assert.equal(Object.keys(data).length,200);
 const targets=new Map();const titles=new Set(),heads=new Set();
 for(const path of paths){
  const d=data[path];assert.ok(d,path);const response=await worker.fetch(new Request('https://www.okyonusedt.com'+path),{}, {waitUntil(){}});assert.equal(response.status,200,path);const html=await response.text();
  const title=decode(html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1]||'');const h1=decode(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]||'');assert.equal(title,d.label+' | Okyanus EDT',path);assert.equal(h1,d.label,path);titles.add(title);heads.add(h1);
  assert.match(html,new RegExp('<link rel="canonical" href="https://www\\.okyonusedt\\.com'+path+'"'),path);assert.match(html,/<meta name="robots" content="index,follow,max-image-preview:large">/,path);
  const visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');assert.doesNotMatch(visible,/[ÃÄÅ�]/,path+' corrupted Turkish');assert.ok(visible.length>1500,path+' substantive body');
  const unavailable=html.includes('class="s2availability"');const primaryRaw=html.match(/<a class="s2btn" href="([^"]+)"/)?.[1];assert.ok(primaryRaw,path+' CTA');const primary=new URL(decode(primaryRaw),'https://www.okyonusedt.com');assert.equal(primary.pathname,'/urunler');
  let requested=primary;
  if(unavailable){assert.equal(primary.search,'',path+' general catalog fallback');assert.match(visible,/katalogda doğrudan bir eşleşme bulunmuyor/);assert.match(html,/href="\/fotografla-teklif"/);const href=html.match(/<a[^>]*href="([^"]+)"[^>]*>Ürün adıyla katalogda ara<\/a>/)?.[1];assert.ok(href,path+' unavailable request retained');requested=new URL(decode(href),'https://www.okyonusedt.com');}
  assert.equal(requested.searchParams.get('source'),'seo200');const declared=new URL(d.target,'https://www.okyonusedt.com');if(declared.searchParams.has('q'))assert.equal(requested.searchParams.get('q'),declared.searchParams.get('q'),path+' declared search retained');
  const expectedCategory=requested.searchParams.get('q')==='tereyağı'?'tereyagi':expectedAliases[d.categoryId];if(expectedCategory)assert.equal(requested.searchParams.get('category'),expectedCategory,path+' current category');if(d.categoryId==='patates')assert.equal(requested.searchParams.get('q'),'patates',path);
  targets.set(primary.pathname+primary.search,{path,target:primary});
  if(unavailable){const query=new URLSearchParams(requested.search);query.delete('source');const res=await worker.fetch(new Request('https://www.okyonusedt.com/api/storefront-v2?'+query),{}, {waitUntil(){}});const json=await res.json();assert.equal(json.products.length,0,path+' truthful unavailable copy');}

 }
 assert.equal(titles.size,200);assert.equal(heads.size,200);
 for(const {path,target}of targets.values()){
  const query=new URLSearchParams(target.search);query.delete('source');const response=await worker.fetch(new Request('https://www.okyonusedt.com/api/storefront-v2?'+query),{}, {waitUntil(){}});assert.equal(response.status,200,path+' destination');const json=await response.json();assert.ok(json.products?.length>0,path+' target has matching products '+target.search);
 }
});

test('sitemap, robots and public SEO audit include all 200 indexable routes',async()=>{
 const get=path=>worker.fetch(new Request('https://www.okyonusedt.com'+path),{}, {waitUntil(){}});
 const sitemapResponse=await get('/sitemap.xml');assert.equal(sitemapResponse.status,200);const xml=await sitemapResponse.text();for(const path of paths)assert.ok(xml.includes('<loc>https://www.okyonusedt.com'+path+'</loc>'),path+' indexed sitemap');
 const robotsResponse=await get('/robots.txt');assert.equal(robotsResponse.status,200);const robots=await robotsResponse.text();assert.match(robots,/Sitemap: https:\/\/www\.okyonusedt\.com\/sitemap\.xml/);assert.doesNotMatch(robots,/Disallow:\s*\/\s*$/m);
 const auditResponse=await get('/api/google-growth/status');assert.equal(auditResponse.status,200);const audit=await auditResponse.json();assert.equal(audit.seo200Audit.ok,true);assert.equal(audit.seo200Audit.routes,200);assert.equal(audit.seo200Audit.homeLinks,200);assert.equal(audit.seo200Audit.sitemapLinks,200);
});
