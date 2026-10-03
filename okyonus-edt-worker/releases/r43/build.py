from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent
s=(root.parent/'r42/deniz.mjs').read_text()
css='''
/* R43 final mobile overrides, after every existing stylesheet. */
@media(max-width:599px){
 .products .product,.seafoodProducts .product,.commerceGrid .product{align-self:start!important;padding:4px!important}
 .product .qty{grid-template-columns:32px minmax(0,1fr) 32px!important;gap:2px!important;margin-top:4px!important}
 .product .qty input{grid-column:2!important;grid-row:1!important;width:100%!important;min-width:0!important;padding:0!important;height:44px!important;min-height:44px!important;font-size:16px!important}
 .product .qty button{grid-row:1!important;min-width:32px!important;width:32px!important;height:44px!important;padding:0!important}
 .product .qty button[data-minus]{grid-column:1!important}
 .product .qty button[data-plus]{grid-column:3!important}
 .product .price{grid-template-columns:minmax(0,1fr)!important}
 .product .priceLabel{display:none!important}
 .product .price strong{font-size:11px!important;overflow-wrap:anywhere!important}
 .product .img{max-height:88px!important}
 .product h3{font-size:12px!important;line-height:1.2!important;margin:4px 0!important}
}
@media(max-width:1024px){
 body .float{position:static!important;flex-direction:row!important;justify-content:flex-end!important;align-items:center!important;margin:12px!important;padding:0!important;right:auto!important;bottom:auto!important}
}
'''
# Add final CSS after body styles and scripts, before closing body.
anchor="function commerceClientShell("
p=s.index(anchor);end=s.index('\n}',p)
block=s[p:end];print(block[:180])
# shell's complete return includes the settings script followed by body close.
old="runtimeSettingsScript()+'</body></html>'"
assert s.count(old)>=1
s=s.replace(old,"runtimeSettingsScript()+'<style id=\"oky-r43-final-mobile\">"+css.replace('\n',' ') +"</style></body></html>'")
s=s.replace('commerce-v2-2026-10-03-r42-compact-mobile','commerce-v2-2026-10-03-r43-compact-stepper')
for name in ['deniz.mjs','DENIZ_R43_TAM_KOD.txt']:(root/name).write_text(s,encoding='ascii')
(root/'checksums.json').write_text(json.dumps({'bytes':len(s),'sha256':hashlib.sha256(s.encode()).hexdigest()},indent=2)+'\n')
