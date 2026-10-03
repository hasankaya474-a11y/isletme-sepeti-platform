from pathlib import Path
import sys
HELPER=r'''window.okyStartupJSON=async function(url,kind,allowAnonymous){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(url,{headers:{accept:'application/json'},cache:'no-store',signal:controller.signal});if(allowAnonymous&&r.status===401)return null;if(!r.ok)throw Error(kind+'_HTTP_'+r.status);const j=await r.json();if(!j||j.ok===false)throw Error(kind+'_INVALID_RESPONSE');return j}catch(error){if(controller.signal.aborted)throw Error(kind+'_TIMEOUT');throw error}finally{clearTimeout(timer)}};'''
def apply(s):
 if 'window.okyStartupJSON=async function' in s:return s
 a=s.index('function header(){return `<script>(function(){');b=s.index('})();</script>',a)
 block=s[a:b];start=block.index("fetch('/api/storefront-v2'");end=block.index(".then(function(r)",start)
 fetchText=block[start:end];url=fetchText[len('fetch('):fetchText.rindex(',{headers:')]
 reader="window.okyStorefrontRead=function(forceRefresh){if(forceRefresh)window.__okyStorefrontPromise=null;if(window.__okyStorefrontPromise)return window.__okyStorefrontPromise;const pending=window.okyStartupJSON("+url+",'STOREFRONT',false).catch(function(error){if(window.__okyStorefrontPromise===pending)window.__okyStorefrontPromise=null;throw error});window.__okyStorefrontPromise=pending;return pending}"
 s=s[:a]+"function header(){return `<script>(function(){"+HELPER+reader+s[b:]
 old="window.okyAccountReady=fetch('/api/member/me',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{"
 new="window.okyAccountRead=function(){return window.okyStartupJSON('/api/member/me','MEMBER',true).then(j=>{window.okyAccountError='';"
 assert s.count(old)==1;s=s.replace(old,new)
 old=" }).catch(()=>null);\n document.addEventListener('oky-cart-change'"
 new=" }).catch(error=>{window.okyAccountError=String(error.message||error);return null})};window.okyAccountReady=window.okyAccountRead();window.addEventListener('online',()=>{window.okyAccountReady=window.okyAccountRead()});\n document.addEventListener('oky-cart-change'"
 assert s.count(old)==1;s=s.replace(old,new)
 # Runtime fallback uses same deadline; normal header reader is always preferred.
 old="fetch('/api/storefront-v2',{headers:{accept:'application/json'},cache:'no-store'}).then(function(r){if(!r.ok)throw Error('storefront');return r.json()})"
 assert s.count(old)==2;s=s.replace(old,"window.okyStartupJSON('/api/storefront-v2','STOREFRONT',false)")
 # Surface a distinct timeout reason in homepage rather than implying empty authoritative data.
 old="}).catch(()=>{const box=document.getElementById('commerce-products');if(box)box.innerHTML="
 assert s.count(old)==1;s=s.replace(old,"}).catch(error=>{const box=document.getElementById('commerce-products');if(box)box.dataset.loadError=String(error.message||error);if(box)box.innerHTML=")
 return s
if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
