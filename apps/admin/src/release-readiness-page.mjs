const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderReleaseReadiness({gates=[],defects=[],decisions=[]}={}){
 const blockers=gates.filter(x=>x.status!=="PASS").length;
 const critical=defects.filter(x=>["HIGH","CRITICAL"].includes(x.severity)&&x.status!=="VERIFIED").length;
 return '<section class="workspace" aria-labelledby="release-title"><header><div><p class="eyebrow">Komutan Admin</p><h1 id="release-title">Production Release Gate</h1><p>Private pilot, defect closure, hukuk/muhasebe ve güvenlik kanıtlarını tek kapıda izleyin.</p></div></header><div class="control-grid"><article><h2>Açık Gate</h2><strong>'+e(blockers)+'</strong></article><article><h2>Kritik Defect</h2><strong>'+e(critical)+'</strong></article><article><h2>Release Kararları</h2><strong>'+e(decisions.length)+'</strong></article></div></section>';
}