const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const money=(v,c)=>(v/100).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})+" "+e(c);
export function renderQuoteComparison({quotes=[],loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace"><h1>Teklif Karşılaştırma</h1><p role="status">Teklifler yükleniyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Teklif Karşılaştırma</h1><p role="alert">Teklifler yüklenemedi.</p></section>';
 const body=quotes.length?quotes.map(q=>'<article class="quote-card"><h2>Tedarikçi '+e(q.supplierId)+'</h2><p>Net: '+money(q.netMinor,q.currency)+'</p><p>Vergi: '+money(q.taxMinor,q.currency)+'</p><strong>Toplam: '+money(q.grossMinor,q.currency)+'</strong><button data-quote-id="'+e(q.quoteId)+'">Teklifi İncele</button></article>').join(""):'<p role="status">Henüz gönderilmiş teklif yok.</p>';
 return '<section class="buyer-workspace" aria-labelledby="compare-title"><h1 id="compare-title">Teklif Karşılaştırma</h1><p>Karşılaştırma bilgi amaçlıdır. Sistem kazanan tedarikçi seçmez.</p><div class="quote-grid">'+body+'</div></section>';
}
