import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const s=fs.readFileSync(process.argv[2],'utf8'),a=s.indexOf('let productBrandPromise=null'),b=s.indexOf("async function bindProductForm(id='')",a);assert(a>0&&b>a);
const search={value:'Patates'},category={value:'Donuk Ürünler'},nodes={productSearch:search,productCategory:category};let renders=0;
const ctx={productRows:[{id:'p1'}],productPage:3,document:{getElementById:id=>nodes[id]},content:{},productUI:rows=>{ctx.productPage=1;search.value='';category.value='';return 'rows:'+rows.length},bindProductForm:async()=>{},renderProductTable:()=>renders++};vm.createContext(ctx);vm.runInContext(s.slice(a,b),ctx);
ctx.rememberProductView();await ctx.showCachedProductList();assert.equal(search.value,'Patates');assert.equal(category.value,'Donuk Ürünler');assert.equal(ctx.productPage,3);assert.equal(ctx.content.innerHTML,'rows:1');assert.equal(renders,1);search.oninput();assert.equal(ctx.productPage,1);assert.equal(renders,2);
console.log('PASS cached return restores search/category/page; filter interaction resets page');
