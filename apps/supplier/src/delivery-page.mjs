const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderSupplierDelivery({deliveries=[],slots=[]}={}){
 return '<section class="supplier-workspace" aria-labelledby="supplier-delivery-title"><h1 id="supplier-delivery-title">Teslimat Operasyonları</h1><p>Açık kapasite slotu: '+e(slots.filter(x=>x.status==="OPEN").length)+'</p>'+(deliveries.length?deliveries.map(x=>'<article><strong>'+e(x.id)+'</strong><span>'+e(x.status)+'</span><button data-id="'+e(x.id)+'">Yönet</button></article>').join(""):'<p role="status">Teslimat yok.</p>')+'</section>';
}
