import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const deniz=fs.readFileSync(new URL("../okyonus-edt-worker/src/deniz-worker.js",import.meta.url),"utf8");

function extractFunction(source,name){
  const token="function "+name+"(";
  const start=source.indexOf(token);
  assert.ok(start>=0,"missing "+name);
  const brace=source.indexOf("{",start);
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
    if(c==="/"&&n==="/"){const e=source.indexOf("\n",i);if(e<0)return source.slice(start);i=e;continue}
    if(c==="/"&&n==="*"){const e=source.indexOf("*/",i+2);assert.ok(e>=0);i=e+1;continue}
    if(c==="{")depth++;
    if(c==="}"){depth--;if(depth===0)return source.slice(start,i+1)}
  }
  throw new Error("unterminated "+name);
}

test("new homepage has desktop tablet and mobile layout contracts",()=>{
  const home=extractFunction(deniz,"okySalesFirstHomeV1");
  assert.match(home,/viewport-fit=cover/);
  assert.match(home,/@media\(max-width:1150px\)/);
  assert.match(home,/@media\(max-width:980px\)/);
  assert.match(home,/@media\(max-width:860px\)/);
  assert.match(home,/@media\(max-width:480px\)/);
  assert.match(home,/safe-area-inset-top/);
  assert.match(home,/safe-area-inset-bottom/);
  assert.match(home,/\.photo\{aspect-ratio:4\/3/);
  assert.match(home,/width:min\(460px,94vw\)/);
  assert.match(home,/height:100dvh/);
});

test("mobile storefront keeps selling actions and active module navigation reachable",()=>{
  const home=extractFunction(deniz,"okySalesFirstHomeV1");
  for(const x of ["Ana","Ürün","Fotoğraf","Teklif","Hesabım"]) assert.ok(home.includes(x),x);
  assert.match(home,/class=\\"categoryStrip\\"/);
  assert.match(home,/Deniz Ürünleri/);
  assert.match(home,/Donuk/);
  assert.match(home,/Süt & Şarküteri/);
  assert.match(home,/Dijital Menüyü İncele/);
  assert.match(home,/href=\\"\/yardim\\"/);
  assert.match(home,/min-height:52px;touch-action:manipulation/);
});

test("hidden legacy modules do not leak into the new homepage tabs or vitrine",()=>{
  const home=extractFunction(deniz,"okySalesFirstHomeV1");
  for(const hidden of ["COST Maliyet","COST Radar","Akademi","ÇEŞNİ Yönetimi"]) assert.ok(!home.includes(hidden),hidden);
});

test("homepage vitrine is API-backed and preserves quote drawer flow",()=>{
  const home=extractFunction(deniz,"okySalesFirstHomeV1");
  assert.match(home,/id=\\"featuredProducts\\"/);
  assert.match(home,/id=\\"seaProducts\\"/);
  assert.match(home,/fetch\('\/api\/b2b\/products'/);
  assert.match(home,/fetch\('\/api\/quote'/);
  assert.match(home,/id=\\"cartMobile\\"/);
  assert.match(home,/id=\\"drawer\\"/);
});

test("Digital Menu mobile uses tabs instead of forced vertical stacking",()=>{
  assert.match(deniz,/@media\(max-width:860px\)\{\.dm2-mobile-tabs\{display:grid!important\}/);
  assert.doesNotMatch(deniz,/@media\(max-width:860px\)\{\.dm2-mobile-tabs\{display:none!important\}/);
  assert.match(deniz,/data-mobile-view=\\"edit\\"/);
  assert.match(deniz,/data-mobile-view=\\"preview\\"/);
  assert.match(deniz,/dm2MobileView\('edit',this\)/);
  assert.match(deniz,/dm2MobileView\('preview',this\)/);
});
