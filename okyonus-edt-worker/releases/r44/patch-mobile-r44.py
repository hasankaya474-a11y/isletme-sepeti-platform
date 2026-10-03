"""Append compact card rules to all R43 final styles without touching Worker files."""
import re
from pathlib import Path
import sys

CSS = r"""
/* R44 compact aligned product cards; phone 3 and tablet 4. */
@media(max-width:1024px){
 .products .product,.seafoodProducts .product,.commerceGrid .product{align-self:stretch!important;min-width:0!important}
 .product .img{height:88px!important;min-height:88px!important;max-height:88px!important;aspect-ratio:auto!important;flex:none!important}
 .product .img img{height:100%!important;width:100%!important;object-fit:contain!important;padding:2px!important}
 .product h3{display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;height:28.8px!important;min-height:28.8px!important;font-size:12px!important;line-height:1.2!important;margin:4px 0 3px!important}
 .product .meta{height:24px!important;min-height:24px!important;font-size:10px!important;line-height:1.2!important;overflow:hidden!important;margin:0!important}
 .product .desc,.product .stock{display:none!important}
 .product .price{height:auto!important;min-height:32px!important;grid-template-columns:minmax(0,1fr)!important;align-items:center!important;margin-top:4px!important;padding:3px 4px!important}
 .product .priceLabel{display:none!important}
 .product .price strong{font-size:11px!important;line-height:1.15!important;overflow-wrap:anywhere!important}
 .product .price strong.ask{font-size:10px!important;line-height:1.15!important}
 .product .qty{margin-top:auto!important;padding-top:4px!important}
 .product .add{height:44px!important;min-height:44px!important;margin-top:4px!important;font-size:11px!important}
}
@media(max-width:599px){
 .products,.seafoodProducts,.commerceGrid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important}
 .product .qty{grid-template-columns:32px minmax(0,1fr) 32px!important;gap:2px!important}
 .product .qty input{grid-column:2!important;grid-row:1!important;min-width:0!important;min-height:44px!important;height:44px!important}
 .product .qty button{grid-row:1!important;width:32px!important;min-width:32px!important;height:44px!important}
 .product .qty button[data-minus]{grid-column:1!important}
 .product .qty button[data-plus]{grid-column:3!important}
}
@media(min-width:600px) and (max-width:1024px){
 .products,.seafoodProducts,.commerceGrid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
 .product .img{height:116px!important;min-height:116px!important;max-height:116px!important}
 .product h3{font-size:13px!important;height:31.2px!important;min-height:31.2px!important}
 .product .qty{grid-template-columns:44px minmax(0,1fr) 44px!important}
 .product .qty input{grid-column:2!important;grid-row:1!important}
 .product .qty button{grid-row:1!important}
}
"""

def apply(source):
    pattern = r'(<style id="oky-r43-final-mobile">.*?)(</style>)'
    matches = re.findall(pattern, source, re.S)
    if len(matches) != 3:
        raise ValueError(f'Expected 3 R43 final style blocks, found {len(matches)}')
    if 'R44 compact aligned product cards' in source:
        raise ValueError('R44 mobile patch already present')
    return re.sub(pattern, lambda m: m.group(1) + CSS.replace("\n", " ") + m.group(2), source, flags=re.S)

if __name__ == '__main__':
    path = Path(sys.argv[1])
    path.write_text(apply(path.read_text()))
