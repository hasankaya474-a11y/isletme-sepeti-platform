import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const deniz=fs.readFileSync(new URL("../okyonus-edt-worker/src/deniz-worker.js",import.meta.url),"utf8");

function between(a,b){
  const i=deniz.indexOf(a); assert.ok(i>=0,"missing "+a);
  const j=deniz.indexOf(b,i+a.length); assert.ok(j>i,"missing end "+b);
  return deniz.slice(i,j);
}

test("new sales shell covers tablet and mobile responsive bands",()=>{
  const css=between("function okySalesCss(){","function okySalesFirstHomeV1(){");
  for(const bp of ["max-width:1100px","max-width:900px","max-width:640px","max-width:430px","max-width:360px"]) assert.ok(css.includes(bp),bp);
  assert.match(css,/\.okyMobileTabs\{display:none\}/);
  assert.match(css,/\.okyApp aside\{display:none\}/);
  assert.match(css,/\.okyProducts\{grid-template-columns:1fr 1fr\}/);
  assert.match(css,/\.okyHelp\{grid-template-columns:1fr\}/);
});

test("mobile topbar restores navigation when sidebar collapses",()=>{
  const top=between("function okySalesTopbar(){","function okySalesNav(){");
  for(const label of ["Tüm Ürünler","Deniz","Donuk","Yağ","Fotoğraf","Dijital Menü","Yardım"]) assert.ok(top.includes(label),label);
  assert.match(top,/name="q"/);
  assert.match(top,/Teklif Listem/);
  assert.match(top,/href="\/uye"/);
});

test("sales navigation exposes active modules only",()=>{
  const nav=between("function okySalesNav(){","function okySalesCss(){");
  for(const active of ["Ana Sayfa","Tüm Ürünler","Deniz Ürünleri","Donuk Ürünler","Yağlar","Süt & Şarküteri","Fotoğrafla Gönder","Dijital Menü","Yardım"]) assert.ok(nav.includes(active),active);
  assert.doesNotMatch(nav,/COST|Akademi|ÇEŞNİ|Kolay Reçete/);
});

test("homepage product showcase uses real product image field and existing catalog flow",()=>{
  const home=between("function okySalesFirstHomeV1(){","export default");
  assert.match(home,/p\.image_url\|\|p\.imageUrl/);
  assert.match(home,/loading="lazy"/);
  assert.doesNotMatch(home,/preview:true,productId/);
  assert.match(home,/location\.href='\/urunler'/);
});

test("member quick navigation no longer advertises hidden modules",()=>{
  assert.match(deniz,/aria-label="Üye paneli aktif modülleri"/);
  const q=deniz.indexOf('aria-label="Üye paneli aktif modülleri"');
  const nav=deniz.slice(q-100,q+600);
  assert.match(nav,/\/urunler/);
  assert.match(nav,/\/fotografla-teklif/);
  assert.match(nav,/\/dijital-menu/);
  assert.doesNotMatch(nav,/\/cost|\/akademi|\/cesni|\/kolay-recete/);
});

test("Digital Menu editor retains dedicated mobile edit-preview tabs",()=>{
  assert.match(deniz,/dm2-mobile-tabs/);
  assert.match(deniz,/data-mobile-view="edit"/);
  assert.match(deniz,/Canlı Önizle/);
});
