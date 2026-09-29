const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderSupportCenter({cases=[]}={}){
 const open=cases.filter(x=>!["RESOLVED","CLOSED"].includes(x.status)).length;
 const disputes=cases.filter(x=>x.caseType==="DISPUTE").length;
 return '<section class="workspace" aria-labelledby="support-title"><header><div><p class="eyebrow">Komutan Admin</p><h1 id="support-title">Destek / Çağrı Merkezi</h1><p>Destek vakalarını, görüşme notlarını ve uyuşmazlıkları yönetin.</p></div></header><div class="control-grid"><article><h2>Toplam Vaka</h2><strong>'+e(cases.length)+'</strong></article><article><h2>Açık Vaka</h2><strong>'+e(open)+'</strong></article><article><h2>Uyuşmazlık</h2><strong>'+e(disputes)+'</strong></article></div></section>';
}