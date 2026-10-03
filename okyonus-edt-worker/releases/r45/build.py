from pathlib import Path
import importlib.util,json,hashlib,sys
sys.dont_write_bytecode=True
root=Path(__file__).resolve().parent

def mod(n,p):
 spec=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def ascii_js(s):
 out=[]
 for c in s:
  n=ord(c)
  if n<128:out.append(c)
  elif n<=65535:out.append(f'\\u{n:04x}')
  else:
   n-=65536;out.append(f'\\u{0xd800+(n>>10):04x}\\u{0xdc00+(n&1023):04x}')
 return ''.join(out)
deniz=(root.parent/'r44/deniz.mjs').read_text();zaman=(root.parent/'r44/zaman.mjs').read_text()
for n in ['detail-speed','product-links','mobile-tap']:deniz=mod(n,root/f'patch-{n}-r45.py').apply(deniz)
zaman=mod('admin-speed',root/'reports/patch-admin-speed-r45.py').apply(zaman)
zaman=mod('image-upload',root/'patch-image-upload-r45.py').apply(zaman)
deniz=deniz.replace('commerce-v2-2026-10-03-r44-cross-audit','commerce-v2-2026-10-03-r45-commerce-flow')
checks={}
for n,s in [('deniz',deniz),('zaman',zaman)]:
 s=ascii_js(s)
 for name in [n+'.mjs',n.upper()+'_R45_TAM_KOD.txt']:
  (root/name).write_text(s,encoding='ascii');checks[name]={'bytes':len(s),'sha256':hashlib.sha256(s.encode()).hexdigest()}
(root/'checksums.json').write_text(json.dumps(checks,indent=2)+'\n');print('R45 full independent Workers built')
