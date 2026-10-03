"""Apply r40 mobile fixes; fail if expected r38 anchors changed."""
from pathlib import Path
import sys

def apply(source):
    changes = [
        ('<section id="seafood-showcase" class="section homeSeafood">', '<section id="seafood-showcase" class="section homeSeafood" hidden>'),
        ('<section class="section homeNew">', '<section class="section homeNew" hidden>'),
        ("if(seafood)seafood.innerHTML=featured.filter(x=>String(x.category||'').toLocaleLowerCase('tr-TR').includes('deniz')).map(htmlCard).join('');", "if(seafood){seafood.innerHTML=featured.filter(x=>String(x.category||'').toLocaleLowerCase('tr-TR').includes('deniz')).map(htmlCard).join('');seafood.closest('section').hidden=!seafood.querySelector('.product')}"),
        ("if(commerceNew)commerceNew.innerHTML=featured.filter(x=>x.new_until&&Date.parse(x.new_until)>Date.now()).map(htmlCard).join('');", "if(commerceNew){commerceNew.innerHTML=featured.filter(x=>x.new_until&&Date.parse(x.new_until)>Date.now()).map(htmlCard).join('');commerceNew.closest('section').hidden=!commerceNew.querySelector('.product')}"),
    ]
    for old, new in changes:
        if source.count(old) != 1:
            raise ValueError(f'Expected one mobile patch anchor: {old[:100]}')
        source = source.replace(old, new)
    anchor = '/* Reserve layout space and keep navigation usable without altering data or cart flow. */'
    if source.count(anchor) != 1:
        raise ValueError('Missing mobile CSS anchor')
    css = '''/* r40: empty managed collections and accessible quantity controls. */
.homeSeafood[hidden],.homeNew[hidden]{display:none!important}
@media(max-width:1024px){
 .product .qty{grid-template-columns:44px minmax(0,1fr) 44px!important}
 .product .qty button{min-width:44px!important;min-height:44px}
}
@media(max-width:620px){
 .product .qty{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:2px}
 .product .qty input{grid-column:1/-1;grid-row:1;min-width:0;min-height:44px}
 .product .qty button{min-width:44px!important;min-height:44px;padding:0}
 .product .add{min-height:44px}
}
@media(max-width:360px){
 .product .qty{grid-template-columns:minmax(0,1fr)!important}
 .product .qty input{grid-column:1;grid-row:2}
}
'''
    return source.replace(anchor, css + anchor)

if __name__ == '__main__':
    path = Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).with_name('deniz.mjs')
    path.write_text(apply(path.read_text()))
    print(f'Applied mobile fixes: {path}')
