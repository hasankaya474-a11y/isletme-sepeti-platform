const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderReceiving({receiving=null,items=[]}={}){
 return '<section class="buyer-workspace" aria-labelledby="receiving-title"><h1 id="receiving-title">Mal Kabul</h1>'+(receiving?'<p>Durum: '+e(receiving.status)+'</p>':'<p role="status">Mal kabul kaydı yok.</p>')+'<div>'+items.map(x=>'<article><strong>'+e(x.productName??x.orderLineId)+'</strong><span>Planlanan: '+e(x.plannedQtyMilli/1000)+'</span><label>Kabul <input data-item="'+e(x.id)+'" name="accepted"></label><label>Red <input data-item="'+e(x.id)+'" name="rejected"></label></article>').join("")+'</div></section>';
}
