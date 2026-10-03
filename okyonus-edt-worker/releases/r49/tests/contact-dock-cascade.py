"""Evaluate relevant rendered stylesheet declarations, not viewport emulation."""
import re
from pathlib import Path
root=Path(__file__).parents[1];source=(root/'deniz.mjs').read_text()
base=re.search(r'function css\(\)\{return `(.*?)`\+okyR47CriticalMobileCSS\(\)\}',source,re.S).group(1)
critical=re.search(r'function okyR47CriticalMobileCSS\(\)\{return `(.*?)`\}',source,re.S).group(1)
mobile=source[source.index('function mobile('):];late=re.search(r'<style>(.*?)</style>',mobile,re.S).group(1)
css=re.sub(r'/\*.*?\*/','',base+critical+late,flags=re.S)
def parse(text,media=()):
 pos=0
 while pos<len(text):
  i=text.find('{',pos)
  if i<0:break
  selector=text[pos:i].strip();depth=1;j=i+1
  while depth:depth+=(text[j]=='{')-(text[j]=='}');j+=1
  body=text[i+1:j-1]
  if selector.startswith('@media'):yield from parse(body,media+(selector,))
  elif not selector.startswith('@'):yield selector,body,media
  pos=j
rules=list(parse(css))
def resolve(width,selectors,property):
 rank=(-1,-1,-1,-1,-1);result=None
 for order,(group,body,media)in enumerate(rules):
  if any(any(width<int(n)for n in re.findall(r'min-width:\s*(\d+)px',m))or any(width>int(n)for n in re.findall(r'max-width:\s*(\d+)px',m))or'prefers-'in m for m in media):continue
  for selector in group.split(','):
   selector=selector.strip()
   if selector not in selectors:continue
   for item in body.split(';'):
    if ':'not in item:continue
    key,value=item.split(':',1)
    if key.strip()!=property:continue
    specificity=(selector.count('#'),selector.count('.')+selector.count('['),len(re.findall(r'(?:^|\s)(?:body|a|svg)\b',selector)))
    score=('!important'in value,*specificity,order)
    if score>=rank:rank=score;result=value.replace('!important','').strip()
 return result
selectors=['.float','body .float','#okyContactDock.float']
for width in [320,390,768,1024,1280]:
 assert resolve(width,selectors,'position')=='fixed'
 assert resolve(width,selectors,'display')=='flex'
 assert resolve(width,selectors,'flex-direction')=='column'
 assert resolve(width,selectors,'z-index')=='125'
 assert resolve(width,selectors,'width')=='48px'
 assert resolve(width,selectors,'margin')=='0'
 expectedRight='10px'if width<=1024 else'18px'
 expectedBottom='calc(14px + env(safe-area-inset-bottom))'if width<=1024 else'24px'
 assert resolve(width,selectors,'right')==expectedRight
 assert resolve(width,selectors,'bottom')==expectedBottom
 assert width-int(expectedRight[:-2])-48>=0
 print('PASS dock fixed cascade',width,'px;48px inside viewport, safe-area bottom')
assert resolve(390,['.cookieBar'],'z-index')=='130'
assert resolve(390,['#floatWhatsapp','#okyContactDock #floatWhatsapp'],'background')=='#25d366'
assert '<div class="float" id="okyContactDock" role="navigation"' in source
assert 'id="floatWhatsapp" target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=905323469925"'in source
display_source=re.sub(r'\\u([0-9a-fA-F]{4})',lambda m:chr(int(m.group(1),16)),source)
assert 'id="floatHelp" href="/yardim"'in source and 'aria-label="Site Yardımı">Y</a>'in display_source
assert '${whatsappIcon()}'in mobile
assert 'function whatsappIcon()'in source and '<svg' in source[source.index('function whatsappIcon()'):source.index('function whatsappIcon()')+250]
print('PASS green WhatsApp SVG, Y native help link, cookie layer130 above dock125')
