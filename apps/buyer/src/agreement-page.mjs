const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderAgreement({agreement=null,acceptances=[]}={}){
 if(!agreement)return '<section class="buyer-workspace"><h1>Ticari Anlaşma</h1><p role="status">Anlaşma bulunmuyor.</p></section>';
 return '<section class="buyer-workspace" aria-labelledby="agreement-title"><h1 id="agreement-title">'+e(agreement.name)+'</h1><p>Durum: '+e(agreement.status)+'</p><p>Kabul: '+e(acceptances.length)+'/2 taraf</p><button data-action="accept-agreement">Kabul Et</button></section>';
}
