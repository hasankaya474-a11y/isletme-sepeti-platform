const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderInvoiceReview({invoice=null,match=null}={}){
 if(!invoice)return '<section class="buyer-workspace"><h1>Fatura İnceleme</h1><p role="status">Fatura bulunmuyor.</p></section>';
 const issues=match?.issues??[];
 return '<section class="buyer-workspace" aria-labelledby="invoice-review-title"><h1 id="invoice-review-title">Fatura İnceleme</h1><p>Durum: '+e(invoice.status)+'</p><p>Üçlü eşleştirme: '+e(match?.status??"Henüz yapılmadı")+'</p>'+(issues.length?'<ul>'+issues.map(x=>'<li>'+e(x.code)+'</li>').join("")+'</ul>':'<p>Uyuşmazlık bulunmuyor.</p>')+'<p>Onay ödeme işlemi değildir.</p><button data-decision="APPROVED">Onayla</button><button data-decision="REJECTED">Reddet</button></section>';
}
