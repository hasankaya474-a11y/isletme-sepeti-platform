import importlib.util,re,subprocess,tempfile
from pathlib import Path
root=Path(__file__).parents[1]
spec=importlib.util.spec_from_file_location('startup',root/'patch-startup-css-r47.py');patch=importlib.util.module_from_spec(spec);spec.loader.exec_module(patch)
old=(root.parent/'r45/deniz.mjs').read_text();new=patch.apply(old)
blocks=re.findall(r'<style id="oky-r43-final-mobile">(.*?)</style>',old,re.S)
critical=re.search(r'function okyR47CriticalMobileCSS\(\)\{return `(.*?)`\}',new,re.S).group(1)
assert critical.endswith(blocks[0]) and len(set(blocks))==1
assert '<style id="oky-r43-final-mobile">' not in new
base=re.search(r'function css\(\)\{return `(.*?)`\+okyR47CriticalMobileCSS\(\)\}',new,re.S).group(0)
helper=re.search(r'function okyR47CriticalMobileCSS\(\)\{return `(.*?)`\}',new,re.S).group(0)
script=helper+base+";const head='<head><style>'+css()+'</style></head>';if(!head.includes('R44 compact aligned product cards')||!head.includes('R45 product image taps target'))throw Error('Critical first-paint layout missing');console.log('PASS head critical CSS without init/fetch');"
with tempfile.TemporaryDirectory() as d:
 p=Path(d,'startup.mjs');p.write_text(new);subprocess.run(['node','--check',str(p)],check=True)
 p=Path(d,'head-test.js');p.write_text(script);subprocess.run(['node',str(p)],check=True)
print('PASS existing final CSS byte-preserved, deduplicated from 3 blocks to one helper')
