const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderDeliveryCenter({deliveries=[],rmas=[],slots=[]}={}){
 return '<section class="workspace" aria-labelledby="delivery-admin-title"><header><div><p class="eyebrow">Komutan Admin</p><h1 id="delivery-admin-title">Teslimat & RMA Merkezi</h1><p>Kapasite, teslimat, mal kabul ve iade operasyonlarını izleyin.</p></div></header><div class="control-grid"><article><h2>Kapasite Slotları</h2><strong>'+e(slots.length)+'</strong></article><article><h2>Teslimatlar</h2><strong>'+e(deliveries.length)+'</strong></article><article><h2>RMA</h2><strong>'+e(rmas.length)+'</strong></article></div></section>';
}
