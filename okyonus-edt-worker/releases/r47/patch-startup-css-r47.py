"""Make existing final mobile styles available in the head, before any card paint."""
import re
from pathlib import Path
import sys

def apply(source):
    pattern=r'<style id="oky-r43-final-mobile">(.*?)</style>'
    blocks=re.findall(pattern,source,re.S)
    if len(blocks)!=3 or len(set(blocks))!=1:
        raise ValueError('Expected three identical R45 final style blocks')
    css_match=re.search(r'function css\(\)\{return `(.*?)`\}',source,re.S)
    if not css_match:
        raise ValueError('Shared head CSS function missing')
    # Raw block is static CSS, not user content. Preserve every declaration/order.
    critical=blocks[0]
    if '`' in critical or '${' in critical:
        raise ValueError('Unexpected template content in critical CSS')
    function='function okyR47CriticalMobileCSS(){return `/* R47 critical mobile layout before first paint. */'+critical+'`}\n'
    source=source[:css_match.start()]+function+source[css_match.start():]
    old='function css(){return `'+css_match.group(1)+'`}'
    new='function css(){return `'+css_match.group(1)+'`+okyR47CriticalMobileCSS()}'
    if source.count(old)!=1:raise ValueError('CSS return anchor changed')
    source=source.replace(old,new,1)
    source=re.sub(pattern,'',source,flags=re.S)
    return source

if __name__=='__main__':
    p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
