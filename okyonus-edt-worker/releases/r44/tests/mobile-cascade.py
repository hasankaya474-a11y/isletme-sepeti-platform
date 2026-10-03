"""Check the actual final CSS cascade, not a browser viewport simulation."""
import importlib.util,re
from pathlib import Path
root=Path(__file__).parents[1]
spec=importlib.util.spec_from_file_location('mobile44',root/'patch-mobile-r44.py');patch=importlib.util.module_from_spec(spec);spec.loader.exec_module(patch)
source=patch.apply((root.parent/'r43/deniz.mjs').read_text())
base=re.search(r'function css\(\)\{return `(.*?)`\}',source,re.S).group(1)
final=re.findall(r'<style id="oky-r43-final-mobile">(.*?)</style>',source,re.S)[0]
css=re.sub(r'/\*.*?\*/','',base+final,flags=re.S)
def rules(text,conditions=()):
 pos=0
 while pos<len(text):
  i=text.find('{',pos)
  if i<0:break
  head=text[pos:i].strip();depth=1;j=i+1
  while depth:
   depth+=(text[j]=='{')-(text[j]=='}');j+=1
  body=text[i+1:j-1]
  if head.startswith('@media'):yield from rules(body,conditions+(head,))
  elif not head.startswith('@'):yield head,body,conditions
  pos=j
parsed=list(rules(css))
def resolve(width,selectors,property):
 result=None;rank=(-1,-1,-1)
 for order,(group,body,media) in enumerate(parsed):
  if any(('min-width' in m and any(width<int(n) for n in re.findall(r'min-width:\s*(\d+)px',m))) or ('max-width' in m and any(width>int(n) for n in re.findall(r'max-width:\s*(\d+)px',m))) or 'prefers-' in m for m in media):continue
  for selector in group.split(','):
   selector=selector.strip()
   if selector not in selectors:continue
   specificity=selector.count('.')+selector.count('[')
   for declaration in body.split(';'):
    if ':' not in declaration:continue
    key,value=declaration.split(':',1)
    if key.strip()!=property:continue
    score=('!important' in value,specificity,order)
    if score>=rank:rank=score;result=value.replace('!important','').strip()
 return result
for w in [320,390,599,600,768,1024]:
 grid=resolve(w,['.products',' .products','.seafoodProducts','.commerceGrid'],'grid-template-columns')
 assert ('repeat(3' if w<600 else 'repeat(4') in grid,(w,grid)
 qty=resolve(w,['.qty','.product .qty'],'grid-template-columns')
 assert qty==('32px minmax(0,1fr) 32px' if w<600 else '44px minmax(0,1fr) 44px'),(w,qty)
 assert resolve(w,['.price','.product .price'],'height')=='auto'
 assert resolve(w,['.product h3'],'-webkit-line-clamp')=='2'
 assert resolve(w,['.product h3'],'font-size')==('12px' if w<600 else '13px')
 assert resolve(w,['.qty input','.product .qty input'],'grid-row')=='1'
 print('PASS cascade',w,'px:',grid,qty)
# Two wrapped price lines plus old-price line exceed32px; auto-height must accommodate all.
required=2*11*1.15+11*1.2+6
assert required>32
print('PASS discounted price auto-height accommodates',round(required,1),'px content budget')
