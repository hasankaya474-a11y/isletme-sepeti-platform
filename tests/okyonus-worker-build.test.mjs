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

test("sales-first homepage and active public flows are wired",()=>{
  assert.match(deniz,/okySalesFirstHomeV1\(\)/);
  assert.match(deniz,/Ürün Seç • Teklif Al/);
  assert.match(deniz,/Listeni Fotoğrafla Gönder/);
  assert.match(deniz,/fetch\('\/api\/b2b\/products'/);
  assert.match(deniz,/fetch\('\/api\/quote'/);
  assert.match(deniz,/\/api\/photo-inquiries/);
  assert.match(deniz,/\/api\/contact/);
  assert.match(deniz,/wa\.me\/905358813264/);
});

test("legacy tools default hidden while Digital Menu remains active",()=>{
  for(const item of ["COST:false","COST_RADAR:false","ACADEMY:false","CESNI:false","EASY_RECIPE:false"]) assert.ok(deniz.includes(item),item);
  for(const item of ["ABOUT:true","CONTACT:true"]) assert.ok(deniz.includes(item),item);
  for(const item of ["PRODUCTS:true","QUOTE:true","PHOTO:true","SEO:true","MEMBERSHIP:true","DIGITAL_MENU:true","ABOUT:true","CONTACT:true"]) assert.ok(deniz.includes(item),item);\n  assert.ok(deniz.includes("WHATSAPP:false"),"WhatsApp must remain hidden until verified");
  assert.match(deniz,/okyFeatureUnavailable/);
  assert.match(admin,/moduleFlagsRoute/);
  assert.match(admin,/Satış Modu & Modül Kontrolü/);
});

test("Digital Menu has at least 30 themes and 30 templates",()=>{
  const themes=parseFrozenJsonArray(deniz,"OKY_DIGITAL_MENU_THEMES");
  const templates=parseFrozenJsonArray(deniz,"OKY_DIGITAL_MENU_TEMPLATES");
  assert.ok(themes.length>=30,"themes="+themes.length);
  assert.ok(templates.length>=30,"templates="+templates.length);
  assert.equal(new Set(themes.map(x=>x.id)).size,themes.length);
  assert.equal(new Set(templates.map(x=>x.id)).size,templates.length);
  assert.match(deniz,/themePreset:/);
  assert.match(deniz,/template:/);
  assert.match(deniz,/dmThemeCatalog/);
  assert.match(deniz,/dmTemplateCatalog/);
  assert.match(deniz,/\/api\/digital-menu\/presets/);
});

test("Help exposes active modules only",()=>{
  const help=extractFunction(deniz,"okySalesHelpPage");
  assert.match(help,/Ürün Seç • Teklif Al/);
  assert.match(help,/Fotoğrafla Teklif/);
  assert.match(help,/WhatsApp Satış/);
  assert.match(help,/Dijital Menü/);
  assert.doesNotMatch(help,/COST Maliyet/);
  assert.doesNotMatch(help,/COST Radar/);
  assert.doesNotMatch(help,/Akademi/);
  assert.doesNotMatch(help,/ÇEŞNİ/);
});

test("SEO keeps product/photo/contact and removes hidden legacy routes from primary route list",()=>{
  const m=deniz.match(/const SEO_INDEXABLE_ROUTES = Object\.freeze\(\[([\s\S]*?)\]\);/);
  assert.ok(m);
  const block=m[1];
  assert.match(block,/\/urunler/);
  assert.match(block,/\/fotografla-teklif/);
  assert.match(block,/\/iletisim/);
  assert.match(block,/\/dijital-menu-cozumleri/);
  assert.doesNotMatch(block,/\/cost-radar/);
  assert.match(block,/\/hakkimizda/);
});


test("DENIZ runtime smoke: homepage/help/digital-menu landing/hidden module",async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"oky-runtime-"));
  const file=path.join(dir,"deniz.mjs");
  fs.writeFileSync(file,deniz);
  fs.writeFileSync(path.join(dir,"commerce-v2.js"),commerce);
  const mod=await import(pathToFileURL(file).href+"?v="+Date.now());
  assert.ok(mod.default&&typeof mod.default.fetch==="function");
  const home=await mod.default.fetch(new Request("https://www.okyonusedt.com/"),{}, {waitUntil(){}});
  assert.equal(home.status,200);
  const homeText=await home.text();
  assert.match(homeText,/Profesyonel mutfağın alışverişi burada başlar/);
  assert.match(homeText,/Sepet \/ Teklif/);
  assert.match(homeText,/İletişim/);
  assert.match(homeText,/Site Yardım/);
  assert.doesNotMatch(homeText,/wa\.me\//);\n  assert.match(homeText,/\/site-yardim|\/yardim/);
  const help=await mod.default.fetch(new Request("https://www.okyonusedt.com/yardim"),{}, {waitUntil(){}});
  assert.equal(help.status,200);
  const helpText=await help.text();
  assert.match(helpText,/Site Yardım/);
  assert.doesNotMatch(helpText,/COST Maliyet/);
  const dm=await mod.default.fetch(new Request("https://www.okyonusedt.com/dijital-menu-cozumleri"),{}, {waitUntil(){}});
  assert.equal(dm.status,200);
  const dmText=await dm.text();
  assert.match(dmText,/30 tema ve 30 profesyonel şablon/);
  assert.match(dmText,/Tema Seç/);
  assert.match(dmText,/Şablon Seç/);
  const hidden=await mod.default.fetch(new Request("https://www.okyonusedt.com/cost-radar"),{}, {waitUntil(){}});
  assert.equal(hidden.status,404);
  assert.match(await hidden.text(),/Bu modül şu anda aktif değil/);
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


test("new Okyanus homepage is mobile/tablet ready and keeps navigation available",()=>{
  assert.match(deniz,/class="okyTopbar"/);
  assert.match(deniz,/class="okyMobileNav"/);
  assert.match(deniz,/@media\(max-width:900px\)/);
  assert.match(deniz,/@media\(max-width:620px\)/);
  assert.match(deniz,/@media\(max-width:430px\)/);
  assert.match(deniz,/@media\(max-width:360px\)/);
  assert.match(deniz,/\.okyMobileNav\{position:sticky/);
  assert.match(deniz,/min-height:44px/);
});

test("sales-first homepage reconnects Vitrin Studio live publication",()=>{
  assert.match(deniz,/id="okyanus-vitrini"/);
  assert.match(deniz,/okySalesFirstHomeV1\(\)\.replace\('<\/body>',vitrineLiveHydrationScript\(\)\+'<\/body>'\)/);
  assert.match(deniz,/function vitrineLiveHydrationScript\(\)/);
});

test("homepage product cards use catalog media, price and stock data",()=>{
  const home=extractFunction(deniz,"okySalesFirstHomeV1");
  assert.match(home,/p\.image/);
  assert.match(home,/p\.effectivePrice/);
  assert.match(home,/p\.stockStatus/);
  assert.doesNotMatch(home,/🍟|🫗|🧀|🐟/);
});
