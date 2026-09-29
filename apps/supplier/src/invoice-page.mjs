const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderSupplierInvoice({invoice=null,lines=[]}={}){
 if(!invoice)return '<section class="supplier-workspace"><h1>Fatura</h1><p role="status">Fatura bulunmuyor.</p></section>';
 return '<section class="supplier-workspace" aria-labelledby="invoice-title"><h1 id="invoice-title">Fatura '+e(invoice.invoiceNumber)+'</h1><p>Durum: '+e(invoice.status)+'</p><div>'+lines.map(x=>'<article><strong>'+e(x.orderLineId)+'</strong><span>'+e(x.quantityMilli/1000)+'</span></article>').join("")+'</div><button data-action="submit-invoice">Faturayı Gönder</button></section>';
}
