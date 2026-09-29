const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");

export function renderMatchingReview({request=null,candidates=[],loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace"><h1>Liste / Fotoğraf Eşleştirme</h1><p role="status">Eşleştirmeler hazırlanıyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Liste / Fotoğraf Eşleştirme</h1><p role="alert">Eşleştirme yüklenemedi. Yeniden deneyin.</p></section>';
 if(!request)return '<section class="buyer-workspace"><h1>Liste / Fotoğraf Eşleştirme</h1><p role="status">Henüz eşleştirme isteği yok.</p></section>';
 const rows=candidates.length?candidates.map(x=>'<article><strong>'+e(x.productName??x.masterProductId)+'</strong><span>Güven: %'+Math.round((x.confidence??0)*100)+'</span><button data-decision="CONFIRMED" data-id="'+e(x.id)+'">Onayla</button><button data-decision="REJECTED" data-id="'+e(x.id)+'">Reddet</button></article>').join(""):'<p role="status">Henüz aday ürün bulunamadı.</p>';
 return '<section class="buyer-workspace" aria-labelledby="match-title"><h1 id="match-title">Liste / Fotoğraf Eşleştirme</h1><p>Adaylar otomatik işlem yapmaz. Ürünü siz onaylamadan listenize veya satın alma akışına geçmez.</p><div>'+rows+'</div></section>';
}
