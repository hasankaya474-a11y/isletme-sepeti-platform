import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {pathToFileURL} from "node:url";

const root=process.cwd();
const p=(...x)=>path.join(root,...x);
const deniz=fs.readFileSync(p("okyonus-edt-worker","src","deniz-worker.js"),"utf8");
const denizBase=fs.readFileSync(p("okyonus-edt-worker","baseline","deniz-worker.js"),"utf8");
const admin=fs.readFileSync(p("okyonus-edt-worker","src","zaman-admin-worker.js"),"utf8");
const adminBase=fs.readFileSync(p("okyonus-edt-worker","baseline","zaman-admin-worker.js"),"utf8");
const commerce=fs.readFileSync(p("okyonus-edt-worker","src","commerce-v2.js"),"utf8");
const commerceAdmin=fs.readFileSync(p("okyonus-edt-worker","src","commerce-admin-v2.js"),"utf8");

function syntaxCheck(source,name){
  const file=path.join(os.tmpdir(),name+".mjs");
  fs.writeFileSync(file,source);
  execFileSync(process.execPath,["--check",file],{stdio:"pipe"});
}
function extractFunction(source,name){
  const patterns=[
    "async function "+name+"(",
    "function "+name+"("
  ];
  let start=-1;
  for(const q of patterns){start=source.indexOf(q);if(start>=0)break}
  assert.ok(start>=0,"missing function "+name);
  const brace=source.indexOf("{",start);
  assert.ok(brace>=0,"missing function brace "+name);
  let depth=0,quote="",escape=false,templateDepth=0;
  for(let i=brace;i<source.length;i++){
    const c=source[i],n=source[i+1];
    if(quote){
      if(escape){escape=false;continue}
      if(c==="\\"){escape=true;continue}
      if(quote==="\`"&&c==="$"&&n==="{"){templateDepth++;i++;continue}
      if(quote==="\`"&&c==="}"&&templateDepth>0){templateDepth--;continue}
      if(c===quote&&templateDepth===0)quote="";
      continue;
    }
    if(c==="'"||c==='"'||c==="\`"){quote=c;continue}
    if(c==="/"&&n==="/"){i=source.indexOf("\n",i);if(i<0)return source.slice(start);continue}
    if(c==="/"&&n==="*"){const e=source.indexOf("*/",i+2);assert.ok(e>=0);i=e+1;continue}
    if(c==="{")depth++;
    if(c==="}"){depth--;if(depth===0)return source.slice(start,i+1)}
  }
  throw new Error("unterminated function "+name);
}
function parseFrozenJsonArray(source,constName){
  const token="const "+constName+"=Object.freeze(";
  const s=source.indexOf(token);assert.ok(s>=0,"missing "+constName);
  const a=source.indexOf("[",s),z=source.indexOf("]);",a);assert.ok(a>=0&&z>a,"invalid "+constName);
  return JSON.parse(source.slice(a,z+1));
}

test("DENIZ and ZAMAN sources parse as modules",()=>{
  assert.ok(deniz.length>3_000_000);
  assert.ok(admin.length>100_000);
  syntaxCheck(deniz,"okyonus-deniz-worker");
  syntaxCheck(admin,"okyonus-zaman-worker");
});

test("critical DENIZ email/message/quote/photo engines are byte-preserved",()=>{
  for(const fn of ["sendBoundEmail","quoteAPI","photoInquiryAPI","okyContactMessageAPI"]){
    assert.equal(extractFunction(deniz,fn),extractFunction(denizBase,fn),fn+" changed");
  }
});

test("critical ZAMAN message/photo engines are byte-preserved",()=>{
  for(const fn of ["messageCenterRoute","photoMessageRouteV2"]){
    assert.equal(extractFunction(admin,fn),extractFunction(adminBase,fn),fn+" changed");
  }
});

test("current commerce homepage and active public flows are wired",()=>{
  assert.match(commerce,/function home\(\)/);
  assert.match(commerce,/Ürün Seç • Teklif Al/);
  assert.match(commerce,/Listeni Fotoğrafla Gönder/);
  assert.match(commerce,/\/api\/storefront-v2/);
  assert.match(deniz,/fetch\('\/api\/quote'/);
  assert.match(deniz,/\/api\/photo-inquiries/);
  assert.match(deniz,/\/api\/contact/);
  assert.match(commerce,/secondWhatsapp:"905358813264"/);
});

test("legacy business tools remain preserved behind the current commerce storefront",()=>{
  for(const token of ["function costRadarPage","function academyPage","function cesniPageVNext","function digitalMenuPage"]) assert.ok(deniz.includes(token),token);
  for(const route of ['path === "/cost-radar"','path === "/akademi"','path === "/cesni"','path === "/dijital-menu"']) assert.ok(deniz.includes(route),route);
  assert.match(admin,/moduleFlagsRoute/);
  assert.match(admin,/Satış Modu & Modül Kontrolü/);
});

test("Digital Menu engine and public menu routes remain present",()=>{
  assert.match(deniz,/function digitalMenuEnsureSchema/);
  assert.match(deniz,/function digitalMenuPage/);
  assert.match(deniz,/function publicDigitalMenuPage/);
  assert.match(deniz,/\/digital-menu-app\.js/);
  assert.match(deniz,/path === "\/dijital-menu"/);
  assert.match(deniz,/path\.startsWith\("\/menu\/"\)/);
});

test("Commerce help exposes current storefront assistance",()=>{
  const help=extractFunction(commerce,"help");
  assert.match(help,/Ürün|ürün/);
  assert.match(help,/teklif/i);
  assert.match(help,/İletişim|iletişim/);
  assert.match(commerce,/p==="\/yardim"\|\|p==="\/site-yardim"/);
});

test("SEO keeps commerce routes public while private workspaces stay non-indexable",()=>{
  assert.match(deniz,/const SEO_PRIVATE_PREFIXES = Object\.freeze\(\["\/api\/","\/uye","\/uyelik","\/benim-okyanusum","\/cost","\/cesni","\/dijital-menu"/);
  for(const route of ["/edt-horeca-gida-tedarikcisi","/edt-deniz-urunleri-tedarikcisi","/istanbul-restoran-gida-tedariki"]) assert.ok(commerce.includes(route),route);
  assert.match(commerce,/seoModulesHtml/);
});


test("DENIZ runtime smoke: commerce homepage, help and catalog remain available",async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"oky-runtime-"));
  const file=path.join(dir,"deniz.mjs");
  fs.writeFileSync(file,deniz);
  const mod=await import(pathToFileURL(file).href+"?v="+Date.now());
  assert.ok(mod.default&&typeof mod.default.fetch==="function");
  const home=await mod.default.fetch(new Request("https://www.okyonusedt.com/"),{}, {waitUntil(){}});
  assert.equal(home.status,200);
  const homeText=await home.text();
  assert.match(homeText,/Profesyonel mutfağın alışverişi burada başlar/);
  assert.match(homeText,/Sepet \/ Teklif/);
  assert.match(homeText,/Site Yardım/);
  const help=await mod.default.fetch(new Request("https://www.okyonusedt.com/yardim"),{}, {waitUntil(){}});
  assert.equal(help.status,200);
  assert.match(await help.text(),/Site Yardım/);
  const catalog=await mod.default.fetch(new Request("https://www.okyonusedt.com/urunler"),{}, {waitUntil(){}});
  assert.equal(catalog.status,200);
  assert.match(await catalog.text(),/Ürünler|Kategoriler/);
  const radar=await mod.default.fetch(new Request("https://www.okyonusedt.com/cost-radar"),{}, {waitUntil(){}});
  assert.equal(radar.status,200);
});

test("ZAMAN runtime smoke: login surface remains available",async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"oky-admin-runtime-"));
  const file=path.join(dir,"zaman.mjs");
  fs.writeFileSync(file,admin);
  fs.writeFileSync(path.join(dir,"commerce-admin-v2.js"),commerceAdmin);
  const mod=await import(pathToFileURL(file).href+"?v="+Date.now());
  assert.ok(mod.default&&typeof mod.default.fetch==="function");
  const res=await mod.default.fetch(new Request("https://admin.example.test/login"),{SESSION_PEPPER:"x".repeat(64)});
  assert.equal(res.status,200);
  const body=await res.text();
  assert.match(body,/Yönetici Paneli/);
});


test("new Okyanus homepage is mobile/tablet ready and keeps navigation controlled",()=>{
  assert.match(commerce,/class="mobileTop"/);
  assert.match(commerce,/class="mobileDrawer"/);
  assert.match(commerce,/class="mobileSearchPanel"/);
  assert.match(commerce,/@media\(max-width:1024px\)/);
  assert.match(commerce,/@media\(max-width:760px\)/);
  assert.match(commerce,/@media\(max-width:420px\)/);
  assert.match(commerce,/\.sideNav\{display:none!important\}/);
  assert.match(commerce,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/);
});

test("current commerce homepage reconnects managed storefront publication",()=>{
  assert.match(commerce,/fetch\('\/api\/storefront-v2'/);
  assert.match(commerce,/function managedHero\(list\)/);
  assert.match(commerce,/Array\.isArray\(j\.banners\)/);
  assert.match(commerce,/Array\.isArray\(j\.categories\)/);
  assert.match(commerce,/Array\.isArray\(j\.campaigns\)/);
});

test("homepage product cards use catalog media, price and stock data",()=>{
  const card=extractFunction(commerce,"card");
  assert.match(card,/p\.image/);
  assert.match(card,/p\.effectivePrice/);
  assert.match(card,/p\.stock_status\|\|p\.stockStatus/);
  assert.match(card,/Sepete \/ Teklife Ekle/);
});
