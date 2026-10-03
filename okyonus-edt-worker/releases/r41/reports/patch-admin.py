from pathlib import Path
import sys, json

def apply(text):
    old="if(Array.isArray(j.banners)){/* approved four-slide hero remains locked; admin banners retained in API for later controlled activation */}"
    new="if(Array.isArray(j.banners))managedHero(j.banners);"
    assert text.count(old)==1, 'Unique banner activation anchor missing'
    text=text.replace(old,new)
    start=text.index('safeHeroUrl=v=>')
    end=text.index(';function show(n)',start)
    safe=r"safeHeroUrl=v=>{v=String(v||'').trim();return v&&!/[\\\u0000-\u0020]/.test(v)&&/^(?:\/(?!\/)|https:\/\/)/i.test(v)?v:'/urunler'}"
    text=text[:start]+json.dumps(safe)[1:-1]+text[end:]
    old="function managedHero(list){if(!hero||!Array.isArray(list)||!list.length)return;hero.innerHTML=list.slice(0,10).map"
    new="const approvedHeroHtml=hero?hero.innerHTML:'';function restoreApprovedHero(){if(hero){hero.innerHTML=approvedHeroHtml;i=0;bindCarousel()}}function managedHero(list){if(!hero||!Array.isArray(list))return;list=list.filter(b=>b&&(b.active===undefined||Number(b.active)===1));if(!list.length){restoreApprovedHero();return}hero.innerHTML=list.map"
    assert text.count(old)==1
    text=text.replace(old,new)
    text=text.replace("list.slice(0,10).map((_,k)","list.map((_,k)",1)
    old="const d=String(b.desktop_image||''),m=String(b.mobile_image||d)"
    new=json.dumps(r"const safeImage=v=>{v=String(v||'').trim();return v&&!/[\\\u0000-\u0020]/.test(v)&&/^(?:\/(?!\/)|https:\/\/)/i.test(v)?v:''},d=safeImage(b.desktop_image),m=safeImage(b.mobile_image)||d")[1:-1]
    assert text.count(old)==1
    text=text.replace(old,new)
    old="i=0;bindCarousel()}if(hero)"
    new="i=0;bindCarousel();hero.querySelectorAll('.heroMedia img').forEach(img=>img.addEventListener('error',restoreApprovedHero,{once:true}))}if(hero)"
    assert text.count(old)==1
    text=text.replace(old,new)
    old='ORDER BY sort_order,rowid LIMIT 10'
    # Remove only the storefront banner query limit, leaving other module limits intact.
    anchor='SELECT * FROM oky_storefront_banners_v1 WHERE active=1'
    lines=text.splitlines(True)
    for n,line in enumerate(lines):
        if anchor in line: lines[n]=line.replace(old,'ORDER BY sort_order,rowid')
    return ''.join(lines)

if __name__=='__main__':
    path=Path(sys.argv[1]);path.write_text(apply(path.read_text()))
