const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderRma({rmas=[]}={}){
 return '<section class="buyer-workspace" aria-labelledby="rma-title"><h1 id="rma-title">İade / RMA</h1><p>RMA kaydı operasyonel süreçtir; burada otomatik para iadesi yapılmaz.</p>'+(rmas.length?rmas.map(x=>'<article><strong>'+e(x.id)+'</strong><span>'+e(x.status)+'</span><p>'+e(x.reason)+'</p></article>').join(""):'<p role="status">RMA talebi yok.</p>')+'</section>';
}
