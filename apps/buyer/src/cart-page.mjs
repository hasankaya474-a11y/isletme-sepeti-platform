const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const money=(v,c)=>(v/100).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})+" "+e(c);
export function renderBuyerCart({cart=null,lines=[],requisition=null,loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace"><h1>Sepetim</h1><p role="status">Sepet yükleniyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Sepetim</h1><p role="alert">Sepet yüklenemedi.</p></section>';
 if(!cart)return '<section class="buyer-workspace"><h1>Sepetim</h1><p role="status">Aktif sepet yok.</p><button data-action="new-cart">Sepet Oluştur</button></section>';
 const body=lines.length?lines.map(x=>'<article><strong>'+e(x.productName??x.masterProductId)+'</strong><span>Tedarikçi: '+e(x.supplierName??x.supplierId)+'</span><span>'+e(x.quantityMilli/1000)+' birim</span><span>'+money(x.unitPriceMinor,x.currency)+'</span></article>').join(""):'<p role="status">Sepetiniz boş.</p>';
 return '<section class="buyer-workspace" aria-labelledby="cart-title"><h1 id="cart-title">'+e(cart.name)+'</h1><p>Durum: '+e(cart.status)+'</p><div>'+body+'</div>'+(requisition?'<p>Satın alma talebi: '+e(requisition.status)+'</p>':'')+'<button data-action="submit-cart">Onaya / Satın Alma Talebine Gönder</button></section>';
}
