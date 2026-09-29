import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {BUYER_NAVIGATION} from "../apps/buyer/src/navigation.mjs";
import {SUPPLIER_NAVIGATION} from "../apps/supplier/src/navigation.mjs";
import {ADMIN_NAVIGATION} from "../apps/admin/src/navigation.mjs";

test("live site assets are local, parseable and responsive",async()=>{
  const [html,css,app]=await Promise.all([
    readFile("site/index.html","utf8"),
    readFile("site/styles.css","utf8"),
    readFile("site/app.js","utf8")
  ]);
  assert.match(html,/name="viewport"/);
  assert.match(html,/\.\/styles\.css/);
  assert.match(html,/\.\/app\.js/);
  assert.doesNotMatch(html,/<iframe/i);
  assert.doesNotMatch(html,/https?:\/\/.*<script/i);
  assert.match(css,/@media\(max-width:900px\)/);
  assert.match(css,/@media\(max-width:620px\)/);
  const checked=spawnSync(process.execPath,["--check","site/app.js"],{encoding:"utf8"});
  assert.equal(checked.status,0,checked.stderr);
  assert.match(app,/Production kilitli/i);
  assert.match(html,/Canlı demo · sandbox veri/);
});

test("buyer supplier and admin navigation are fully represented in live workspace",async()=>{
  const app=await readFile("site/app.js","utf8");
  for(const label of BUYER_NAVIGATION) assert.ok(app.includes('"'+label+'"'),"buyer missing: "+label);
  for(const label of SUPPLIER_NAVIGATION) assert.ok(app.includes('"'+label+'"'),"supplier missing: "+label);
  for(const label of ADMIN_NAVIGATION) assert.ok(app.includes('"'+label+'"'),"admin missing: "+label);
  assert.equal(BUYER_NAVIGATION.length,20);
  assert.equal(SUPPLIER_NAVIGATION.length,19);
  assert.equal(ADMIN_NAVIGATION.length,19);
});

test("critical architecture flows and guardrails are present",async()=>{
  const app=await readFile("site/app.js","utf8");
  for(const term of [
    "RFQ","Teklif","Sepet","Sipariş","Teslimat","Receiving","RMA",
    "3-way match","Ledger","Mutabakat","Reporting","Integration Hub",
    "Security","PRIVATE_PILOT","LEGAL_REVIEW","ACCOUNTING_REVIEW","PRIVACY_REVIEW"
  ]) assert.ok(app.includes(term),"critical live flow missing: "+term);
  assert.match(app,/sessizce seçemez/);
  assert.match(app,/Production LOCKED/);
  assert.match(app,/Evidence ref required/);
});

test("live site exposes interactive demo operations without claiming production mutation",async()=>{
  const app=await readFile("site/app.js","utf8");
  for(const action of ["add-cart","rfq","supplier-quote","approval","invoice-upload","export","release","support"]) {
    assert.ok(app.includes('action==="'+action+'"')||app.includes('"'+action+'":'),"action missing: "+action);
  }
  assert.match(app,/Gerçek API mutasyonu yapılmaz/);
  assert.match(app,/Demo veri dışında gerçek işlem yapılmadı/);
});
