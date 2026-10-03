from pathlib import Path
import importlib.util,hashlib,json,sys
sys.dont_write_bytecode=True
root=Path(__file__).resolve().parent

def mod(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def ascii_js(s):
 out=[]
 for c in s:
  n=ord(c)
  if n<128:out.append(c)
  elif n<=65535:out.append(f'\\u{n:04x}')
  else:
   n-=65536;out.append(f'\\u{0xd800+(n>>10):04x}\\u{0xdc00+(n&1023):04x}')
 return ''.join(out)
deniz=(root.parent/'r43/deniz.mjs').read_text()
zaman=(root.parent/'r41/zaman.mjs').read_text()
for name in ['product-image','performance','flows','mobile','branding']:
 deniz=mod(name,root/f'patch-{name}-r44.py').apply(deniz)
security=mod('security',root/'patch-security-r44.py')
deniz=security.apply(deniz)
zaman=security.apply(zaman,admin=True)
admin=mod('admin',root/'reports/patch-admin-r44.py')
zaman=admin.apply(zaman)
media=mod('media',root/'reports/patch-media-r44.py')
deniz=media.apply_deniz(deniz)
zaman=media.apply_zaman(zaman)
assetcache=mod('assetcache',root/'reports/patch-public-media-cache-r44.py')
deniz=assetcache.apply(deniz)
zaman=assetcache.apply(zaman)
deniz=deniz.replace('commerce-v2-2026-10-03-r43-compact-stepper','commerce-v2-2026-10-03-r44-cross-audit')
checks={}
for name,s in [('deniz',deniz),('zaman',zaman)]:
 s=ascii_js(s)
 for file in [name+'.mjs',name.upper()+'_R44_TAM_KOD.txt']:
  (root/file).write_text(s,encoding='ascii');checks[file]={'bytes':len(s),'sha256':hashlib.sha256(s.encode()).hexdigest()}
(root/'checksums.json').write_text(json.dumps(checks,indent=2)+'\n')
print('R44 full separate Workers built')
