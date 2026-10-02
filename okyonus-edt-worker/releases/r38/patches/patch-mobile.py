"""Apply scoped mobile accessibility rules; usage: python patch-mobile.py path.mjs."""
from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'work/deniz.mjs')
s=p.read_text()
marker='/* R35: hero -> eight categories -> products on mobile and tablet. */'
start=s.index(marker)
end=s.index('\n`}\n',start)
block=s[start:end].replace(marker,'/* MOBILE FINAL: preserve vitrine, eight categories, three product columns. */')
block += '''
/* Reserve layout space and keep navigation usable without altering data or cart flow. */
.hero .heroMedia img{display:block;width:100%;height:100%}
.homeCategories .cat img{display:block;aspect-ratio:2/1}
.homeReturn{min-height:44px;align-items:center}
@media(max-width:1024px){
 html{scroll-padding-top:76px}
 .head{position:sticky;top:0;z-index:150;background:#fff}
 .mobileTop{grid-template-columns:44px 44px minmax(0,1fr) 44px 48px 44px;gap:2px;padding:7px 4px;min-height:62px}
 .mobileTopIcon{display:flex;align-items:center;justify-content:center;min-height:44px}
 .mobileTop summary.mobileTopIcon{list-style:none}
 .mobileTop summary.mobileTopIcon::-webkit-details-marker{display:none}
 .mobileBrand{min-width:0;min-height:44px}
 .mobileBrand span{min-width:0}
 .mobileDrawer,.mobileSearchPanel{top:100%;max-width:calc(100vw - 8px);max-height:calc(100dvh - 140px);overflow:auto;overscroll-behavior:contain}
 .mobileDrawer a{display:flex;align-items:center;min-height:44px}
 .homeCategories .cat{touch-action:manipulation}
 .products,.seafoodProducts,.commerceGrid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
 .product button,.mobileTopIcon,.homeReturn{touch-action:manipulation}
 .product .qty button,.product .qty input{height:44px!important}
 .product .fav{width:44px;height:44px;display:grid;place-items:center}
 .hero .dots button{position:relative}
 .hero .dots button:before{content:"";position:absolute;inset:-12px -6px}
 .hero .heroArrow{min-width:44px;min-height:44px}
 .homeCategories,.homeBest{scroll-margin-top:76px}
}
@media(max-width:420px){
 .mobileTop{padding:6px 3px;min-height:58px}
 .mobileBrand img{width:32px;height:32px}
 .mobileBrand{gap:2px;font-size:14px}
 .mobileDrawer,.mobileSearchPanel{top:100%}
}
'''
s=s[:start]+block+s[end:]
p.write_text(s)
print('Mobile final CSS applied:',p)
