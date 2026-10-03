from pathlib import Path
import sys
path=Path(sys.argv[1] if len(sys.argv)>1 else 'work/deniz.mjs')
s=path.read_text()
def replace(old,new,n=1):
 global s
 assert s.count(old)>=n,old[:100]
 s=s.replace(old,new,n)
# Request-size bound must inspect actual bytes, not only untrusted content-length.
start=s.index('    async function memberCommerceQuoteAPI(');end=s.index('    async function quoteAPI(',start)
q=s[start:end]
q=q.replace('body = await request.json();','const raw=await request.text();if(new TextEncoder().encode(raw).byteLength>100000)return responseJSON({ok:false,error:"PAYLOAD_TOO_LARGE"},413);body=JSON.parse(raw);',1)
q=q.replace('const quoteNo=`OKY-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;', '''// cart-idempotency-v1: stable inquiry primary key avoids non-atomic reservation state.
      const idem=String(body.idempotencyKey||request.headers.get('Idempotency-Key')||'').trim();
      if(idem&&!/^[a-zA-Z0-9_-]{16,100}$/.test(idem))return responseJSON({ok:false,error:'INVALID_IDEMPOTENCY_KEY'},400);
      const member=await memberSession(request,env);if(!member)return responseJSON({ok:false,error:'UNAUTHENTICATED'},401);
      const idemHash=idem?await memberSHA(JSON.stringify([member.user_id,member.business_id,idem])):'';
      const quoteNo=idemHash?'OKY-'+idemHash.slice(0,16).toUpperCase():`OKY-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;''',1)
q=q.replace('Math.round(quantity*100)/100','Math.round(quantity*1000)/1000',1)
needle='      const quoteNo=idemHash?'
pos=q.index('      // cart-idempotency-v1')
q=q[:pos]+'''      for(const x of products){const p=knownProducts.get(String(x.id)),n=Number(x.quantity),minimum=Number(p.min_order_qty||.001),step=Number(p.qty_step||.001);if(!Number.isFinite(n)||n<minimum-1e-8||!Number.isFinite(step)||step<=0||Math.abs((n-minimum)/step-Math.round((n-minimum)/step))>1e-6||(p.unit&&allowedUnits.has(p.unit)&&x.unit!==p.unit))return responseJSON({ok:false,error:'INVALID_QUANTITY_UNIT',productId:String(x.id),message:'Ürün miktarını, minimumunu ve birimini kontrol edin.'},400);}
'''+q[pos:]
q=q.replace("message:quoteMessage,consent:true", "message:quoteMessage,consent:true,__quoteInquiryId:idemHash?'quote-v1-'+idemHash:'',__quoteNo:quoteNo",1)
q=q.replace("notification:savedResult.notification},201)","notification:savedResult.notification,duplicate:!!savedResult.duplicate,status:'NEW'},savedResult.duplicate?200:201)",1)
s=s[:start]+q+s[end:]
# Only internal quote requests can use deterministic identities; public contact input cannot.
replace('const now=new Date().toISOString(),id=crypto.randomUUID(),cf=request.cf||{};', '''const quoteId=new URL(request.url).pathname==='/api/quote'&&/^quote-v1-[a-f0-9]{64}$/.test(String(body.__quoteInquiryId||''))?String(body.__quoteInquiryId):'';
      const now=new Date().toISOString(),id=quoteId||crypto.randomUUID(),cf=request.cf||{};
      let duplicate=false;''')
replace('INSERT INTO inquiries (id,source,name,email,phone,company,subject,message,locale,consent_at,consent_version,status,request_ip_hash,user_agent,metadata_json,created_at,updated_at) VALUES', 'INSERT OR IGNORE INTO inquiries (id,source,name,email,phone,company,subject,message,locale,consent_at,consent_version,status,request_ip_hash,user_agent,metadata_json,created_at,updated_at) VALUES')
replace('if(!result||result.success===false)throw new Error("INQUIRIES_INSERT_UNSUCCESSFUL");', '''if(!result||result.success===false)throw new Error("INQUIRIES_INSERT_UNSUCCESSFUL");
        if(quoteId){const row=await env.ADMIN_DB.prepare('SELECT name,email,phone,company,subject,message FROM inquiries WHERE id=?').bind(id).first();if(!row)throw Error('INQUIRY_SAVE_UNVERIFIED');if(row.name!==name||row.email!==email||row.phone!==phone||row.company!==company||row.subject!==subject||row.message!==message)return responseJSON({ok:false,error:'IDEMPOTENCY_CONFLICT',message:'Gönderim bilgileri değişti. Yeni teklif oluşturun.'},409);duplicate=Number(result.meta?.changes||0)===0;}''')
replace('if(env.EMAIL&&typeof env.EMAIL.send==="function"){try{\n        const text=`Okyanus EDT yeni', 'if(!duplicate&&env.EMAIL&&typeof env.EMAIL.send==="function"){try{\n        const text=`Okyanus EDT yeni')
replace('notification},201);\n    }\n\n    /* ==========================================================================\n       OKYANUS EDT DENIZ URUNLERI', 'notification,duplicate},duplicate?200:201);\n    }\n\n    /* ==========================================================================\n       OKYANUS EDT DENIZ URUNLERI')
# Scope browser transformations to commerceCartPage only.
start=s.index('function commerceCartPage(){');end=s.index('function commerceProductPage(',start)
c=s[start:end]
c=c.replace(" const K='oky-commerce-cart-v2';",''' const K='oky-commerce-cart-v2',draftBase='oky-quote-draft-v1';
 const draftKey=()=>{try{return draftBase+':'+(localStorage.getItem('oky-commerce-cart-owner-v1')||'guest')}catch{return draftBase+':guest'}};
 const draftRead=()=>{try{return JSON.parse(localStorage.getItem(draftKey())||localStorage.getItem(draftBase+':guest')||'{}')}catch{return {}}};
 const saveDraft=()=>{try{const d=Object.fromEntries(new FormData(qf));delete d.consent;localStorage.setItem(draftKey(),JSON.stringify(d))}catch{}};
 function restoreDraft(){for(const [key,value]of Object.entries(draftRead())){const field=qf.elements.namedItem(key);if(field&&typeof value==='string')field.value=value}saveDraft();try{if(draftKey()!==draftBase+':guest')localStorage.removeItem(draftBase+':guest')}catch{}}
 qf.addEventListener('input',saveDraft);
 const attemptKey=K+':attempt-v1';
 function attempt(payload){const signature=JSON.stringify(payload);try{const old=JSON.parse(localStorage.getItem(attemptKey)||'null');if(old&&old.signature===signature&&old.key)return old.key;const key=crypto.randomUUID();localStorage.setItem(attemptKey,JSON.stringify({signature,key}));return key}catch{return crypto.randomUUID()}}
''',1)
c=c.replace("qty=(v,x)=>round(Math.min(999,Math.max(minOf(x),Number(v||minOf(x)))))", "qty=(v,x)=>{const min=minOf(x),step=stepOf(x),value=Number(v);const safe=Number.isFinite(value)?value:min;return round(min+Math.max(0,Math.min(Math.floor((999-min)/step),Math.round((safe-min)/step)))*step)}",1)
c=c.replace("old.qty=round(qty(old.qty,old)+qty(x.qty,x))","old.qty=qty(qty(old.qty,old)+qty(x.qty,x),old)",1)
c=c.replace("e.preventDefault();if(window.okyAccountReady)","e.preventDefault();if(sending)return;sending=true;draw();saveDraft();try{if(window.okyAccountReady)",1)
c=c.replace("let session;try{session=await fetch('/api/member/me',{cache:'no-store'}).then(r=>r.json())}catch{}", "let session;try{const response=await fetch('/api/member/me',{cache:'no-store'});if(response.status!==401&&!response.ok)throw Error('SESSION_UNAVAILABLE');session=await response.json()}catch{qr.textContent='Oturum kontrol edilemedi. Sepet ve bilgileriniz korunuyor; tekrar deneyin.';return}",1)
c=c.replace("if(!session?.user){location.href", "if(!session?.user){location.href",1)
c=c.replace("sending=true;draw();qr.textContent=", "payload.idempotencyKey=attempt(payload);draw();qr.textContent=",1)
c=c.replace("if(!r.ok){qr.textContent=", "if(!r.ok||j.ok!==true){qr.textContent=",1)
c=c.replace("const no=j.quoteNo||j.requestNo||j.inquiryNo||j.id||'';write([])","const no=j.quoteNo||j.requestNo||j.inquiryNo||j.id||'';if(!no){qr.textContent='Sunucu kayıt referansı vermedi. Sepetiniz korunuyor; tekrar deneyin.';return}try{localStorage.removeItem(attemptKey);localStorage.removeItem(draftKey())}catch{}write([])",1)
c=c.replace("finally{sending=false;draw()}\n };", "finally{}\n }finally{sending=false;draw()}\n };",1)
# Keep draft/owner bootstrap serialized before reconciliation modifies cart.
c=c.replace("draw();loadCatalog();", "draw();Promise.resolve(window.okyAccountReady).then(()=>{restoreDraft();draw();return loadCatalog()}).catch(()=>{draw();loadCatalog()});",1)
s=s[:start]+c+s[end:]
path.write_text(s)
print('cart-idempotency-v1 patch applied:',path)
