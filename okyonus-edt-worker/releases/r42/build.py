from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent
source=(root.parent/'r41/deniz.mjs').read_text()
anchor='\n`}\n\nfunction header()'
assert source.count(anchor)==1
css='''
/* R42 compact product cards: phone 3, wide mobile/tablet 4. */
@media(max-width:1024px){
 .products,.seafoodProducts,.commerceGrid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important}
 .product{padding:4px!important;border-radius:9px!important}
 .product .img{aspect-ratio:4/3!important;max-height:100px!important}
 .product .img img{padding:2px!important}
 .product .badges:empty{display:none!important}
 .product .badges{min-height:0!important;margin-top:3px!important;gap:2px}
 .product h3{margin:4px 0 3px!important;min-height:0!important;font-size:12px!important;line-height:1.2!important;overflow-wrap:anywhere}
 .product .meta{min-height:0!important;font-size:10px!important;line-height:1.2!important;margin-bottom:3px}
 .product .price{min-height:0!important;margin-top:4px!important;padding:4px!important;gap:2px!important}
 .product .price strong{font-size:12px!important;line-height:1.2!important}
 .product .fav{top:3px!important;right:3px!important;width:44px!important;height:44px!important;font-size:16px!important;background:transparent!important;border:0!important;box-shadow:none!important}
 .product .qty{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:2px!important;margin-top:5px!important}
 .product .qty input{grid-column:1/-1!important;grid-row:1!important;min-height:44px!important;height:44px!important;font-size:16px!important}
 .product .qty button{grid-row:2!important;min-width:44px!important;height:44px!important;padding:0!important}
 .product .add{margin-top:4px!important;min-height:44px!important;height:44px!important;font-size:12px!important;padding:0 3px!important}
 /* Place contact shortcuts after the content so they cannot cover card actions. */
 .float{position:static!important;flex-direction:row!important;justify-content:flex-end;margin:10px 12px 20px!important}
}
@media(min-width:600px) and (max-width:1024px){
 .products,.seafoodProducts,.commerceGrid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
 .product .img{max-height:130px!important}
 .product h3{font-size:13px!important}
 .product .qty{grid-template-columns:44px minmax(0,1fr) 44px!important}
 .product .qty input{grid-column:2!important;grid-row:1!important}
 .product .qty button{grid-row:1!important}
}
'''
source=source.replace(anchor,'\n'+css+anchor).replace('commerce-v2-2026-10-03-r41-live-audit-fix','commerce-v2-2026-10-03-r42-compact-mobile')
old='>Sepete / Teklife Ekle</button></article>'
assert source.count(old)>=1
source=source.replace(old,' aria-label=\\"Sepete veya teklif listesine ekle\\">Ekle</button></article>')
for filename in ['deniz.mjs','DENIZ_R42_TAM_KOD.txt']:(root/filename).write_text(source,encoding='ascii')
(root/'checksums.json').write_text(json.dumps({'bytes':len(source),'sha256':hashlib.sha256(source.encode()).hexdigest()},indent=2)+'\n')
print('R42 full Worker built')
