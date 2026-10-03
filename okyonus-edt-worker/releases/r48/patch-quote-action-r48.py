from pathlib import Path
import sys,json

def apply(s):
 old="<strong>'+money(price)+'</strong>"
 assert s.count(old)==3,s.count(old)
 new="'+(price!=null&&price!==''&&Number.isFinite(Number(price))&&Number(price)>0?'<strong>'+money(price)+'</strong>':'<button type=\\\"button\\\" class=\\\"quotePriceButton\\\" data-quote-price>Fiyat için teklif al</button>')+'"
 s=s.replace(old,new)
 # Separate semantic action, never data-add: no duplicate bubbling into primary add.
 runtime="""<script>(function(){document.addEventListener('click',async function(event){var action=event.target.closest&&event.target.closest('[data-quote-price]');if(!action||action.disabled)return;event.preventDefault();event.stopPropagation();var card=action.closest('.product'),detail=action.closest('.detail'),add=card?card.querySelector('[data-add]'):detail?document.getElementById('pdAdd'):null;if(!add)return;action.disabled=true;var added=false,watch=function(){added=true};try{if(window.okyAccountError&&window.okyAccountRead)window.okyAccountReady=window.okyAccountRead();if(window.okyAccountReady)await window.okyAccountReady;if(window.okyAccountError)throw Error('Oturum kontrol edilemedi. Tekrar deneyin.');document.addEventListener('oky-cart-change',watch);add.click();document.removeEventListener('oky-cart-change',watch);if(added){location.href='/sepet';return}action.textContent=add.textContent||'Ürün eklenemedi';}catch(error){action.textContent='Tekrar dene';action.title=error.message||'Ürün eklenemedi';}finally{document.removeEventListener('oky-cart-change',watch);action.disabled=false}})})();</script>"""
 marker='function header(){return `'
 assert s.count(marker)==1
 s=s.replace(marker,marker+runtime,1)
 return s

if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()));print('R48 interactive missing-price quote action applied')
