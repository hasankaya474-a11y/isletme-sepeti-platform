const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const money=v=>(v/100).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2});

export function renderBuyerSearch({query="",cards=[],loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace" aria-live="polite"><h1>Ürün Ara / Katalog</h1><p role="status">Ürünler yükleniyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Ürün Ara / Katalog</h1><p role="alert">Arama tamamlanamadı. Yeniden deneyin.</p></section>';
 const body=cards.length?cards.map(c=>{
   const price=c.priceRangeTry?money(c.priceRangeTry.minMinor)+' ₺'+(c.priceRangeTry.maxMinor!==c.priceRangeTry.minMinor?' – '+money(c.priceRangeTry.maxMinor)+' ₺':''):"Fiyat için teklifleri inceleyin";
   return '<article class="product-card"><h2>'+e(c.name)+'</h2><p>'+e(c.baseUnit)+'</p><strong>'+e(price)+'</strong><p>'+e(c.activeOfferCount)+' aktif tedarikçi teklifi</p><p>'+e(c.availableQty)+' kullanılabilir stok sinyali</p><button data-product-id="'+e(c.id)+'">Teklifleri İncele</button></article>';
 }).join(""):'<p role="status">Aramanıza uygun ürün bulunamadı.</p>';
 return '<section class="buyer-workspace" aria-labelledby="buyer-search-title"><header><h1 id="buyer-search-title">Ürün Ara / Katalog</h1><form role="search"><label for="q">Ürün ara</label><input id="q" name="q" value="'+e(query)+'"><button>Ara</button></form></header><div class="product-grid">'+body+'</div></section>';
}
