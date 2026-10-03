from pathlib import Path
import sys

def apply(source):
 s=source
 def replace(old,new):
  nonlocal s
  assert s.count(old)==1,(old[:80],s.count(old))
  s=s.replace(old,new)
 replace(r'Mevcut foto\u011frafla teklif motoru korunur.',r'Ekibimiz listenizdeki \u00fcr\u00fcnler i\u00e7in size teklif haz\u0131rlas\u0131n.')
 replace(r'<h2>Y\u00f6netilen Vitrin</h2>',r'<h2>\u0130\u015fletmenize \u00d6zel Se\u00e7kiler</h2>')
 replace('${esc(DEFAULT_SETTINGS.announcement)}</div><header','${esc(DEFAULT_SETTINGS.announcement)}<span id="okyServiceStatus" role="status" aria-live="polite" style="display:inline-block;margin-left:12px;font-size:12px">Site bağlantısı kontrol ediliyor…</span></div><header')
 replace('function runtimeSettingsScript(){return `<script>(function(){','function runtimeSettingsScript(){return serviceStatusScript()+`<script>(function(){')
 replace(' if((m==="GET"||m==="HEAD")&&p==="/iletisim")return html(contact());',' if((m==="GET"||m==="HEAD")&&(p==="/hakkimizda"||p==="/about"))return html(commerceAboutPage());\n if((m==="GET"||m==="HEAD")&&p==="/iletisim")return html(contact());')
 s+='''
 function serviceStatusScript(){return `<script>(function(){var e=document.getElementById('okyServiceStatus');if(!e)return;var busy=false;async function check(){if(busy)return;if(!navigator.onLine){e.textContent='İnternet bağlantısı yok';return}busy=true;var c=new AbortController(),t=setTimeout(function(){c.abort()},8000);try{var r=await fetch('/api/health',{cache:'no-store',headers:{accept:'application/json'},signal:c.signal}),j=await r.json();if(!r.ok||j.ok!==true)throw Error('health');e.textContent='Site çevrimiçi · Kontrol '+new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});e.title='Site sunucusuna bağlantı doğrulandı. Bu gösterge satış ekibinin çevrimiçi olduğunu belirtmez.'}catch(_){e.textContent=navigator.onLine?'Site bağlantısı doğrulanamadı':'İnternet bağlantısı yok'}finally{clearTimeout(t);busy=false}}check();addEventListener('online',check);addEventListener('offline',function(){e.textContent='İnternet bağlantısı yok'});document.addEventListener('visibilitychange',function(){if(!document.hidden)check()});setInterval(function(){if(!document.hidden)check()},60000)})();</script>`}
 function commerceAboutPage(){return commerceClientShell('Hakkımızda | Okyanus EDT','<main class="wrap"><section class="page"><a href="/">← Ana Sayfa</a><h1>Okyanus EDT Hakkında</h1><p>Restoran, kafe, otel, catering ve profesyonel mutfakların ürün ve teklif ihtiyaçları için çalışıyoruz.</p><h2>Ürün seçimi ve teklif</h2><p>Deniz ürünleri, donuk ürünler, et ve şarküteri, süt ürünleri, yağlar, soslar, kuru gıda ve baharat kategorilerinden ihtiyacınızı seçebilir; miktarları teklif listenizde bir araya getirebilirsiniz. Hazır alış listenizi fotoğrafla da gönderebilirsiniz.</p><h2>Açık iletişim</h2><p>Ürün, fiyat, stok ve teslimat bilgilerini teklif aşamasında satış ekibimizle doğrulayabilirsiniz. Hasan Kaya ve Orhan Güngör ile iletişim sayfamızdaki telefon, e-posta ve WhatsApp bağlantılarından görüşebilirsiniz.</p><h2>Dijital Menü</h2><p>İşletmenizin menüsünü düzenlemek için Dijital Menü alanını kullanabilirsiniz.</p><p><a class="btn" href="/urunler">Ürün Seç • Teklif Al</a> <a class="btn" href="/fotografla-teklif">Listeni Fotoğrafla Gönder</a> <a class="btn" href="/iletisim">Bize Ulaşın</a></p><p><a href="/kvkk">KVKK</a> · <a href="/gizlilik">Gizlilik</a> · <a href="/yardim">Site Yardım</a></p></section></main>','')}
 '''
 return s

if __name__ == "__main__":
 p=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).with_name("deniz.mjs")
 p.write_text(apply(p.read_text()))
 print("Branding patch applied:",p)
