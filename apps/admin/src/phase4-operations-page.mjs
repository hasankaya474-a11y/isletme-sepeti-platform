const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const card=(title,count,action)=>'<article class="control-card"><h2>'+e(title)+'</h2><strong>'+count+'</strong><button data-action="'+action+'">Yönet</button></article>';

export function renderPhase4Operations({priceBooks=[],stockLocations=[],reservations=[],deliveryZones=[],deliveryCalendars=[],deliverySlas=[]}={}){
 return '<section class="workspace" aria-labelledby="phase4-title"><header><div><p class="eyebrow">Komutan Admin</p><h1 id="phase4-title">Fiyat, Stok & Teslimat</h1><p>Fiyat listeleri, stok rezervasyonları ve teslimat politikalarını kod yazmadan yönetin.</p></div></header><div class="control-grid">'+
 card("Fiyat Listeleri",priceBooks.length,"price-books")+
 card("Stok Lokasyonları",stockLocations.length,"stock-locations")+
 card("Aktif Rezervasyonlar",reservations.length,"reservations")+
 card("Teslimat Bölgeleri",deliveryZones.length,"delivery-zones")+
 card("Teslimat Takvimleri",deliveryCalendars.length,"delivery-calendars")+
 card("SLA Politikaları",deliverySlas.length,"delivery-slas")+
 '</div><section><h2>Operasyon Kuralı</h2><p>Değişiklikler taslak ve inceleme akışından geçer; kritik stok ve fiyat işlemleri audit kaydı üretir.</p></section></section>';
}
