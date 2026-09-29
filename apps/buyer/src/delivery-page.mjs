const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderBuyerDelivery({delivery=null,eta=null,loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace"><h1>Teslimatım</h1><p role="status">Teslimat yükleniyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Teslimatım</h1><p role="alert">Teslimat yüklenemedi.</p></section>';
 if(!delivery)return '<section class="buyer-workspace"><h1>Teslimatım</h1><p role="status">Teslimat bulunmuyor.</p></section>';
 return '<section class="buyer-workspace" aria-labelledby="delivery-title"><h1 id="delivery-title">Teslimat '+e(delivery.id)+'</h1><p>Durum: '+e(delivery.status)+'</p><p>ETA: '+e(eta?.etaAt??"Belirlenmedi")+'</p><p>ETA kaynağı: '+e(eta?.source??"NOT_AVAILABLE")+'</p></section>';
}
