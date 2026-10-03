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
deniz=(root.parent/'r48/deniz.mjs').read_text()
for n in ['contact-dock']:
 deniz=patch(n,root/f'patch-{n}-r49.py',deniz)
zaman=(root.parent/'r48/zaman.mjs').read_text()
checks={}
for n,s in [('deniz',deniz),('zaman',zaman)]:
 s=ascii_js(s)
 if n=='deniz':s=s.replace('commerce-v2-2026-10-03-r48-banner-quote','commerce-v2-2026-10-03-r49-contact-dock')
 for file in [n+'.mjs',n.upper()+'_R49_TAM_KOD.txt']:
  (root/file).write_text(s,encoding='ascii');checks[file]={'bytes':len(s),'sha256':hashlib.sha256(s.encode()).hexdigest()}
(root/'checksums.json').write_text(json.dumps(checks,indent=2)+'\n')
print('R49 independent full Workers built')
