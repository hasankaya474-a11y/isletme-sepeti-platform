const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderRfqCenter({rfqs=[]}={}){
 return '<section class="workspace" aria-labelledby="rfq-admin-title"><header><div><p class="eyebrow">Komutan Admin</p><h1 id="rfq-admin-title">RFQ & Teklif Merkezi</h1><p>Teklif taleplerini, yanıt durumlarını ve kontrollü mesajlaşmayı operasyonel olarak izleyin.</p></div></header><section><h2>RFQ Kuyruğu</h2>'+(rfqs.length?rfqs.map(x=>'<article><strong>'+e(x.title)+'</strong><span>'+e(x.status)+'</span><button data-id="'+e(x.id)+'">İncele</button></article>').join(""):'<p role="status">RFQ bulunmuyor.</p>')+'</section></section>';
}
