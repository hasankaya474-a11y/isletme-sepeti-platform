const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderSupplierOrders({orders=[]}={}){
 return '<section class="supplier-workspace" aria-labelledby="supplier-orders-title"><h1 id="supplier-orders-title">Siparişler</h1>'+(orders.length?orders.map(x=>'<article><strong>'+e(x.id)+'</strong><span>'+e(x.state)+'</span><button data-id="'+e(x.id)+'">Yönet</button></article>').join(""):'<p role="status">Sipariş bulunmuyor.</p>')+'</section>';
}
