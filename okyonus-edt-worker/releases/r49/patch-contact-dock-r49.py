def apply(s):
 old='<div class="float"><a id="floatWhatsapp"'
 assert s.count(old)==1
 s=s.replace(old,'<div class="float" id="okyContactDock" role="navigation" aria-label="Hızlı iletişim ve yardım"><a id="floatWhatsapp"',1)
 old='<a href="/yardim" title="Site Yard\\u0131m" aria-label="Site Yard\\u0131m">?</a></div><div id="cookieConsent"'
 assert s.count(old)==1
 s=s.replace(old,'<a id="floatHelp" href="/yardim" title="Site Yardımı" aria-label="Site Yardımı">Y</a></div><div id="cookieConsent"',1)
 marker='function okyR47CriticalMobileCSS(){return `'
 css='''/* R49 contact dock overrides obsolete static mobile placement. */
#okyContactDock.float{position:fixed!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:8px!important;margin:0!important;padding:0!important;right:10px!important;bottom:calc(14px + env(safe-area-inset-bottom))!important;z-index:125!important;width:48px!important;visibility:visible!important;opacity:1!important}
#okyContactDock.float a{width:48px!important;height:48px!important;min-width:48px;min-height:48px;border-radius:50%;display:grid!important;place-items:center!important;text-decoration:none;box-shadow:0 3px 12px #07345e44;pointer-events:auto}
#okyContactDock #floatWhatsapp{background:#25d366!important;color:#fff!important}
#okyContactDock #floatWhatsapp svg{width:28px;height:28px;display:block;fill:currentColor}
#okyContactDock #floatHelp{background:#fff!important;color:#07345e!important;border:1px solid #bdd3df;font:800 20px/1 Arial}
#okyContactDock a:focus-visible{outline:3px solid #0879bb;outline-offset:3px}
@media(min-width:1025px){#okyContactDock.float{right:18px!important;bottom:24px!important}}
'''
 assert s.count(marker)==1
 # ID specificity beats historical .float!important regardless of stylesheet order.
 s=s.replace(marker,marker+css,1)
 return s
