const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderInvoiceCenter({invoices=[],matches=[],agreements=[]}={}){
 return '<section class="workspace" aria-labelledby="invoice-admin-title"><header><div><p class="eyebrow">Komutan Admin</p><h1 id="invoice-admin-title">Fatura & Üçlü Eşleştirme Merkezi</h1><p>Fatura, uyuşmazlık ve anlaşma kanıtlarını izleyin.</p></div></header><div class="control-grid"><article><h2>Faturalar</h2><strong>'+e(invoices.length)+'</strong></article><article><h2>Eşleştirme İstisnaları</h2><strong>'+e(matches.filter(x=>x.status==="EXCEPTION").length)+'</strong></article><article><h2>Anlaşmalar</h2><strong>'+e(agreements.length)+'</strong></article></div></section>';
}
