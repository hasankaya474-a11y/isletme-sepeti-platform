import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("merged live site contains all four surfaces and production lock",async()=>{
  const html=await readFile("site/index.html","utf8");
  for(const surface of ["public","buyer","supplier","admin"]){
    assert.match(html,new RegExp('data-surface="'+surface+'"'));
  }
  assert.match(html,/Production kilitli/i);
  assert.match(html,/Canlı görünüm · demo veri/);
});

test("merged live site navigation matches source contracts",async()=>{
  const html=await readFile("site/index.html","utf8");
  const buyer=await readFile("apps/buyer/src/navigation.mjs","utf8");
  const supplier=await readFile("apps/supplier/src/navigation.mjs","utf8");
  const admin=await readFile("apps/admin/src/navigation.mjs","utf8");
  for(const label of ["Tekrar Sipariş","Satın Alma Listelerim","Kullanıcı & Yetki","İşletme Ayarları"]) assert.ok(html.includes(label)&&buyer.includes(label));
  for(const label of ["Teklif Talepleri","Fiyat Merkezi","Stok Merkezi","Cari Bilgileri","Personel & Yetki"]) assert.ok(html.includes(label)&&supplier.includes(label));
  for(const label of ["Yardım & Site Kılavuzu","Sözleşmeler","Güvenlik & KVKK","Engine Room"]) assert.ok(html.includes(label)&&admin.includes(label));
});

test("merged live site has mobile contract and no external executable scripts",async()=>{
  const html=await readFile("site/index.html","utf8");
  assert.match(html,/@media\(max-width:760px\)/);
  assert.match(html,/name="viewport"/);
  assert.doesNotMatch(html,/<script[^>]+src=/i);
  assert.doesNotMatch(html,/<iframe/i);
});
