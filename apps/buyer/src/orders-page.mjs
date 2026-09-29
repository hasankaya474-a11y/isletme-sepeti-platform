const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const money=(v,c)=>(v/100).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})+" "+e(c);
export function renderBuyerOrders({orders=[],loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace"><h1>Siparişlerim</h1><p role="status">Siparişler yükleniyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Siparişlerim</h1><p role="alert">Siparişler yüklenemedi.</p></section>';
 return '<section class="buyer-workspace" aria-labelledby="orders-title"><h1 id="orders-title">Siparişlerim</h1>'+(orders.length?orders.map(x=>'<article><strong>'+e(x.id)+'</strong><span>Tedarikçi: '+e(x.supplierId)+'</span><span>'+e(x.state)+'</span><span>'+money(x.grossMinor,x.currency)+'</span><button data-id="'+e(x.id)+'">Detay</button></article>').join(""):'<p role="status">Henüz sipariş yok.</p>')+'</section>';
}
