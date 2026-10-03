from pathlib import Path
import sys

def apply(s):
 def rep(a,b,count=1):
  nonlocal s
  n=s.count(a)
  if n!=count:raise ValueError(f'Anchor {n} expected {count}: {a[:100]}')
  s=s.replace(a,b)
 # Canonical row ID identifies managed variants even when legacy source IDs overlap.
 rep('encodeURIComponent(String(p.source_product_id||p.id))', 'encodeURIComponent(String(p.id||p.source_product_id))')
 rep("encodeURIComponent(id)+'", "encodeURIComponent(String(p.id||id))+'")
 rep('encodeURIComponent(String(x.source_product_id||x.id))', 'encodeURIComponent(String(x.id||x.source_product_id))')
 rep('p=a.find(x=>String(x.id)===target||String(x.source_product_id)===target)||a.find(x=>slug(x.name)===target)', 'p=a.find(x=>String(x.id)===target)||a.find(x=>String(x.source_product_id)===target)||a.find(x=>slug(x.name)===target)')
 # Server-rendered cards lacked an image anchor entirely.
 rep('<div class="img">${img}</div><div class="badges">', '<a class="img" href="/urun/${encodeURIComponent(String(p.id||addId))}" aria-label="${esc(p.name||"Urun")}">${img}</a><div class="badges">')
 # Product names become a second visible tap target, with full text in title.
 rep('<h3>${esc(p.name||"\\u00dcr\\u00fcn")}</h3>', '<h3><a href="/urun/${encodeURIComponent(String(p.id||addId))}" title="${esc(p.name||"Urun")}">${esc(p.name||"\\u00dcr\\u00fcn")}</a></h3>')
 rep("<h3>'+esc(p.name)+'</h3>", "<h3><a href=\\\"/urun/'+encodeURIComponent(String(p.id||id))+'\\\" title=\\\"'+esc(p.name)+'\\\">'+esc(p.name)+'</a></h3>")
 rep("<h3>'+esc(name)+'</h3>", "<h3><a href=\\\"/urun/'+encodeURIComponent(String(p.id||id))+'\\\" title=\\\"'+esc(name)+'\\\">'+esc(name)+'</a></h3>")
 return s

if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()));print('R45 stable internal product image/title links applied')
