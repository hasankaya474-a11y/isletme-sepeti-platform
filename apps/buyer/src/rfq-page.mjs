const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderBuyerRfq({rfq=null,lines=[],invitations=[],loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace"><h1>Teklif Talebi</h1><p role="status">RFQ yükleniyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Teklif Talebi</h1><p role="alert">RFQ yüklenemedi.</p></section>';
 if(!rfq)return '<section class="buyer-workspace"><h1>Teklif Talebi</h1><p role="status">Henüz teklif talebi yok.</p><button data-action="new-rfq">Yeni Teklif Talebi</button></section>';
 return '<section class="buyer-workspace" aria-labelledby="rfq-title"><header><h1 id="rfq-title">'+e(rfq.title)+'</h1><span>'+e(rfq.status)+'</span></header><p>'+e(rfq.note??"")+'</p><section><h2>Ürünler</h2>'+(lines.length?lines.map(x=>'<article><strong>'+e(x.productName??x.masterProductId)+'</strong><span>'+e(x.quantityMilli/1000)+' '+e(x.unit)+'</span></article>').join(""):'<p role="status">Henüz ürün eklenmedi.</p>')+'</section><section><h2>Davet Edilen Tedarikçiler</h2><p>'+e(invitations.length)+' tedarikçi davet edildi. Tedarikçi seçimi sizin işleminizdir.</p></section></section>';
}
