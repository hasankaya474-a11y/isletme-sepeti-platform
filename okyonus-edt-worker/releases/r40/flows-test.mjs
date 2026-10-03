import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(process.argv[2]||new URL('./deniz.mjs',import.meta.url),'utf8');
const start=source.indexOf('function commerceProductPage('),end=source.indexOf('function commerceBrandsPage(',start);
let script;
const context={html:x=>x,contactStrip:()=>'',commerceClientShell:(title,body,s)=>{script=s;return s}};
vm.runInNewContext(source.slice(start,end)+';commerceProductPage("VARIANT-2")',context);
new vm.Script(script);
assert(script.includes('p=a.find(x=>String(x.id)===target||String(x.source_product_id)===target)||a.find(x=>slug(x.name)===target)'));
const products=[{id:'VARIANT-1',name:'Aynı Ürün',package:'750 ml'},{id:'VARIANT-2',name:'Aynı Ürün',package:'12 kg'}];
const target='VARIANT-2',slug=v=>v.toLowerCase().replace(/ /g,'-');
const selected=products.find(x=>String(x.id)===target||String(x.source_product_id)===target)||products.find(x=>slug(x.name)===target);
assert.equal(selected.package,'12 kg');
assert(script.includes('Array.isArray(saved)?saved:[]'));
assert(script.includes('&quot;'));
assert(!source.includes('encodeURIComponent(slug(p.name))+'));
assert(!source.includes('encodeURIComponent(slug(name))+'));
const nodes = Object.fromEntries(['pdQty','pdPlus','pdMinus','pdAdd'].map(id=>[id,{value:'1',textContent:''}]));
const saved=new Map([['oky-commerce-cart-v2','{}']]);
const browser={pd:{innerHTML:''},rel:{innerHTML:''},Intl,URLSearchParams,location:{search:''},Event:class{},
 document:{title:'',querySelector:()=>null,createElement:()=>({}),head:{appendChild(){}},getElementById:id=>nodes[id],dispatchEvent(){}},
 localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},
 fetch:async url=>new Response(JSON.stringify(url.includes('storefront')?{catalogAuthoritative:true,products:products.map((p,i)=>({...p,brand:'Brand '+(i+1),category:'Test'}))}:{products:[]}))};
vm.runInNewContext(script,browser);
await new Promise(resolve=>setImmediate(resolve));
assert.ok(browser.pd.innerHTML.includes('Brand 2'));
assert.ok(browser.rel.innerHTML.includes('/urun/VARIANT-1'));
nodes.pdAdd.onclick();
assert.equal(JSON.parse(saved.get('oky-commerce-cart-v2'))[0].id,'VARIANT-2');
console.log('PASS: actual detail browser script selects correct variant, adds through corrupt cart; attribute escaping and stable links.');
