"""Keep the semantic quote-price action usable inside compact product cards."""
import re
from pathlib import Path
import sys
CSS='''
/* R48 accessible quote-price target; keep pricing height flexible. */
.quotePriceButton{display:flex;align-items:center;justify-content:center;width:100%;max-width:100%;min-width:0;min-height:44px;height:auto;box-sizing:border-box;padding:4px 2px;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;font-weight:800;line-height:1.2;white-space:normal;overflow-wrap:anywhere;cursor:pointer;touch-action:manipulation}
.quotePriceButton:focus-visible{outline:2px solid #0879bb;outline-offset:2px}
.product .price:has(.quotePriceButton){height:auto!important;min-height:50px!important}
.product .price strong:has(.quotePriceButton){display:block;min-width:0;width:100%}
'''
def apply(source):
    if 'R48 accessible quote-price target' in source:raise ValueError('R48 quote CSS already added')
    pattern=r'(function okyR47CriticalMobileCSS\(\)\{return `)(.*?)(`\})'
    if len(re.findall(pattern,source,re.S))!=1:raise ValueError('Expected R47 critical layout helper')
    return re.sub(pattern,lambda m:m.group(1)+m.group(2)+CSS.replace('\n',' ')+m.group(3),source,count=1,flags=re.S)
if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
