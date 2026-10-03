#!/usr/bin/env python3
"""Extract byte-identical assets and patch a specified DENIZ copy; never edits shared source by default."""
import argparse, base64, hashlib, json, pathlib, re
p=argparse.ArgumentParser();p.add_argument('--input',default='baseline/deniz.mjs');p.add_argument('--output',default='work/deniz-performance.mjs');p.add_argument('--asset-root',default='https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/codex/okyanus-r38-20261002/okyonus-edt-worker/releases/r38/assets/');a=p.parse_args()
s=pathlib.Path(a.input).read_text(); before=len(s.encode())
m=re.search(r'const OKY_EMBEDDED_ASSETS = Object.freeze\((\{[^\n]+\})\);',s);assert m,'Embedded asset map missing'
assets=json.loads(m[1]); manifest={};paths={};folder=pathlib.Path('work/assets');folder.mkdir(parents=True,exist_ok=True)
for path, asset in assets.items():
 data=base64.b64decode(asset['base64'],validate=True); digest=hashlib.sha256(data).hexdigest();ext={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/x-icon':'.ico','image/vnd.microsoft.icon':'.ico'}.get(asset['mime'],pathlib.Path(path).suffix)
 name=digest+ext;out=folder/name;out.write_bytes(data);assert hashlib.sha256(out.read_bytes()).hexdigest()==digest
 paths[path]=a.asset_root+name;manifest[path]={'filename':name,'sha256':digest,'bytes':len(data),'mime':asset['mime'],'url':paths[path]}
s=s[:m.start()]+'const OKY_STATIC_ASSET_URLS = Object.freeze('+json.dumps(paths,separators=(',',':'))+');'+s[m.end():]
start=s.index('const okyEmbeddedDecoded = new Map();');end=s.index('\nexport default {',start)
s=s[:start]+'''// Compatibility URLs redirect to the exact original image bytes stored separately.
function okyEmbeddedAsset(request){
 const path=new URL(request.url).pathname,url=OKY_STATIC_ASSET_URLS[path];
 if(!url){if(path.startsWith('/assets/oky-embedded-r36/'))return new Response('Not found',{status:404});return null;}
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD'}});
 return new Response(null,{status:302,headers:{location:url,'cache-control':'public, max-age=300','x-content-type-options':'nosniff'}});
}
'''+s[end:]
# Replace direct rendered references, preserving local compatibility-map keys.
map_start=s.index('const OKY_STATIC_ASSET_URLS');head=s[:map_start];tail=s[map_start:]
for old,new in paths.items():head=head.replace(old,new)
s=head+tail
s,n=re.subn(r'function originalLogoDataURL\(\)\{.*?\n    \}',lambda _: 'function originalLogoDataURL(){\n      return '+json.dumps(paths['/assets/oky-embedded-r36/d05c8c7ab25ae87e0d9d.png'])+';\n    }',s,count=1,flags=re.S);assert n==1
# SVG image documents cannot reliably load cross-origin nested image references.
# Preserve the legacy PWA icon endpoint by redirecting to the already prepared 512px icon.
start=s.index('          if (path === "/pwa-icon.svg") {')
end=s.index('          if (path === "/sw.js") {',start)
s=s[:start]+'          if (path === "/pwa-icon.svg") {\n            return new Response(null,{status:302,headers:{location:'+json.dumps(paths['/app-icon-512.png'])+',"cache-control":"public, max-age=300"}});\n          }\n'+s[end:]
pathlib.Path(a.output).write_text(s);pathlib.Path('work/assets-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps({'asset_entries':len(assets),'unique_files':len(set(x['filename'] for x in manifest.values())),'original_bytes':before,'patched_bytes':len(s.encode()),'reduction_bytes':before-len(s.encode()),'output':a.output}))
