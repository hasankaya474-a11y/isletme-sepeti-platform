from pathlib import Path
import sys

def apply(source):
 s=source
 def rep(a,b,count=1):
  nonlocal s
  n=s.count(a)
  if n!=count: raise ValueError(f'Anchor count {n}, expected {count}: {a[:90]}')
  s=s.replace(a,b)
 # The admin uses OUT, rather than the English prose out of stock.
 rep('inactive|out of stock/i.test(stock)','inactive|out of stock|^OUT$/i.test(stock)',3)
 # A removed price must clear the cart price, not retain yesterday's number.
 rep('p.effectivePrice??p.sale_price??p.price??p.list_price??x.price??null','p.effectivePrice??p.sale_price??p.price??p.list_price??null')
 rep("package_text:String(p.package_text||p.package||x.package_text||'')", "package_text:String(p.package_text??p.package??'')")
 rep("image:String(p.image||x.image||'')", "image:String(p.image??'')")
 rep("[...managed,...(j.catalogAuthoritative?[]:old)].forEach(catalogPut);", "if(j.catalogAuthoritative||managed.length||old.length)catalog=new Map();[...managed,...(j.catalogAuthoritative?[]:old)].forEach(catalogPut);")
 # Reconciled out-of-stock rows cannot be submitted from a previously saved cart.
 rep('async function loadCatalog(){','async function loadCatalog(force=false){')
 rep("function currentItem(x){", "function unavailable(x){return /^OUT$/i.test(String(x.stock_status||''))||/stok yok|out of stock|inactive/i.test(String(x.stock_status||''))}\n function currentItem(x){")
 rep('qSubmit.disabled=sending||!a.length||missing.length>0;', 'qSubmit.disabled=sending||!a.length||missing.length>0||a.some(unavailable);')
 rep("const a=read();if(!a.length){qr.textContent=", "await loadCatalog(true);const a=read();if(a.some(unavailable)){qr.textContent='Stokta olmayan ürünü sepetten kaldırın.';return}if(!a.length){qr.textContent=")
 # Explain blocked state without hiding or deleting the saved cart item.
 rep("if(catalogVerified){reconcile();cartStatus.className=", "if(catalogVerified){const checked=reconcile();if(checked.some(unavailable)){cartStatus.className='cartNotice warn';cartStatus.textContent='Sepetinizde stokta olmayan ürün var. Bu ürünü kaldırıp tekrar deneyin.';draw();return}cartStatus.className=")
 # B2B quote submission checks canonical stock before creating records.
 rep('if(!p||quantity===null) return b2bJson({ok:false,error:"INVALID_ITEM",productId},400);', 'if(!p||quantity===null) return b2bJson({ok:false,error:"INVALID_ITEM",productId},400);if(Number(p.active)===0||/^OUT$/i.test(String(p.stock_status||p.stockStatus||"")))return b2bJson({ok:false,error:"PRODUCT_UNAVAILABLE",productId},400);')
 # Repeating a historical request cannot bypass a newly removed/disabled product.
 repeat_start=s.index('    async function b2bPublicRepeatQuote(')
 repeat_end=s.index('/* ===== OKYANUS COMMERCE',repeat_start)
 part=s[repeat_start:repeat_end]
 target='      const id=crypto.randomUUID(),quoteNo=b2bQuoteNo();'
 inserted='      if(!items.length)return b2bJson({ok:false,error:"EMPTY_QUOTE"},400);\n      const current=new Map((await b2bMergedCatalog(env)).products.map(p=>[String(p.id),p]));\n      for(const x of items){const p=current.get(String(x.product_id));if(!p||Number(p.active)===0||/^OUT$/i.test(String(p.stock_status||p.stockStatus||"")))return b2bJson({ok:false,error:"PRODUCT_UNAVAILABLE",productId:x.product_id},400);const quantity=b2bNum(x.quantity,0.001,100000);if(quantity===null)return b2bJson({ok:false,error:"INVALID_ITEM",productId:x.product_id},400);x.product_name=p.name;x.unit=p.unit||"Kg";x.quantity=quantity;}\n'
 assert part.count(target)==1
 part=part.replace(target,inserted+target)
 s=s[:repeat_start]+part+s[repeat_end:]
 # When the shared reader has been integrated first, cart refresh bypasses its cache.
 start=s.index('async function loadCatalog(force=false){')
 end=s.index(' qf.onsubmit=',start)
 part=s[start:end]
 part=part.replace('window.okyStorefrontRead()', 'window.okyStorefrontRead(force===true)')
 s=s[:start]+part+s[end:]
 return s

if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()));print('R44 stock and cart-price flow patch applied')
