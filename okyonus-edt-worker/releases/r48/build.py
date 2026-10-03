from pathlib import Path
import importlib.util,hashlib,json,sys
sys.dont_write_bytecode=True
root=Path(__file__).resolve().parent
def patch(name,path,s):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m.apply(s)
def ascii_js(s):
 out=[]
 for c in s:
  n=ord(c)
  if n<128:out.append(c)
  elif n<=65535:out.append(f'\\u{n:04x}')
  else:
   n-=65536;out.append(f'\\u{0xd800+(n>>10):04x}\\u{0xdc00+(n&1023):04x}')
 return ''.join(out)
deniz=(root.parent/'r47/deniz.mjs').read_text()
for n in ['popup','quote-action','quote-price-css']:
 deniz=patch(n,root/f'patch-{n}-r48.py',deniz)
zaman=patch('admin-opening',root/'reports/patch-admin-opening-r48.py',(root.parent/'r47/zaman.mjs').read_text())
checks={}
for n,s in [('deniz',deniz),('zaman',zaman)]:
 s=ascii_js(s).replace('commerce-v2-2026-10-03-r47-startup-performance','commerce-v2-2026-10-03-r48-banner-quote')
 for file in [n+'.mjs',n.upper()+'_R48_TAM_KOD.txt']:
  (root/file).write_text(s,encoding='ascii');checks[file]={'bytes':len(s),'sha256':hashlib.sha256(s.encode()).hexdigest()}
(root/'checksums.json').write_text(json.dumps(checks,indent=2)+'\n')
print('R48 independent full Workers built')
