from pathlib import Path
import sys

def apply(source):
 s=source
 def replace(old,new,count=None):
  nonlocal s
  n=s.count(old)
  if not n or count is not None and n!=count:raise RuntimeError(f'Unexpected count {n}: {old[:100]}')
  s=s.replace(old,new)
 replace("encodeURIComponent(slug(p.name))+'", "encodeURIComponent(String(p.source_product_id||p.id))+'",1)
 replace("encodeURIComponent(slug(name))+'", "encodeURIComponent(id)+'",1)
 replace("slug(x.name)+'", "encodeURIComponent(String(x.source_product_id||x.id))+'",1)
 replace("p=a.find(x=>slug(x.name)===target||String(x.id)===target||String(x.source_product_id)===target)","p=a.find(x=>String(x.id)===target||String(x.source_product_id)===target)||a.find(x=>slug(x.name)===target)",1)
 # Recover corrupted local cart state without breaking the product detail add button.
 replace("try{cart=JSON.parse(localStorage.getItem(K)||'[]')}catch{}const id=", "try{const saved=JSON.parse(localStorage.getItem(K)||'[]');cart=Array.isArray(saved)?saved:[]}catch{}const id=",1)
 # Detail values enter both text and attributes. Encode quotes as well as markup.
 start=s.index('function commerceProductPage(');end=s.index('function commerceBrandsPage(',start)
 part=s[start:end]
 old="const esc=v=>String(v??'').replace(/[&<>]/g,'');"
 new="const esc=v=>String(v??'').replace(/[&<>\\\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\\"':'&quot;',\"'\":'&#39;'}[c]));"
 # Encode replacement as JS string content (the page script is a string literal).
 import json
 new=json.dumps("const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));",ensure_ascii=False)[1:-1]
 assert part.count(old)==1
 part=part.replace(old,new)
 s=s[:start]+part+s[end:]
 return s

if __name__=="__main__":
 path=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).with_name("deniz.mjs")
 path.write_text(apply(path.read_text()))
 print("Flow patch applied")
