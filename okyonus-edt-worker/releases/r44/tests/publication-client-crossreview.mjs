import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const src=fs.readFileSync(process.argv[2],'utf8'),a=src.indexOf('async function verifyPublication(){'),b=src.indexOf('\nfunction productUI',a);assert(a>0&&b>a);
for(const scenario of [{result:{match:true,publishedCount:7},green:true,contains:'7'},{result:{match:false,selectedCount:7,publishedCount:6,error:'PUBLIC_STOREFRONT_VALUES_DIFFER'},green:false,contains:'PUBLIC_STOREFRONT_VALUES_DIFFER'},{error:new Error('network unavailable'),green:false,contains:'network unavailable'}]){
 const button={disabled:false},status={style:{},textContent:''};const ctx={document:{getElementById:id=>id==='verifyPublicationButton'?button:status},api:async()=>{if(scenario.error)throw scenario.error;return scenario.result}};
 vm.createContext(ctx);vm.runInContext(src.slice(a,b),ctx);await ctx.verifyPublication();assert.equal(button.disabled,false);assert.equal(status.style.color,scenario.green?'#08613e':'#a12323');assert(status.textContent.includes(scenario.contains));
}
console.log('Publication UI: verified, mismatch, network-error cases pass and button re-enabled');
