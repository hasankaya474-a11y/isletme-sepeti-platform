const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(process.argv[2],'utf8'),a=s.indexOf(" const popup=document.getElementById('campaignPopup')"),b=s.indexOf('\n})();`}',a);assert(a>0&&b>a);
assert(s.includes('class="campaignAccess" id="campaignOpen" hidden style="position:static;'));assert(!s.includes('class="cookieSettings" id="campaignOpen"'));
for(const [enabled,path] of [['true','/'],['false','/'],['true','/urunler']]){
 let opens=0;const handlers={},popup={dataset:{enabled},open:false,showModal(){opens++;this.open=true},close(){this.open=false},addEventListener:(k,f)=>handlers[k]=f},close={},button={hidden:true};
 const ctx={document:{getElementById:id=>({campaignPopup:popup,campaignClose:close,campaignOpen:button}[id])},location:{pathname:path}};vm.createContext(ctx);vm.runInContext(s.slice(a,b),ctx);
 assert.equal(opens,0,'startup must not block content');const available=enabled==='true'&&path==='/';assert.equal(button.hidden,!available);
 button.onclick();assert.equal(opens,available?1:0);button.onclick();assert.equal(opens,available?1:0,'no duplicate showModal');close.onclick();assert.equal(popup.open,false);assert.equal(opens,available?1:0,'closing must not reopen');if(available){button.onclick();assert.equal(opens,2,'explicit reopen remains available')}
}
console.log('PASS startup never auto-opens; enabled-home explicit open/close/reopen; disabled/nonhome remain hidden');
