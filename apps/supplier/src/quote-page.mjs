const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderSupplierQuote({rfq=null,quote=null,lines=[],loading=false,error=null}={}){
 if(loading)return '<section class="supplier-workspace"><h1>Teklif Yanıtı</h1><p role="status">Teklif alanı yükleniyor.</p></section>';
 if(error)return '<section class="supplier-workspace"><h1>Teklif Yanıtı</h1><p role="alert">Teklif alanı yüklenemedi.</p></section>';
 if(!rfq)return '<section class="supplier-workspace"><h1>Teklif Yanıtı</h1><p role="status">Yanıtlanacak RFQ bulunamadı.</p></section>';
 return '<section class="supplier-workspace" aria-labelledby="supplier-quote-title"><h1 id="supplier-quote-title">'+e(rfq.title)+'</h1><p>Durum: '+e(quote?.status??"Yeni")+'</p><section><h2>Talep Kalemleri</h2>'+lines.map(x=>'<article><strong>'+e(x.productName??x.masterProductId)+'</strong><span>'+e(x.quantityMilli/1000)+' '+e(x.unit)+'</span></article>').join("")+'</section><button data-action="submit-quote">Teklifi Gönder</button></section>';
}
