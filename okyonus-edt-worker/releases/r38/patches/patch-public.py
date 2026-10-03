from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'work/deniz.mjs')
s=p.read_text()
def scoped(name, pairs):
 global s
 a=s.index('function '+name+'('); b=s.find('\nfunction ',a+1)
 if b<0:b=len(s)
 block=s[a:b]
 for old,new in pairs:
  if old not in block:raise RuntimeError(name+' missing '+old[:100])
  block=block.replace(old,new,1)
 s=s[:a]+block+s[b:]
scoped('commerceCatalogPage',[
 (r'|\u015fark\u00fcteri|sucuk|sosis/',r'|sucuk|sosis/'),
 ("String(p.brand||'')).toLocaleLowerCase", "String(p.brand||'')+' '+String(p.package_text||p.package||p.pack||'')+' '+String(p.sku||'')).toLocaleLowerCase"),
 ("if(filter==='new')list=list.slice().reverse();", "if(filter==='new')list=list.filter(p=>p.new_until&&Date.parse(p.new_until)>Date.now());"),
 ("cq.oninput=render;cc.onchange=render;", "catalogTools.onsubmit=e=>{e.preventDefault();render()};cq.oninput=render;cc.onchange=render;"),
 (r'<b>\u00dcr\u00fcn bulunamad\u0131.</b><p>',r'<b>\u00dcr\u00fcn bulunamad\u0131.</b><p><a href=\"/urunler\">T\u00fcm \u00fcr\u00fcnleri g\u00f6r</a></p><p>'),
 (r".catch(()=>catalogGrid.innerHTML='<div class=\"commerceBox\">Katalog y\u00fcklenemedi.</div>')",r".catch(()=>catalogGrid.innerHTML='<div class=\"commerceBox\">Katalog y\u00fcklenemedi. <a href=\"/urunler\">Tekrar dene</a> veya <a href=\"/iletisim\">sat\u0131\u015f ekibine ula\u015f</a>.</div>')"),
])
scoped('commerceCampaignsPage',[
 (r"u=String(x.cta_url||'/urunler').replace(/[\"'<>]/g,'')",r"raw=String(x.cta_url||'/urunler'),u=(/^\\/(?!\\/)|^https:\\/\\//i.test(raw)?raw:'/urunler').replace(/[\"'<>]/g,'')"),
 (r'Yeni kampanyalar y\u00f6netim panelinden yay\u0131nland\u0131\u011f\u0131nda burada g\u00f6r\u00fcn\u00fcr.',r'G\u00fcncel \u00fcr\u00fcnleri inceleyebilir veya fiyat i\u00e7in teklif isteyebilirsiniz.'),
 (r"isteyebilirsiniz.</span></div>'",r"isteyebilirsiniz.</span><a href=\"/urunler\">\u00dcr\u00fcnleri incele \u2192</a></div>'"),
])
scoped('commerceBrandsPage',[
 (r'Aktif marka kayd\u0131 bulunmuyor.</span>',r'Aktif marka kayd\u0131 bulunmuyor.</span><a href=\"/urunler\">T\u00fcm \u00fcr\u00fcnleri incele \u2192</a>'),
])
scoped('contact',[
 (r'contactForm.onsubmit=async e=>{e.preventDefault();const f=',r'let contactSending=false;contactForm.onsubmit=async e=>{e.preventDefault();if(contactSending)return;const submit=contactForm.querySelector("button[type=submit],button:not([type])");contactSending=true;if(submit)submit.disabled=true;const f='),
 (r'contactResult.textContent=r.ok?',r'contactResult.textContent=r.ok&&j.ok!==false?'),
 (r'contactResult.textContent="Ba\u011flant\u0131 hatas\u0131."}}',r'contactResult.textContent="Ba\u011flant\u0131 hatas\u0131. Bilgileriniz korunuyor; tekrar deneyebilirsiniz."}finally{contactSending=false;if(submit)submit.disabled=false}}'),
])
p.write_text(s)
print('Public flow patch applied:',p)
