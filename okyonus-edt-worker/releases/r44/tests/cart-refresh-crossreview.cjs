const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(process.argv[2],'utf8');let script;
const a=s.indexOf('function commerceCartPage(){'),b=s.indexOf('function commerceProductPage(',a);
vm.runInNewContext(s.slice(a,b)+';commerceCartPage()',{html:x=>x,contactStrip:()=>'',commerceClientShell:(t,b,x)=>script=x});
const current=script.slice(script.indexOf('function unavailable('),script.indexOf('function draw(){'));
const loader=script.slice(script.indexOf('async function loadCatalog('),script.indexOf('qf.onsubmit='));
(async()=>{
let stored=[{id:'A',name:'Old product',price:200}],calls=[],response={catalogAuthoritative:true,products:[{id:'A',name:'Current product',effectivePrice:100,stock_status:'AVAILABLE'}]};
const ctx={catalog:new Map(),catalogLoaded:false,catalogVerified:false,window:{okyStorefrontRead:async force=>{calls.push(force);return response}},read:()=>stored,write:a=>stored=a,legacy:x=>x,draw:()=>{},cartStatus:{},catalogPut:p=>ctx.catalog.set(String(p.id),p)};
vm.createContext(ctx);vm.runInContext(current+loader,ctx);
await ctx.loadCatalog();assert.equal(stored[0].price,100);
response={catalogAuthoritative:true,products:[{id:'A',name:'Changed',effectivePrice:null,stock_status:'OUT'}]};await ctx.loadCatalog(true);assert.equal(stored[0].price,null);assert(ctx.unavailable(stored[0]));assert.equal(calls.at(-1),true);
response={catalogAuthoritative:true,products:[]};await ctx.loadCatalog(true);assert.equal(ctx.catalog.size,0);assert.equal(stored[0].missing,true);assert.equal(stored.length,1,'removed product remains in saved cart for user action');
console.log('PASS refresh sees changed admin price/OUT, forced read, then removed product missing without deleting saved cart');
})().catch(e=>{console.error(e);process.exit(1)});
