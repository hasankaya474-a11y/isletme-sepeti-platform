from pathlib import Path
import sys

def apply(s):
    # Reuse the public response only within the current document; failures clear it.
    marker='function header(){return `'
    assert s.count(marker)==1
    runtime="""<script>(function(){window.okyStorefrontRead=window.okyStorefrontRead||function(forceRefresh){if(forceRefresh)window.__okyStorefrontPromise=null;return window.__okyStorefrontPromise||(window.__okyStorefrontPromise=fetch('/api/storefront-v2',{headers:{accept:'application/json'},cache:'no-store'}).then(function(r){if(!r.ok)throw Error('storefront');return r.json()}).catch(function(e){window.__okyStorefrontPromise=null;throw e}))}})();</script>"""
    s=s.replace(marker,marker+runtime,1)
    fetch="fetch('/api/storefront-v2',{headers:{accept:'application/json'},cache:'no-store'}).then(r=>r.json())"
    assert s.count(fetch)==7, s.count(fetch)
    s=s.replace(fetch,"window.okyStorefrontRead()")
    legacy="fetch('/api/products',{headers:{accept:'application/json'},cache:'no-store'}).then(r=>r.json()).catch(()=>({products:[]}))"
    pair="Promise.all([window.okyStorefrontRead().catch(()=>({products:[]})),"+legacy+"])"
    assert s.count(pair)==3,s.count(pair)
    s=s.replace(pair,"window.okyStorefrontRead().catch(()=>({products:[]})).then(async j=>[j,j.catalogAuthoritative?{products:[]}:await "+legacy+"])")
    # The first visible hero is LCP; reserve eager/high priority for it alone.
    old="<picture class=\"heroMedia\"><img src=\"'+esc(src)+'\" alt=\"Okyanus EDT ana vitrin '"
    new="<picture class=\"heroMedia\"><img decoding=\"async\" loading=\"'+(k===0?'eager':'lazy')+'\" fetchpriority=\"'+(k===0?'high':'low')+'\" src=\"'+esc(src)+'\" alt=\"Okyanus EDT ana vitrin '"
    assert old in s
    s=s.replace(old,new,1)
    old=r"'<img src=\"'+esc(d)+'\" alt=\"'+esc(b.title||'Okyanus EDT')"
    new=r"'<img decoding=\"async\" loading=\"'+(k===0?'eager':'lazy')+'\" fetchpriority=\"'+(k===0?'high':'low')+'\" src=\"'+esc(d)+'\" alt=\"'+esc(b.title||'Okyanus EDT')"
    assert old in s
    s=s.replace(old,new,1)
    return s

if __name__=='__main__':
    p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
