"use strict";

const NAV = {
  public:["Ana Sayfa","Kategoriler","Tedarikçiler","Nasıl Çalışır","Yardım"],
  buyer:["Ana Sayfa","Ürün Ara / Katalog","Kategoriler","Toptancılar","Liste Yükle","Teklifler","Sepetim","Siparişlerim","Teslimatlarım","Tekrar Sipariş","Satın Alma Listelerim","Tedarikçilerim","Favorilerim","Faturalarım","Raporlarım","Şubelerim","Kullanıcı & Yetki","Bildirimler","İşletme Ayarları","Yardım"],
  supplier:["Genel Bakış","Siparişler","Teklif Talepleri","Ürünlerim","Fiyat Merkezi","Stok Merkezi","Toplu İşlemler","Teslimat","Müşterilerim","Özel Fiyatlar","Kampanyalar","Faturalar","Cari Bilgileri","Komisyon","Raporlar","Personel & Yetki","Hareket Geçmişi","Firma Ayarları","Yardım"],
  admin:["Genel Bakış","Ticaret","Katalog","Fiyat & Stok","Teslimat","İşletmeciler","Toptancılar","Üyelik & Yetki","Vitrin Studio","Kampanya & Reklam","Raporlama","Pazar Radarı","Destek / Çağrı Merkezi","Yardım & Site Kılavuzu","Sözleşmeler","Entegrasyonlar","Güvenlik & KVKK","Audit / Hareketler","Engine Room"]
};

const SURFACES = {
  public:{title:"Keşif",eyebrow:"PUBLIC",icon:"◫"},
  buyer:{title:"Alıcı Çalışma Alanı",eyebrow:"BUYER",icon:"🛒"},
  supplier:{title:"Tedarikçi Operasyonu",eyebrow:"SUPPLIER",icon:"🏭"},
  admin:{title:"Komutan Admin",eyebrow:"ADMIN",icon:"⚙"}
};

const ICONS = {
  "Ana Sayfa":"⌂","Genel Bakış":"⌂","Ürün Ara / Katalog":"⌕","Kategoriler":"▦","Toptancılar":"🏢","Tedarikçiler":"🏢",
  "Liste Yükle":"⇧","Teklifler":"✦","Sepetim":"🛒","Siparişlerim":"▣","Teslimatlarım":"🚚","Tekrar Sipariş":"↻",
  "Satın Alma Listelerim":"☷","Tedarikçilerim":"♙","Favorilerim":"♡","Faturalarım":"₺","Raporlarım":"▥","Şubelerim":"⌂",
  "Kullanıcı & Yetki":"♙","Bildirimler":"●","İşletme Ayarları":"⚙","Yardım":"?","Siparişler":"▣","Teklif Talepleri":"✦",
  "Ürünlerim":"▦","Fiyat Merkezi":"₺","Stok Merkezi":"▤","Toplu İşlemler":"⇄","Teslimat":"🚚","Müşterilerim":"♙",
  "Özel Fiyatlar":"₺","Kampanyalar":"✹","Faturalar":"₺","Cari Bilgileri":"▥","Komisyon":"%","Raporlar":"▥","Personel & Yetki":"♙",
  "Hareket Geçmişi":"↺","Firma Ayarları":"⚙","Ticaret":"⇄","Katalog":"▦","Fiyat & Stok":"₺","İşletmeciler":"♙",
  "Üyelik & Yetki":"♙","Vitrin Studio":"◫","Kampanya & Reklam":"✹","Raporlama":"▥","Pazar Radarı":"◉",
  "Destek / Çağrı Merkezi":"☎","Yardım & Site Kılavuzu":"?","Sözleşmeler":"§","Entegrasyonlar":"⌘",
  "Güvenlik & KVKK":"◆","Audit / Hareketler":"↺","Engine Room":"⚙","Nasıl Çalışır":"→"
};

const PRODUCTS = [
  {id:"p1",name:"Donuk Patates 2.5 kg",cat:"Donuk",unit:"Koli",emoji:"🍟",min:1280,max:1460,offers:8,stock:320},
  {id:"p2",name:"Ayçiçek Yağı 18 L",cat:"Yağ",unit:"Teneke",emoji:"🫗",min:1890,max:2050,offers:11,stock:148},
  {id:"p3",name:"Dilim Cheddar",cat:"Süt & Şarküteri",unit:"Koli",emoji:"🧀",min:2240,max:2480,offers:6,stock:76},
  {id:"p4",name:"Levrek Fileto",cat:"Deniz Ürünleri",unit:"Kg",emoji:"🐟",min:0,max:0,offers:5,stock:95},
  {id:"p5",name:"Un 25 kg",cat:"Temel Gıda",unit:"Çuval",emoji:"🌾",min:780,max:860,offers:14,stock:640},
  {id:"p6",name:"Domates Salçası",cat:"Konserve",unit:"Koli",emoji:"🥫",min:1140,max:1300,offers:9,stock:210},
  {id:"p7",name:"Süt 1 L",cat:"Süt & Şarküteri",unit:"Koli",emoji:"🥛",min:620,max:710,offers:12,stock:420},
  {id:"p8",name:"Nohut 25 kg",cat:"Bakliyat",unit:"Çuval",emoji:"🫘",min:1980,max:2140,offers:7,stock:180},
  {id:"p9",name:"Dana Burger Köfte",cat:"Et & Donuk",unit:"Koli",emoji:"🍔",min:2950,max:3280,offers:5,stock:88},
  {id:"p10",name:"Mayonez 8 kg",cat:"Sos",unit:"Kova",emoji:"🥣",min:890,max:970,offers:10,stock:155},
  {id:"p11",name:"Ahtapot Temizlenmiş",cat:"Deniz Ürünleri",unit:"Kg",emoji:"🐙",min:0,max:0,offers:4,stock:42},
  {id:"p12",name:"Pirinç Osmancık 25 kg",cat:"Bakliyat",unit:"Çuval",emoji:"🍚",min:1740,max:1890,offers:13,stock:350}
];

const SUPPLIERS = [
  {name:"Marmara Gıda Tedarik",score:"4.8",sla:"%97",cats:"Temel Gıda · Yağ · Sos",city:"İstanbul",status:"Doğrulandı"},
  {name:"Kuzey Deniz Ürünleri",score:"4.7",sla:"%95",cats:"Balık · Deniz Ürünleri",city:"İstanbul",status:"Doğrulandı"},
  {name:"Profesyonel Donuk",score:"4.6",sla:"%96",cats:"Donuk · Patates · Et",city:"Kocaeli",status:"Doğrulandı"},
  {name:"Anadolu Bakliyat",score:"4.5",sla:"%94",cats:"Bakliyat · Pirinç · Un",city:"İstanbul",status:"İncelemede"},
  {name:"Şef Süt Ürünleri",score:"4.9",sla:"%98",cats:"Süt · Peynir · Şarküteri",city:"İstanbul",status:"Doğrulandı"}
];

const ORDERS = [
  {id:"SP-1048",party:"Marmara Gıda Tedarik",amount:"₺18.420",date:"29 Eyl",status:"Hazırlanıyor"},
  {id:"SP-1042",party:"Kuzey Deniz Ürünleri",amount:"₺12.760",date:"28 Eyl",status:"Yolda"},
  {id:"SP-1039",party:"Profesyonel Donuk",amount:"₺21.540",date:"27 Eyl",status:"Teslim Edildi"},
  {id:"SP-1035",party:"Şef Süt Ürünleri",amount:"₺9.860",date:"26 Eyl",status:"Teslim Edildi"},
  {id:"SP-1028",party:"Anadolu Bakliyat",amount:"₺15.270",date:"25 Eyl",status:"Onay Bekliyor"}
];

const RFQS = [
  {id:"RFQ-812",party:"Marmara Gıda Tedarik",item:"Ayçiçek Yağı 18 L",qty:"12 teneke",deadline:"Bugün 16:00",status:"5 teklif"},
  {id:"RFQ-809",party:"Kuzey Deniz Ürünleri",item:"Levrek Fileto",qty:"45 kg",deadline:"Yarın 12:00",status:"3 teklif"},
  {id:"RFQ-804",party:"Profesyonel Donuk",item:"Donuk Patates",qty:"20 koli",deadline:"30 Eyl",status:"8 teklif"},
  {id:"RFQ-799",party:"Şef Süt Ürünleri",item:"Dilim Cheddar",qty:"8 koli",deadline:"30 Eyl",status:"4 teklif"}
];

const state = {
  surface:"public",
  page:"Ana Sayfa",
  cart:[{id:"p1",qty:4},{id:"p2",qty:2},{id:"p7",qty:3}],
  favorites:new Set(["p1","p4","p11"]),
  notifications:6,
  activity:[
    "Sipariş SP-1048 tedarikçiye iletildi",
    "RFQ-812 için yeni teklif geldi",
    "Donuk Patates stok sinyali güncellendi",
    "Fatura INV-308 üçlü eşleştirmeden geçti"
  ]
};

const MODULES = {
  buyer:{
    "Ana Sayfa":m("Satın alma özetin","Günlük satın alma işlerini, açık talepleri ve teslimatları tek ekranda yönet.","Phase 5–12","dashboard"),
    "Ürün Ara / Katalog":m("Ürün Ara / Katalog","Yayınlanmış ürünleri ve aktif tedarikçi tekliflerini ara; tedarikçi seçimi kullanıcıya aittir.","Phase 5","catalog"),
    "Kategoriler":m("Kategoriler","Master katalog içindeki ürün ailelerini kategori bazında keşfet ve filtrele.","Phase 3–5","catalog"),
    "Toptancılar":m("Toptancılar","Doğrulanmış tedarikçileri kategori, teslimat bölgesi ve SLA sinyaline göre incele.","Phase 3–6","suppliers"),
    "Liste Yükle":m("Liste / Fotoğraf Yükle","Metin listesi veya fotoğraf yükle; sistem yalnız eşleşme adayı üretir, nihai seçim sende kalır.","Phase 5","matching"),
    "Teklifler":m("Teklifler","RFQ taleplerini ve gelen teklifleri olgusal alanlarla karşılaştır.","Phase 6","rfq"),
    "Sepetim":m("Akıllı Sepet","Seçili kalemleri tedarikçi ve teslimat koşullarıyla birlikte satın alma talebine dönüştür.","Phase 7","cart"),
    "Siparişlerim":m("Siparişlerim","PO_READY sonrası açıkça oluşturulmuş siparişleri ve immutable snapshot kayıtlarını takip et.","Phase 8","orders"),
    "Teslimatlarım":m("Teslimatlarım","ETA, kapasite, teslimat ve mal kabul akışını takip et.","Phase 9","delivery"),
    "Tekrar Sipariş":m("Tekrar Sipariş","Geçmiş sipariş kalemlerini güncel fiyat ve stokla yeniden sepete hazırla; otomatik sipariş verilmez.","Phase 7–8","repeat"),
    "Satın Alma Listelerim":m("Satın Alma Listelerim","Sık kullanılan ürün listelerini şube veya operasyon tipine göre yönet.","Phase 5–7","lists"),
    "Tedarikçilerim":m("Tedarikçilerim","İşletmenin çalıştığı tedarikçileri, sözleşme ve performans sinyalleriyle görüntüle.","Phase 6–10","suppliers"),
    "Favorilerim":m("Favorilerim","Kaydettiğin ürün ve tedarikçilere hızlı eriş.","Phase 5","favorites"),
    "Faturalarım":m("Faturalarım","Tedarikçi faturalarını sipariş ve mal kabul kayıtlarıyla üçlü eşleştirme üzerinden incele.","Phase 10","invoice"),
    "Raporlarım":m("Raporlarım","Satın alma, tedarikçi, kategori ve teslimat metriklerini raporla; dışa aktarma işi job olarak yürür.","Phase 12","reports"),
    "Şubelerim":m("Şubelerim","İşletme şubeleri, teslimat adresleri ve satın alma kapsamlarını yönet.","Phase 1","branches"),
    "Kullanıcı & Yetki":m("Kullanıcı & Yetki","Üyelik, rol ve kapsam bazlı erişim modelini görüntüle; kritik yetkiler auditlidir.","Phase 1","identity"),
    "Bildirimler":m("Bildirimler","Teklif, sipariş, teslimat ve finans olaylarından oluşan bildirim akışını yönet.","Phase 8–15","notifications"),
    "İşletme Ayarları":m("İşletme Ayarları","Şirket profili, satın alma tercihleri ve operasyonel varsayımları yönet.","Phase 1–2","settings"),
    "Yardım":m("Yardım","Kullanıcı akışlarını, işlem açıklamalarını ve destek kanallarını görüntüle.","Phase 2","help")
  },
  supplier:{
    "Genel Bakış":m("Tedarikçi Genel Bakış","RFQ, teklif, stok, sipariş, teslimat ve fatura operasyonlarını tek panelde takip et.","Phase 3–15","supplier-dashboard"),
    "Siparişler":m("Siparişler","Alıcı tarafından açıkça oluşturulmuş siparişleri hazırlık ve teslimat durumuna göre yönet.","Phase 8","supplier-orders"),
    "Teklif Talepleri":m("Teklif Talepleri","Davet edildiğin RFQ taleplerini incele ve teklif gönder.","Phase 6","supplier-rfq"),
    "Ürünlerim":m("Ürünlerim","Master katalogla eşleştirilmiş tedarikçi ürün tekliflerini yönet.","Phase 3","supplier-products"),
    "Fiyat Merkezi":m("Fiyat Merkezi","Teklif fiyatı, vergi, geçerlilik ve minimum sipariş koşullarını yönet.","Phase 4","supplier-price"),
    "Stok Merkezi":m("Stok Merkezi","Kullanılabilir stok sinyallerini ve rezervasyon etkilerini güncelle.","Phase 4","supplier-stock"),
    "Toplu İşlemler":m("Toplu İşlemler","Kontrollü toplu fiyat/stok içe aktarma işlerini job olarak yönet.","Phase 15","bulk"),
    "Teslimat":m("Teslimat","Teslimat bölgeleri, takvim, kapasite ve SLA operasyonlarını yönet.","Phase 4–9","supplier-delivery"),
    "Müşterilerim":m("Müşterilerim","Yetkili işletme ilişkilerini ve sipariş geçmişi sinyallerini görüntüle.","Phase 6–13","customers"),
    "Özel Fiyatlar":m("Özel Fiyatlar","İşletme bazlı fiyat kurallarını kontrollü kapsam ve geçerlilikle yönet.","Phase 4","supplier-price"),
    "Kampanyalar":m("Kampanyalar","Yayın kurallarına bağlı tedarikçi kampanyalarını yönet.","Phase 14","campaign"),
    "Faturalar":m("Faturalar","Siparişe bağlı tedarikçi faturalarını yükle ve eşleşme durumunu takip et.","Phase 10","supplier-invoice"),
    "Cari Bilgileri":m("Cari Bilgileri","Cari özet, alacak/borç sinyali ve mutabakat referanslarını görüntüle.","Phase 11","finance"),
    "Komisyon":m("Komisyon","Aktif komisyon kuralı, tahakkuk ve ledger yansımalarını incele.","Phase 11","commission"),
    "Raporlar":m("Raporlar","Satış, teklif dönüşümü, teslimat ve finans metriklerini raporla.","Phase 12","reports"),
    "Personel & Yetki":m("Personel & Yetki","Tedarikçi personeli, rol ve kapsam yetkilerini yönet.","Phase 1","identity"),
    "Hareket Geçmişi":m("Hareket Geçmişi","Tedarikçi işlemlerinin audit kayıtlarını görüntüle.","Phase 1–16","audit"),
    "Firma Ayarları":m("Firma Ayarları","Firma profili, depo, teslimat ve bildirim ayarlarını yönet.","Phase 1–4","settings"),
    "Yardım":m("Yardım","Tedarikçi akışları ve destek rehberine eriş.","Phase 2","help")
  },
  admin:{
    "Genel Bakış":m("Komutan Admin","Platform sağlığı, ticari akış ve release kapılarını tek panelde izle.","Phase 2–18","admin-dashboard"),
    "Ticaret":m("Ticaret","RFQ → teklif → sepet → sipariş → teslimat → fatura zincirini operasyonel olarak izle.","Phase 6–13","commerce"),
    "Katalog":m("Katalog / PIM","Master ürün, kategori, medya, veri kalitesi ve tedarikçi eşleştirmelerini yönet.","Phase 3","admin-catalog"),
    "Fiyat & Stok":m("Fiyat & Stok","Fiyat, vergi, stok, rezervasyon ve SLA sinyallerini yönet.","Phase 4","admin-price-stock"),
    "Teslimat":m("Teslimat","Bölge, takvim, kapasite, ETA, receiving ve RMA akışlarını yönet.","Phase 4–9","admin-delivery"),
    "İşletmeciler":m("İşletmeciler","İşletme, şube, üyelik ve risk sinyallerini yönet.","Phase 1–13","entities"),
    "Toptancılar":m("Toptancılar","Tedarikçi onboarding, teklif kalitesi, performans ve sözleşme durumunu yönet.","Phase 1–14","entities"),
    "Üyelik & Yetki":m("Üyelik & Yetki","RBAC, scope, MFA, session ve kritik yetki akışlarını yönet.","Phase 1–16","admin-identity"),
    "Vitrin Studio":m("Vitrin Studio","Public/buyer içeriklerini DRAFT → REVIEW → PUBLISHED yaşam döngüsüyle yönet.","Phase 2","studio"),
    "Kampanya & Reklam":m("Kampanya & Reklam","Sponsorlu görünürlük ve kampanya kurallarını şeffaf, yönetilebilir şekilde çalıştır.","Phase 14","admin-campaign"),
    "Raporlama":m("Raporlama","Metric dictionary, rapor işleri ve PDF/Excel dışa aktarma süreçlerini yönet.","Phase 12","admin-reporting"),
    "Pazar Radarı":m("Pazar Radarı","Gözlemsel pazar sinyallerini gösterir; otomatik fiyat/tedarikçi kararı vermez.","Phase 14","radar"),
    "Destek / Çağrı Merkezi":m("Destek / Çağrı Merkezi","Destek vakaları, çağrı kayıtları ve dispute iş akışlarını yönet.","Phase 13","support"),
    "Yardım & Site Kılavuzu":m("Yardım & Site Kılavuzu","Tüm rol ekranları için yönetilebilir yardım içeriği ve site rehberini yönet.","Phase 2","admin-help"),
    "Sözleşmeler":m("Sözleşmeler","Sözleşme, kanıt, versiyon ve kabul kayıtlarını yönet.","Phase 10","contracts"),
    "Entegrasyonlar":m("Integration Hub","API istemcileri, webhooklar, bulk jobs ve test adapterlerini yönet.","Phase 15","integrations"),
    "Güvenlik & KVKK":m("Güvenlik & KVKK","Retention, privacy, security review, restore/load hazırlığı ve izin kayıtlarını yönet.","Phase 16–18","security"),
    "Audit / Hareketler":m("Audit / Hareketler","Platform genelindeki değişmez işlem geçmişini sorgula.","Phase 1–18","audit"),
    "Engine Room":m("Engine Room","Phase 0–18 kapsama, release gate ve platform guardrail durumunu görüntüle.","Phase 0–18","engine")
  }
};

function m(title,description,phase,type){return {title:title,description:description,phase:phase,type:type};}
function esc(v){return String(v==null?"":v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function money(v){return Number(v).toLocaleString("tr-TR")+" ₺";}
function statusClass(v){
  const s=String(v).toLowerCase();
  if(s.includes("teslim")||s.includes("doğr")||s.includes("pass")||s.includes("aktif")||s.includes("eşleşti")||s.includes("başar"))return "ok";
  if(s.includes("bek")||s.includes("hazır")||s.includes("incele")||s.includes("yolda")||s.includes("review"))return "warn";
  if(s.includes("fail")||s.includes("kritik")||s.includes("kilit"))return "bad";
  return "info";
}
function pill(v){return '<span class="status-pill '+statusClass(v)+'">'+esc(v)+'</span>';}
function kpis(items){
  return '<div class="grid kpis">'+items.map(function(x){return '<div class="card kpi"><small>'+esc(x[0])+'</small><strong>'+esc(x[1])+'</strong><em>'+esc(x[2]||"Güncel demo sinyali")+'</em></div>';}).join("")+'</div>';
}
function pageHead(meta,actions){
  return '<div class="page-head"><div><div class="eyebrow">'+esc(meta.phase||"İşletme Sepeti")+'</div><h1>'+esc(meta.title)+'</h1><p>'+esc(meta.description||"")+'</p></div><div class="actions">'+(actions||[]).map(function(a){return '<button class="btn '+(a.primary?"primary":"")+'" data-action="'+esc(a.action||"drawer")+'" data-label="'+esc(a.label)+'">'+esc(a.label)+'</button>';}).join("")+'</div></div>';
}
function table(headers,rows){
  return '<div class="table-wrap"><table class="table"><thead><tr>'+headers.map(function(h){return '<th>'+esc(h)+'</th>';}).join("")+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+c+'</td>';}).join("")+'</tr>';}).join("")+'</tbody></table></div>';
}
function card(title,subtitle,body,extra){
  return '<section class="card"><div class="card-head"><div><h3>'+esc(title)+'</h3>'+(subtitle?'<p>'+esc(subtitle)+'</p>':"")+'</div>'+(extra||"")+'</div>'+body+'</section>';
}
function guardNote(){
  return '<div class="alert warn"><strong>Architecture Lock:</strong> AI yardımcı olabilir ancak tedarikçiyi sessizce seçemez, ürünü ikame edemez, sipariş veremez, fiyat/credit değiştiremez veya ödeme çalıştıramaz. Production release gerçek kanıt kapıları olmadan kilitlidir.</div>';
}
function architectureCoverage(meta){
  const items=["Amaç & roller","Responsive UX","Yetki & scope","Admin karşılığı","API & event","Audit geçmişi","Help içeriği","Privacy/legal","Error/loading/empty","Regresyon testi"];
  return card("Mimari kapsam","Architecture Lock v3 PASS kriterlerinin demo görünümü",
    '<div class="coverage-grid" style="padding:18px">'+items.map(function(x){return '<div class="coverage"><strong>'+x+'</strong><small>Tanımlı ve modül sözleşmesine bağlı</small><div class="progress"><i style="width:100%"></i></div></div>';}).join("")+'</div>'
  );
}
function activityCard(){
  return card("Son hareketler","Audit/event farkındalığı",
    '<div class="timeline" style="padding:18px">'+state.activity.slice(0,6).map(function(x,i){return '<div class="timeline-item"><span class="timeline-dot"></span><div><strong>'+esc(x)+'</strong><small>'+(i*7+3)+' dk önce · demo event</small></div></div>';}).join("")+'</div>'
  );
}
function productCard(p){
  const price=p.min?money(p.min)+(p.max!==p.min?" – "+money(p.max):""):"Teklif iste";
  return '<article class="product-card" data-product="'+p.id+'"><div class="product-media">'+p.emoji+'</div><div class="product-body"><div class="inline" style="justify-content:space-between"><span class="pill">'+esc(p.unit)+'</span><button class="btn small" data-action="favorite" data-id="'+p.id+'">'+(state.favorites.has(p.id)?"♥":"♡")+'</button></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.cat)+'</p><div class="product-price">'+esc(price)+'</div><p>'+p.offers+' aktif teklif · '+p.stock+' stok sinyali</p><button class="btn primary" data-action="add-cart" data-id="'+p.id+'">Sepete / Teklife Ekle</button></div></article>';
}
function flow(){
  const steps=[["Keşif","Ürün / tedarikçi"],["RFQ","Talep oluştur"],["Teklif","Olgusal karşılaştır"],["Onay","Yetki / four-eyes"],["Sipariş","Snapshot + outbox"],["Teslimat","ETA / receiving"],["Fatura","3-way match"],["Ledger","Mutabakat"]];
  return '<div class="flow">'+steps.map(function(x,i){return '<div class="flow-step '+(i<5?"active":"")+'"><b>'+x[0]+'</b><small>'+x[1]+'</small></div>';}).join("")+'</div>';
}
function publicHome(){
  return '<div class="hero"><section class="hero-main"><div class="eyebrow" style="color:#ccfbf1">B2B TEDARİK PLATFORMU</div><h1>Satın alma akışını tek yerde, kontrollü şekilde yönet.</h1><p>Ürün keşfinden teklif toplamaya, siparişten teslimat ve faturaya kadar bütün B2B satın alma zincirini rol bazlı yüzlerde takip et.</p><div class="actions" style="justify-content:flex-start"><button class="btn primary" data-go="buyer|Ürün Ara / Katalog">Ürünleri Keşfet</button><button class="btn" style="background:rgba(255,255,255,.12);color:#fff" data-go="buyer|Teklifler">Teklif Topla</button></div></section><section class="hero-side"><div class="eyebrow" style="color:#c7d2fe">KONTROLLÜ MİMARİ</div><h2>Şeffaf karar, kayıtlı süreç</h2><p>Her kritik adım yetki, audit ve kanıt iziyle ilerler. Tedarikçi ve sipariş kararını sistem senin adına sessizce vermez.</p></section></div>'+
  kpis([["Kategori","48","Master katalog görünümü"],["Tedarikçi havuzu","126","Demo onboarding"],["Açık RFQ","24","Kontrollü talep"],["Platform modülü","58+","Rol bazlı workspace"]])+
  '<div class="page-head" style="margin-top:24px"><div><div class="eyebrow">KATALOG</div><h1 style="font-size:24px">Öne çıkan ürünler</h1><p>Aktif teklif ve stok sinyali bulunan demo ürünler.</p></div><button class="btn" data-go="buyer|Ürün Ara / Katalog">Tüm kataloğu aç</button></div><div class="product-grid">'+PRODUCTS.slice(0,8).map(productCard).join("")+'</div>'+
  '<div style="margin-top:22px">'+card("Satın alma omurgası","Mimari akış",'<div style="padding:18px">'+flow()+'</div>')+'</div>';
}
function publicCategories(){
  const cats=[["Temel Gıda","146 ürün","🌾"],["Donuk","92 ürün","❄"],["Deniz Ürünleri","68 ürün","🐟"],["Süt & Şarküteri","115 ürün","🧀"],["Bakliyat","84 ürün","🫘"],["Yağ & Sos","74 ürün","🫗"],["İçecek","121 ürün","🥤"],["Temizlik","58 ürün","🧼"]];
  return pageHead({phase:"PUBLIC",title:"Kategoriler",description:"Master katalogdaki kategori ailelerini keşfet."},[])+'<div class="grid three">'+cats.map(function(c){return '<button class="card pad" data-go="buyer|Ürün Ara / Katalog" style="text-align:left"><div style="font-size:32px">'+c[2]+'</div><h3>'+c[0]+'</h3><p style="color:var(--muted)">'+c[1]+' · aktif katalog</p></button>';}).join("")+'</div>';
}
function publicSuppliers(){
  return pageHead({phase:"PUBLIC",title:"Tedarikçiler",description:"Doğrulama, kategori ve SLA sinyalleriyle tedarikçi keşfi."},[{label:"Alıcı alanına geç",action:"go-buyer",primary:true}])+
  card("Tedarikçi ağı","Demo kayıtlar",table(["Tedarikçi","Kategori","Bölge","SLA","Durum"],SUPPLIERS.map(function(s){return ['<strong>'+s.name+'</strong>','<span class="muted">'+s.cats+'</span>',s.city,s.sla,pill(s.status)];})));
}
function publicHow(){
  return pageHead({phase:"PUBLIC",title:"Nasıl Çalışır",description:"İşletme Sepeti'nin kontrollü B2B satın alma yolculuğu."},[])+
  card("Uçtan uca akış","Her kritik noktada insan kararı",'<div style="padding:18px">'+flow()+'</div>')+
  '<div style="margin-top:16px">'+architectureCoverage({})+'</div>';
}
function publicHelp(){
  return pageHead({phase:"PUBLIC",title:"Yardım",description:"Sık kullanılan akışlar ve platform rehberi."},[{label:"Destek kaydı aç",action:"support",primary:true}])+
  genericHelpContent();
}

function buyerHome(meta){
  return pageHead(meta,[{label:"Yeni RFQ",action:"rfq",primary:true},{label:"Ürün ara",action:"catalog"}])+
  kpis([["Açık RFQ","8","+2 bu hafta"],["Sepet kalemi",String(state.cart.length),"Onay öncesi"],["Aktif sipariş","12","4 teslimat bekliyor"],["Aylık satın alma","₺284.750","Demo toplam"]])+
  '<div class="grid two">'+card("Satın alma akışı","Bugünkü durum",'<div style="padding:18px">'+flow()+'</div>')+activityCard()+'</div>'+
  '<div style="margin-top:16px">'+card("Yaklaşan işler","Operasyon listesi",table(["İş","Referans","Tarih","Durum"],[
    ["Teklifleri karşılaştır","RFQ-812","Bugün 16:00",pill("5 teklif")],
    ["Sipariş onayı","SP-1028","Bugün 17:30",pill("Onay Bekliyor")],
    ["Teslimat kabul","SP-1042","Yarın 09:00",pill("Yolda")],
    ["Fatura incele","INV-308","Yarın",pill("Eşleşti")]
  ]))+'</div>';
}
function buyerCatalog(meta){
  return pageHead(meta,[{label:"Yeni satın alma listesi",action:"list"},{label:"RFQ oluştur",action:"rfq",primary:true}])+
  '<div class="toolbar"><label class="searchbox"><span>⌕</span><input id="catalogSearch" placeholder="Ürün veya kategori ara"></label><select id="catalogCategory"><option value="">Tüm kategoriler</option>'+Array.from(new Set(PRODUCTS.map(function(p){return p.cat;}))).map(function(c){return '<option>'+esc(c)+'</option>';}).join("")+'</select></div>'+
  '<div class="product-grid" id="catalogGrid">'+PRODUCTS.map(productCard).join("")+'</div>';
}
function buyerMatching(meta){
  return pageHead(meta,[{label:"Metin listesi",action:"list-text"},{label:"Fotoğraf yükle",action:"list-photo",primary:true}])+guardNote()+
  '<div class="grid two">'+card("Liste / fotoğraf yükle","Eşleşme adayı üretir, otomatik ikame yapmaz",
    '<div style="padding:18px"><div class="field"><label>Dosya seç</label><input id="matchFile" type="file" accept=".txt,.csv,image/*"></div><div id="matchResult" class="alert info" style="margin-top:12px">Dosya seçildiğinde demo eşleşme adayları burada görünür.</div></div>'
  )+card("İnceleme kuyruğu","İnsan onayı gereken adaylar",
    table(["Aday","Güven","Durum"],[
      ["Donuk Patates 2.5 kg","%96",pill("PENDING")],["Ayçiçek Yağı 18 L","%92",pill("PENDING")],["Dilim Cheddar","%88",pill("REVIEW")]
    ])
  )+'</div>';
}
function buyerRFQ(meta){
  return pageHead(meta,[{label:"RFQ oluştur",action:"rfq",primary:true}])+
  kpis([["Açık talepler","8","3 bugün kapanıyor"],["Gelen teklif","27","Olgusal alanlar"],["Karşılaştırma","5","İnsan seçimi"],["Ort. yanıt","2,4 saat","Demo SLA"]])+
  card("Açık RFQ talepleri","Tedarikçi daveti ve teklif durumu",table(["RFQ","Ürün","Miktar","Son tarih","Durum","İşlem"],RFQS.map(function(r){return ['<strong>'+r.id+'</strong>',r.item,r.qty,r.deadline,pill(r.status),'<button class="btn small" data-action="compare" data-label="'+r.id+'">Karşılaştır</button>'];})))+
  '<div style="margin-top:16px">'+guardNote()+'</div>';
}
function buyerCart(meta){
  const rows=state.cart.map(function(c){const p=PRODUCTS.find(function(x){return x.id===c.id;});return ['<strong>'+p.name+'</strong>',p.unit,String(c.qty),p.min?money(p.min):"Teklif",'<button class="btn small danger" data-action="remove-cart" data-id="'+p.id+'">Kaldır</button>'];});
  return pageHead(meta,[{label:"Satın alma onayına gönder",action:"approval",primary:true}])+guardNote()+
  card("Sepet kalemleri","Sipariş henüz oluşmadı",table(["Ürün","Birim","Miktar","Fiyat sinyali",""],rows.length?rows:[["Sepet boş","","","",""]]))+
  '<div style="margin-top:16px" class="grid two">'+card("Onay politikası","Demo four-eyes kontrolü",
    '<div style="padding:18px"><div class="metric-row"><div><strong>₺25.000 altı</strong><small>Tek satın alma yetkilisi</small></div>'+pill("Kural aktif")+'</div><div class="metric-row"><div><strong>₺25.000+</strong><small>İkinci onaylayan zorunlu</small></div>'+pill("Four-eyes")+'</div></div>'
  )+activityCard()+'</div>';
}
function buyerOrders(meta){
  return pageHead(meta,[{label:"Sipariş filtresi",action:"filter"}])+kpis([["Aktif","12","Snapshot kayıtlı"],["Yolda","4","ETA takip"],["Bu ay teslim","31","Receiving tamam"],["Açık RMA","2","İnceleme"]])+
  card("Siparişler","State machine görünümü",table(["Sipariş","Tedarikçi","Tutar","Tarih","Durum",""],ORDERS.map(function(o){return ['<strong>'+o.id+'</strong>',o.party,o.amount,o.date,pill(o.status),'<button class="btn small" data-action="order-detail" data-label="'+o.id+'">Detay</button>'];})));
}
function buyerDelivery(meta){
  return pageHead(meta,[{label:"Mal kabul aç",action:"receiving",primary:true}])+
  card("Teslimatlar","ETA ve receiving",table(["Sipariş","Tedarikçi","ETA","Kapasite","Durum"],[
    ["SP-1042","Kuzey Deniz Ürünleri","30 Eyl 09:00","Soğuk araç",pill("Yolda")],
    ["SP-1048","Marmara Gıda","30 Eyl 13:00","Standart",pill("Hazırlanıyor")],
    ["SP-1039","Profesyonel Donuk","29 Eyl 10:30","Donuk araç",pill("Teslim Edildi")]
  ]))+
  '<div style="margin-top:16px">'+card("Receiving / RMA","Kabul, kısmi kabul ve ret akışı",
    '<div style="padding:18px">'+flow()+'</div>'
  )+'</div>';
}
function buyerInvoices(meta){
  return pageHead(meta,[{label:"Fatura detayı",action:"invoice"}])+kpis([["Eşleşen","18","3-way match"],["İncelemede","3","Fark var"],["Toplam","₺126.480","Bu ay"],["Kanıt","%100","Sipariş + kabul"]])+
  card("Faturalar","Sipariş / receiving / fatura eşleştirme",table(["Fatura","Tedarikçi","Sipariş","Tutar","Eşleşme"],[
    ["INV-308","Marmara Gıda","SP-1039","₺21.540",pill("Eşleşti")],
    ["INV-304","Kuzey Deniz","SP-1032","₺12.760",pill("İncelemede")],
    ["INV-299","Şef Süt","SP-1022","₺9.860",pill("Eşleşti")]
  ]));
}
function reports(meta){
  return pageHead(meta,[{label:"Excel dışa aktar",action:"export"},{label:"PDF oluştur",action:"export",primary:true}])+
  kpis([["Toplam hacim","₺1,84 Mn","Son 90 gün"],["Sipariş","184","+%8"],["Teslimat SLA","%96,4","+%1,2"],["RFQ dönüşüm","%71","+%4"]])+
  '<div class="grid two">'+card("Satın alma hacmi","Son 8 hafta",'<div class="chart">'+[48,63,54,72,68,82,75,91].map(function(v,i){return '<div class="bar" style="height:'+v+'%"><span>H'+(i+1)+'</span></div>';}).join("")+'</div>')+
  card("Metrik sözlüğü","Tanımlı ölçümler",'<div style="padding:18px"><div class="metric-row"><div><strong>RFQ dönüşüm</strong><small>Teklif gelen RFQ / toplam RFQ</small></div><b>%71</b></div><div class="metric-row"><div><strong>On-time delivery</strong><small>SLA içinde teslim / teslimat</small></div><b>%96,4</b></div><div class="metric-row"><div><strong>Invoice match</strong><small>3-way match PASS / fatura</small></div><b>%91</b></div></div>')+'</div>';
}
function identity(meta,role){
  return pageHead(meta,[{label:"Kullanıcı davet et",action:"invite",primary:true}])+guardNote()+
  card("Üyelikler","Rol ve scope",table(["Kullanıcı","Rol","Kapsam","MFA","Durum"],[
    ["Hasan Kaya",role||"Business Admin","Tüm işletme",pill("Açık"),pill("Aktif")],
    ["Satın Alma 1","Requester","Şube: Merkez",pill("Açık"),pill("Aktif")],
    ["Onay Yetkilisi","Approver","Şube: Merkez",pill("Açık"),pill("Aktif")],
    ["Rapor Kullanıcısı","Reporter","Salt okunur",pill("Opsiyonel"),pill("Aktif")]
  ]))+
  '<div style="margin-top:16px">'+card("Güvenlik oturumları","Demo session görünümü",table(["Cihaz","Son aktivite","IP sınıfı","Durum"],[
    ["Mac / Chrome","Şimdi","Kurumsal",pill("Aktif")],["iPhone","2 saat önce","Mobil",pill("Aktif")]
  ]))+'</div>';
}
function genericHelpContent(){
  return '<div class="grid three">'+[
    ["Başlangıç","Katalog → RFQ → Teklif → Sepet → Sipariş akışı"],
    ["Yetki & Onay","Rol, scope, MFA ve four-eyes mantığı"],
    ["Teslimat","ETA, receiving, kısmi kabul ve RMA"],
    ["Fatura","3-way match ve kanıt zinciri"],
    ["Raporlama","Metrik sözlüğü ve export işleri"],
    ["Destek","Vaka açma ve çağrı merkezi akışı"]
  ].map(function(x){return '<button class="card pad" data-action="help-topic" data-label="'+x[0]+'" style="text-align:left"><h3>'+x[0]+'</h3><p style="color:var(--muted)">'+x[1]+'</p></button>';}).join("")+'</div>';
}
function buyerGeneric(meta,label){
  const rows=[
    [label+" kaydı #01","Merkez şube",pill("Aktif"),'<button class="btn small" data-action="detail" data-label="'+label+' #01">Detay</button>'],
    [label+" kaydı #02","Kadıköy",pill("İncelemede"),'<button class="btn small" data-action="detail" data-label="'+label+' #02">Detay</button>'],
    [label+" kaydı #03","Beşiktaş",pill("Aktif"),'<button class="btn small" data-action="detail" data-label="'+label+' #03">Detay</button>']
  ];
  return pageHead(meta,[{label:"Yeni kayıt",action:"generic-create",primary:true}])+kpis([["Aktif kayıt","18","Demo veri"],["Bekleyen","3","İnceleme kuyruğu"],["Bu hafta","+6","Yeni hareket"],["Kapsam","3 şube","Scope kontrollü"]])+
    card(label,"Operasyon görünümü",table(["Kayıt","Kapsam","Durum",""],rows))+'<div style="margin-top:16px">'+architectureCoverage(meta)+'</div>';
}

function supplierHome(meta){
  return pageHead(meta,[{label:"Teklif taleplerine git",action:"supplier-rfq",primary:true}])+kpis([["Bekleyen RFQ","14","5 bugün"],["Aktif teklif","38","+7"],["Hazırlanan sipariş","7","2 SLA yakın"],["Aylık ciro","₺624.300","Demo"]])+
  '<div class="grid two">'+card("Operasyon kuyruğu","Öncelikli işler",table(["İş","Referans","Durum"],[
    ["RFQ yanıtla","RFQ-812",pill("Bekliyor")],["Sipariş hazırla","SP-1048",pill("Hazırlanıyor")],["Stok güncelle","P-001",pill("İncelemede")],["Fatura yükle","SP-1039",pill("Hazır")]
  ]))+activityCard()+'</div>';
}
function supplierRFQ(meta){
  return pageHead(meta,[{label:"Teklif oluştur",action:"supplier-quote",primary:true}])+guardNote()+
  card("Davetli RFQ talepleri","Yalnız yetkili tedarikçi davetleri",table(["RFQ","Ürün","Miktar","Son tarih","Durum",""],RFQS.map(function(r){return ['<strong>'+r.id+'</strong>',r.item,r.qty,r.deadline,pill(r.status.includes("teklif")?"Açık":"İncelemede"),'<button class="btn small" data-action="supplier-quote" data-label="'+r.id+'">Teklif Ver</button>'];})));
}
function supplierProducts(meta){
  return pageHead(meta,[{label:"Ürün teklifi ekle",action:"supplier-product",primary:true}])+
  '<div class="product-grid">'+PRODUCTS.slice(0,8).map(function(p){return '<article class="product-card"><div class="product-media">'+p.emoji+'</div><div class="product-body"><span class="pill">'+p.unit+'</span><h3>'+p.name+'</h3><p>Master katalog eşleşmesi · '+p.cat+'</p><div class="product-price">'+(p.min?money(p.min):"Teklif bazlı")+'</div><div class="inline" style="gap:7px"><button class="btn small" data-action="edit-product" data-label="'+p.name+'">Düzenle</button>'+pill("Yayında")+'</div></div></article>';}).join("")+'</div>';
}
function supplierPrice(meta){
  return pageHead(meta,[{label:"Fiyat güncelle",action:"price-update",primary:true}])+guardNote()+
  card("Fiyat listesi","Değişiklikler auditlidir",table(["Ürün","Net fiyat","Vergi","Geçerlilik","Durum"],PRODUCTS.slice(0,7).map(function(p){return [p.name,p.min?money(p.min):"Teklif","%10","30 Eyl 23:59",pill("Aktif")];})));
}
function supplierStock(meta){
  return pageHead(meta,[{label:"Toplu stok işi",action:"bulk",primary:true}])+
  card("Stok sinyalleri","Rezervasyon etkisi dahil demo görünüm",table(["Ürün","Kullanılabilir","Rezerve","Sinyal",""],PRODUCTS.slice(0,8).map(function(p){return [p.name,String(p.stock),String(Math.round(p.stock*.14)),pill(p.stock>100?"İyi":"Düşük"),'<button class="btn small" data-action="stock-update" data-label="'+p.name+'">Güncelle</button>'];})));
}
function supplierOrders(meta){
  return pageHead(meta,[{label:"Hazırlık güncelle",action:"order-status",primary:true}])+
  card("Sipariş kuyruğu","Snapshot üzerinden çalışır",table(["Sipariş","Alıcı","Tutar","Tarih","Durum",""],ORDERS.map(function(o){return ['<strong>'+o.id+'</strong>',"Demo İşletme",o.amount,o.date,pill(o.status),'<button class="btn small" data-action="order-detail" data-label="'+o.id+'">Aç</button>'];})));
}
function supplierDelivery(meta){
  return pageHead(meta,[{label:"Teslimat planla",action:"delivery-plan",primary:true}])+kpis([["Bugün","4 rota","2 soğuk zincir"],["Yarın","7 rota","Kapasite %68"],["SLA","%96,8","+%0,6"],["İstisna","2","Operasyon kontrolü"]])+
  card("Teslimat takvimi","Bölge / kapasite / ETA",table(["Rota","Bölge","Pencere","Kapasite","Durum"],[
    ["R-214","Avrupa Yakası","09:00–12:00","%74",pill("Planlandı")],["R-218","Anadolu Yakası","12:00–16:00","%62",pill("Açık")],["R-221","Merkez","16:00–19:00","%83",pill("İncelemede")]
  ]));
}
function supplierInvoices(meta){
  return pageHead(meta,[{label:"Fatura yükle",action:"invoice-upload",primary:true}])+
  card("Tedarikçi faturaları","Üçlü eşleşme sonucu",table(["Fatura","Sipariş","Tutar","Yükleme","Durum"],[
    ["INV-308","SP-1039","₺21.540","29 Eyl",pill("Eşleşti")],["INV-311","SP-1042","₺12.760","29 Eyl",pill("İncelemede")],["INV-315","SP-1048","₺18.420","Taslak",pill("DRAFT")]
  ]));
}
function supplierFinance(meta,type){
  return pageHead(meta,[{label:type==="commission"?"Komisyon detayı":"Mutabakat aç",action:"finance",primary:true}])+guardNote()+
  kpis([["Brüt hacim","₺624.300","Bu ay"],["Komisyon","₺18.729","Ledger tahakkuk"],["Mutabakat farkı","₺0","Son batch"],["Açık kalem","2","İnceleme"]])+
  card(type==="commission"?"Komisyon tahakkukları":"Cari / mutabakat","Immutable ledger görünümü",table(["Referans","Dönem","Tutar","Durum"],[
    ["LED-908","Eylül","₺8.420",pill("POSTED")],["LED-901","Eylül","₺5.870",pill("POSTED")],["REC-184","Eylül","₺0 fark",pill("RECONCILED")]
  ]));
}
function supplierGeneric(meta,label){
  return pageHead(meta,[{label:"Yeni işlem",action:"generic-create",primary:true}])+kpis([["Aktif","24","Demo"],["Bekleyen","4","İş kuyruğu"],["SLA","%96","Operasyon"],["Audit","%100","Kayıtlı"]])+
  card(label,"Tedarikçi operasyonu",table(["Kayıt","Kapsam","Güncelleme","Durum"],[
    [label+" #01","Firma geneli","Şimdi",pill("Aktif")],[label+" #02","Depo 1","22 dk önce",pill("İncelemede")],[label+" #03","İstanbul","1 saat önce",pill("Aktif")]
  ]))+'<div style="margin-top:16px">'+architectureCoverage(meta)+'</div>';
}

function adminHome(meta){
  return pageHead(meta,[{label:"Release kontrolü",action:"release",primary:true}])+guardNote()+
  kpis([["Quality Gate","PASS","#255 SUCCESS"],["Phase","0–18","Engineering complete"],["Açık PR","0","Ana dal temiz"],["Production","LOCKED","External gates"]])+
  '<div class="grid two">'+card("Ticari omurga","Uçtan uca görünürlük",'<div style="padding:18px">'+flow()+'</div>')+
  card("Release gate özeti","Gerçek kanıt gerektirir",'<div class="release-gates" style="padding:18px">'+["PRIVATE_PILOT","DEFECT_CLOSURE","SECURITY_REVIEW","RESTORE_VERIFICATION","LOAD_VERIFICATION","LEGAL_REVIEW","ACCOUNTING_REVIEW","PRIVACY_REVIEW"].map(function(g){return '<div class="gate"><span class="box"></span><div><strong>'+g+'</strong><small>Evidence reference zorunlu</small></div>'+pill("PENDING")+'</div>';}).join("")+'</div>')+'</div>'+
  '<div style="margin-top:16px">'+card("Modül sağlık haritası","Architecture Lock v3",table(["Alan","Phase","Durum","Kontrol"],[
    ["Identity / RBAC","1",pill("PASS"),"MFA · Scope · Audit"],["Catalog / PIM","3",pill("PASS"),"Admin · API · Events"],["Pricing / Stock","4",pill("PASS"),"Tax · Reservation · SLA"],["RFQ / Order","6–8",pill("PASS"),"Snapshot · Outbox"],["Delivery / Invoice","9–10",pill("PASS"),"Receiving · 3-way"],["Ledger / Reporting","11–12",pill("PASS"),"Immutable · Jobs"],["Support / Ads / Integrations","13–15",pill("PASS"),"Case · Radar · Webhook"],["Security / Release","16–18",pill("External gates"),"Privacy · Restore · Evidence"]
  ]))+'</div>';
}
function adminCommerce(meta){
  return pageHead(meta,[{label:"Sipariş ara",action:"filter"},{label:"Vaka aç",action:"support",primary:true}])+kpis([["Açık RFQ","24","Platform"],["Aktif sipariş","68","State machine"],["Yolda","19","ETA"],["Fatura farkı","3","Review"]])+
  card("Ticaret akışı","RFQ → fatura",table(["Referans","Tür","Taraflar","Tutar","Durum"],[
    ["RFQ-812","RFQ","Demo İşletme ↔ 5 tedarikçi","-",pill("5 teklif")],["SP-1048","Sipariş","Demo İşletme ↔ Marmara","₺18.420",pill("Hazırlanıyor")],["DLV-742","Teslimat","Kuzey Deniz","₺12.760",pill("Yolda")],["INV-308","Fatura","Marmara","₺21.540",pill("Eşleşti")]
  ]))+'<div style="margin-top:16px">'+activityCard()+'</div>';
}
function adminCatalog(meta){
  return pageHead(meta,[{label:"Master ürün ekle",action:"admin-product",primary:true},{label:"Veri kalite kuyruğu",action:"data-quality"}])+kpis([["Master ürün","1.284","Demo"],["Kategori","48","Yayınlı"],["Veri kalite","%97,2","+%0,4"],["Eşleşme bekleyen","16","Review"]])+
  card("Master katalog","PIM ve veri kalite",table(["Ürün","Kategori","Tedarikçi teklifi","Kalite","Durum"],PRODUCTS.slice(0,8).map(function(p){return ['<strong>'+p.name+'</strong>',p.cat,String(p.offers),pill(p.offers>6?"PASS":"REVIEW"),pill("PUBLISHED")];})))+
  '<div style="margin-top:16px">'+architectureCoverage(meta)+'</div>';
}
function adminPriceStock(meta){
  return pageHead(meta,[{label:"Fiyat kuralı",action:"price-rule",primary:true},{label:"Rezervasyonlar",action:"reservation"}])+kpis([["Aktif fiyat","842","TRY"],["Stok sinyali","1.104","Supplier"],["Rezervasyon","76","Açık"],["SLA kuralı","18","Bölgesel"]])+
  card("Fiyat / stok istisnaları","Operasyonel kontrol",table(["Kayıt","Alan","Değer","Durum","İşlem"],[
    ["PRC-088","Donuk Patates","₺1.280–1.460",pill("Aktif"),'<button class="btn small" data-action="detail" data-label="PRC-088">Aç</button>'],
    ["STK-211","Levrek Fileto","95 kg",pill("Düşük"),'<button class="btn small" data-action="detail" data-label="STK-211">Aç</button>'],
    ["RSV-061","SP-1048","18 koli",pill("Rezerve"),'<button class="btn small" data-action="detail" data-label="RSV-061">Aç</button>']
  ]));
}
function adminDelivery(meta){
  return pageHead(meta,[{label:"Bölge kuralı",action:"delivery-rule",primary:true}])+kpis([["Aktif rota","38","Bugün"],["On-time","%96,4","+%1,2"],["Receiving","17","Bugün"],["Açık RMA","5","Review"]])+
  card("Teslimat operasyonu","ETA, receiving ve RMA",table(["Referans","Bölge","ETA","Kabul","Durum"],[
    ["DLV-742","Kadıköy","09:30","Bekliyor",pill("Yolda")],["DLV-739","Beşiktaş","11:00","Tam kabul",pill("Teslim Edildi")],["RMA-052","Beykoz","-", "Kısmi ret",pill("İncelemede")]
  ]));
}
function adminEntities(meta,label){
  return pageHead(meta,[{label:"Yeni "+(label==="İşletmeciler"?"işletme":"tedarikçi"),action:"entity-create",primary:true}])+kpis([["Aktif","126","Doğrulanmış"],["Onboarding","9","Review"],["Risk sinyali","3","İnceleme"],["SLA ort.","%96","Demo"]])+
  card(label,"Kimlik / üyelik / durum",table(["Kayıt","Tip","Bölge","Üyelik","Durum"],[
    ["Mavi Masa","İşletme","İstanbul","4 kullanıcı",pill("Aktif")],["Marmara Gıda","Tedarikçi","İstanbul","6 kullanıcı",pill("Doğrulandı")],["Kuzey Deniz","Tedarikçi","İstanbul","3 kullanıcı",pill("Doğrulandı")]
  ]));
}
function adminStudio(meta){
  return pageHead(meta,[{label:"Yeni içerik",action:"content-create",primary:true},{label:"Canlı önizleme",action:"preview"}])+kpis([["Taslak","12","DRAFT"],["İncelemede","4","REVIEW"],["Planlı","3","SCHEDULED"],["Yayında","38","PUBLISHED"]])+
  card("İçerik yaşam döngüsü","Edit → Validate → Preview → Approval → Publish → Audit → Version → Rollback",table(["İçerik","Alan","Versiyon","Durum",""],[
    ["Ana sayfa hero","Public","v18",pill("PUBLISHED"),'<button class="btn small" data-action="detail" data-label="Ana sayfa hero">Aç</button>'],
    ["Donuk kategori banner","Buyer","v7",pill("REVIEW"),'<button class="btn small" data-action="detail" data-label="Donuk kategori banner">Aç</button>'],
    ["Yardım: RFQ","Help","v4",pill("DRAFT"),'<button class="btn small" data-action="detail" data-label="Yardım RFQ">Aç</button>']
  ]));
}
function adminCampaign(meta){
  return pageHead(meta,[{label:"Kampanya oluştur",action:"campaign-create",primary:true}])+guardNote()+
  card("Kampanyalar","Sponsorlu görünürlük açıkça etiketlenir",table(["Kampanya","Tedarikçi","Kapsam","Bütçe","Durum"],[
    ["Donuk ürün görünürlüğü","Profesyonel Donuk","Donuk kategori","₺18.000",pill("Aktif")],["Süt grubu","Şef Süt","Süt & Şarküteri","₺12.500",pill("REVIEW")],["Deniz ürünleri","Kuzey Deniz","Deniz Ürünleri","₺16.000",pill("SCHEDULED")]
  ]));
}
function adminRadar(meta){
  return pageHead(meta,[])+guardNote()+
  kpis([["Kategori hareketi","+%8,4","Gözlemsel"],["Teklif yoğunluğu","1,18x","Son 30 gün"],["Stok daralması","4 kategori","Sinyal"],["Otomatik aksiyon","0","Guardrail"]])+
  card("Pazar sinyalleri","Karar değil, gözlemsel veri",table(["Sinyal","Kategori","Değişim","Yorum"],[
    ["Teklif sayısı arttı","Yağ","+%14","İncele"],["Stok sinyali düştü","Deniz Ürünleri","-%9","İncele"],["Fiyat bandı genişledi","Donuk","+%6","İncele"]
  ]));
}
function adminSupport(meta){
  return pageHead(meta,[{label:"Vaka aç",action:"support",primary:true}])+kpis([["Açık vaka","18","3 yüksek"],["İlk yanıt","11 dk","SLA"],["Dispute","4","İnceleme"],["Bugün çağrı","42","+8"]])+
  card("Destek vakaları","Çağrı merkezi ve dispute",table(["Vaka","Kanal","Konu","Öncelik","Durum"],[
    ["CASE-440","Telefon","Teslimat gecikmesi","Yüksek",pill("OPEN")],["CASE-438","Web","Fatura farkı","Orta",pill("REVIEW")],["CASE-431","E-posta","RFQ yardım","Düşük",pill("RESOLVED")]
  ]));
}
function adminContracts(meta){
  return pageHead(meta,[{label:"Sözleşme yükle",action:"contract",primary:true}])+kpis([["Aktif","34","Versiyonlu"],["Kabul bekleyen","6","Taraf onayı"],["Kanıt","%100","Hash/ref"],["Arşiv","18","Immutable ref"]])+
  card("Sözleşme & kanıt","Versiyon ve kabul izi",table(["Belge","Taraf","Versiyon","Kabul","Durum"],[
    ["Tedarikçi Çerçeve","Marmara Gıda","v3","29 Eyl",pill("Aktif")],["KVKK Aydınlatma","Demo İşletme","v5","28 Eyl",pill("Aktif")],["Komisyon Ek Protokol","Kuzey Deniz","v2","Bekliyor",pill("REVIEW")]
  ]));
}
function adminIntegrations(meta){
  return pageHead(meta,[{label:"Webhook ekle",action:"webhook",primary:true},{label:"API istemcisi",action:"api-client"}])+kpis([["API client","7","Scope kontrollü"],["Webhook","12","9 aktif"],["Bulk job","4","Bugün"],["Başarı","%99,4","Test adapter"]])+
  card("Integration Hub","API / webhook / bulk jobs",table(["Entegrasyon","Tür","Son çalışma","Durum",""],[
    ["ERP Demo","Webhook","2 dk önce",pill("Başarılı"),'<button class="btn small" data-action="detail" data-label="ERP Demo">Log</button>'],
    ["Fiyat içe aktar","Bulk Job","18 dk önce",pill("Başarılı"),'<button class="btn small" data-action="detail" data-label="Fiyat içe aktar">Log</button>'],
    ["Accounting Test","API Client","1 saat önce",pill("Aktif"),'<button class="btn small" data-action="detail" data-label="Accounting Test">Aç</button>']
  ]));
}
function adminSecurity(meta){
  return pageHead(meta,[{label:"Security review kaydı",action:"security-review",primary:true}])+guardNote()+
  kpis([["MFA kapsamı","%100","Admin kritik roller"],["Retention policy","18","Aktif"],["Restore test","PENDING","External evidence"],["Load test","PENDING","External evidence"]])+
  '<div class="grid two">'+card("Güvenlik kontrolleri","Phase 16 hardening",'<div style="padding:18px">'+[
    ["Admin MFA","Kritik mutasyonlar","on"],["CSRF","Protected mutation","on"],["Tenant isolation","Scope guard","on"],["Audit","Append-only event trail","on"],["Privacy consent","Location pilot","on"]
  ].map(function(x){return '<div class="switch-row"><div><strong>'+x[0]+'</strong><small>'+x[1]+'</small></div><button class="toggle '+x[2]+'" data-action="toggle"></button></div>';}).join("")+'</div>')+
  card("Release evidence","Kod testi tek başına yeterli değildir",'<div class="release-gates" style="padding:18px">'+["SECURITY_REVIEW","RESTORE_VERIFICATION","LOAD_VERIFICATION","PRIVACY_REVIEW"].map(function(g){return '<div class="gate"><span class="box"></span><div><strong>'+g+'</strong><small>Real evidence required</small></div>'+pill("PENDING")+'</div>';}).join("")+'</div>')+'</div>';
}
function adminAudit(meta){
  return pageHead(meta,[{label:"Filtrele",action:"filter"}])+kpis([["Bugün event","1.248","Append-only"],["Kritik işlem","38","MFA aware"],["Tenant","24","Scoped"],["Export","Job","Yetkili"]])+
  card("Audit akışı","Kim, ne zaman, neyi değiştirdi",table(["Zaman","Aktör","Eylem","Kaynak","Sonuç"],[
    ["11:12","admin@demo","catalog.publish","product:p1",pill("SUCCESS")],["11:08","buyer@demo","rfq.create","RFQ-812",pill("SUCCESS")],["10:56","supplier@demo","stock.update","offer:p1",pill("SUCCESS")],["10:42","system","outbox.dispatch","SP-1048",pill("SUCCESS")]
  ]));
}
function adminEngine(meta){
  const phases=[
    ["0","Mimari / repo / design system"],["1","Identity / RBAC / audit"],["2","Admin / config / CMS / help"],["3","Catalog / PIM / offers"],
    ["4","Pricing / tax / stock / delivery"],["5","Search / buyer / matching"],["6","RFQ / quote"],["7","Cart / approvals"],
    ["8","Order / snapshot / outbox"],["9","Delivery / receiving / RMA"],["10","Invoice / contracts / evidence"],["11","Commission / ledger"],
    ["12","Reporting / exports"],["13","Support / disputes"],["14","Campaign / radar"],["15","Integration Hub"],["16","Security / privacy / restore"],["17","Traceability / location pilot"],["18","Release readiness"]
  ];
  return pageHead(meta,[{label:"Release snapshot",action:"release",primary:true}])+guardNote()+
  kpis([["Engineering","COMPLETE","Phase 0–18"],["Quality","PASS","#255"],["Site modülü","58+","Bu canlı demo"],["Production","LOCKED","Evidence gates"]])+
  card("Phase kapsama matrisi","Engineering baseline",table(["Phase","Alan","Durum","Kural"],phases.map(function(p){return ["Phase "+p[0],p[1],pill("PASS"),p[0]==="18"?"External evidence":"Locked baseline"];})))+
  '<div style="margin-top:16px">'+architectureCoverage(meta)+'</div>';
}
function adminGeneric(meta,label){
  return pageHead(meta,[{label:"Yeni kayıt",action:"generic-create",primary:true}])+kpis([["Aktif","24","Demo"],["Review","4","Approval"],["Audit","%100","Kayıtlı"],["API","Ready","Protected"]])+
  card(label,"Admin kontrol merkezi",table(["Kayıt","Scope","Sahip","Durum",""],[
    [label+" #01","Platform","Admin",pill("Aktif"),'<button class="btn small" data-action="detail" data-label="'+label+' #01">Aç</button>'],
    [label+" #02","İstanbul","Operator",pill("REVIEW"),'<button class="btn small" data-action="detail" data-label="'+label+' #02">Aç</button>'],
    [label+" #03","Tenant 04","Admin",pill("Aktif"),'<button class="btn small" data-action="detail" data-label="'+label+' #03">Aç</button>']
  ]))+'<div style="margin-top:16px">'+architectureCoverage(meta)+'</div>';
}

function renderBuyer(meta,label){
  if(label==="Ana Sayfa")return buyerHome(meta);
  if(label==="Ürün Ara / Katalog"||label==="Kategoriler")return buyerCatalog(meta);
  if(label==="Liste Yükle")return buyerMatching(meta);
  if(label==="Teklifler")return buyerRFQ(meta);
  if(label==="Sepetim")return buyerCart(meta);
  if(label==="Siparişlerim"||label==="Tekrar Sipariş")return buyerOrders(meta);
  if(label==="Teslimatlarım")return buyerDelivery(meta);
  if(label==="Faturalarım")return buyerInvoices(meta);
  if(label==="Raporlarım")return reports(meta);
  if(label==="Kullanıcı & Yetki")return identity(meta,"Business Admin");
  if(label==="Yardım")return pageHead(meta,[{label:"Destek kaydı aç",action:"support",primary:true}])+genericHelpContent();
  return buyerGeneric(meta,label);
}
function renderSupplier(meta,label){
  if(label==="Genel Bakış")return supplierHome(meta);
  if(label==="Teklif Talepleri")return supplierRFQ(meta);
  if(label==="Ürünlerim")return supplierProducts(meta);
  if(label==="Fiyat Merkezi"||label==="Özel Fiyatlar")return supplierPrice(meta);
  if(label==="Stok Merkezi")return supplierStock(meta);
  if(label==="Siparişler")return supplierOrders(meta);
  if(label==="Teslimat")return supplierDelivery(meta);
  if(label==="Faturalar")return supplierInvoices(meta);
  if(label==="Cari Bilgileri")return supplierFinance(meta,"finance");
  if(label==="Komisyon")return supplierFinance(meta,"commission");
  if(label==="Raporlar")return reports(meta);
  if(label==="Personel & Yetki")return identity(meta,"Supplier Admin");
  if(label==="Yardım")return pageHead(meta,[{label:"Destek kaydı aç",action:"support",primary:true}])+genericHelpContent();
  return supplierGeneric(meta,label);
}
function renderAdmin(meta,label){
  if(label==="Genel Bakış")return adminHome(meta);
  if(label==="Ticaret")return adminCommerce(meta);
  if(label==="Katalog")return adminCatalog(meta);
  if(label==="Fiyat & Stok")return adminPriceStock(meta);
  if(label==="Teslimat")return adminDelivery(meta);
  if(label==="İşletmeciler"||label==="Toptancılar")return adminEntities(meta,label);
  if(label==="Üyelik & Yetki")return identity(meta,"Platform Admin");
  if(label==="Vitrin Studio")return adminStudio(meta);
  if(label==="Kampanya & Reklam")return adminCampaign(meta);
  if(label==="Raporlama")return reports(meta);
  if(label==="Pazar Radarı")return adminRadar(meta);
  if(label==="Destek / Çağrı Merkezi")return adminSupport(meta);
  if(label==="Yardım & Site Kılavuzu")return pageHead(meta,[{label:"İçerik oluştur",action:"content-create",primary:true}])+genericHelpContent();
  if(label==="Sözleşmeler")return adminContracts(meta);
  if(label==="Entegrasyonlar")return adminIntegrations(meta);
  if(label==="Güvenlik & KVKK")return adminSecurity(meta);
  if(label==="Audit / Hareketler")return adminAudit(meta);
  if(label==="Engine Room")return adminEngine(meta);
  return adminGeneric(meta,label);
}
function renderPublic(label){
  if(label==="Ana Sayfa")return publicHome();
  if(label==="Kategoriler")return publicCategories();
  if(label==="Tedarikçiler")return publicSuppliers();
  if(label==="Nasıl Çalışır")return publicHow();
  return publicHelp();
}

function routeKey(label){return encodeURIComponent(label).replaceAll("%20","-");}
function parseHash(){
  const raw=location.hash.replace(/^#/,"");
  if(!raw)return {surface:"public",page:"Ana Sayfa"};
  const parts=raw.split("/");
  const surface=NAV[parts[0]]?parts[0]:"public";
  const slug=decodeURIComponent((parts.slice(1).join("/")||"").replaceAll("-"," "));
  const exact=NAV[surface].find(function(x){return x.toLocaleLowerCase("tr-TR")===slug.toLocaleLowerCase("tr-TR");});
  return {surface:surface,page:exact||NAV[surface][0]};
}
function setRoute(surface,page){
  location.hash=surface+"/"+routeKey(page);
}
function renderNav(){
  const nav=document.getElementById("sideNav");
  nav.innerHTML=NAV[state.surface].map(function(label){
    return '<button class="nav-btn '+(label===state.page?"active":"")+'" data-nav="'+esc(label)+'"><span class="nav-icon">'+(ICONS[label]||"•")+'</span><span>'+esc(label)+'</span></button>';
  }).join("");
  document.getElementById("surfaceEyebrow").textContent=SURFACES[state.surface].eyebrow;
  document.getElementById("surfaceTitle").textContent=SURFACES[state.surface].title;
  document.querySelectorAll("[data-surface-tab]").forEach(function(b){b.classList.toggle("active",b.dataset.surfaceTab===state.surface);});
}
function render(){
  const r=parseHash();state.surface=r.surface;state.page=r.page;renderNav();
  let html="";
  if(state.surface==="public")html=renderPublic(state.page);
  else {
    const meta=MODULES[state.surface][state.page]||m(state.page,"Modül görünümü","Architecture Lock","generic");
    if(state.surface==="buyer")html=renderBuyer(meta,state.page);
    if(state.surface==="supplier")html=renderSupplier(meta,state.page);
    if(state.surface==="admin")html=renderAdmin(meta,state.page);
  }
  document.getElementById("page").innerHTML=html;
  document.getElementById("workspace").focus({preventScroll:true});
  closeMobileMenu();
  bindDynamic();
}
function bindDynamic(){
  const search=document.getElementById("catalogSearch");
  const cat=document.getElementById("catalogCategory");
  if(search)search.addEventListener("input",filterCatalog);
  if(cat)cat.addEventListener("change",filterCatalog);
  const file=document.getElementById("matchFile");
  if(file)file.addEventListener("change",function(){
    const box=document.getElementById("matchResult");
    if(!file.files.length)return;
    box.className="alert ok";
    box.innerHTML="<strong>"+esc(file.files[0].name)+" alındı.</strong><br>3 eşleşme adayı üretildi. Adaylar PENDING durumunda ve insan onayı bekliyor.";
    toast("Eşleşme adayları oluşturuldu. Otomatik ürün seçimi yapılmadı.","ok");
  });
}
function filterCatalog(){
  const q=(document.getElementById("catalogSearch")?.value||"").toLocaleLowerCase("tr-TR");
  const c=document.getElementById("catalogCategory")?.value||"";
  document.querySelectorAll("#catalogGrid .product-card").forEach(function(el){
    const p=PRODUCTS.find(function(x){return x.id===el.dataset.product;});
    el.classList.toggle("hidden",!((!q||(p.name+" "+p.cat).toLocaleLowerCase("tr-TR").includes(q))&&(!c||p.cat===c)));
  });
}
function openDrawer(title,body){
  document.getElementById("drawerTitle").textContent=title;
  document.getElementById("drawerBody").innerHTML=body;
  document.getElementById("drawer").classList.add("open");
  document.getElementById("drawer").setAttribute("aria-hidden","false");
  document.getElementById("overlay").classList.add("show");
}
function closeDrawer(){
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("drawer").setAttribute("aria-hidden","true");
  document.getElementById("overlay").classList.remove("show");
}
function formDrawer(title,fields,submitLabel){
  openDrawer(title,'<form id="demoForm"><div class="form-grid">'+fields.map(function(f){return '<div class="field '+(f.full?"full":"")+'"><label>'+esc(f.label)+'</label>'+(f.type==="textarea"?'<textarea name="'+esc(f.name)+'" placeholder="'+esc(f.placeholder||"")+'"></textarea>':'<input name="'+esc(f.name)+'" type="'+esc(f.type||"text")+'" placeholder="'+esc(f.placeholder||"")+'" value="'+esc(f.value||"")+'">')+'</div>';}).join("")+'</div><div class="actions" style="margin-top:18px"><button type="button" class="btn" data-action="drawer-close">Vazgeç</button><button class="btn primary" type="submit">'+esc(submitLabel||"Kaydet")+'</button></div></form>');
  document.getElementById("demoForm").addEventListener("submit",function(e){e.preventDefault();state.activity.unshift(title+" işlemi demo olarak kaydedildi");closeDrawer();toast(title+" kaydedildi. Demo veri dışında gerçek işlem yapılmadı.","ok");});
}
function detailDrawer(title){
  openDrawer(title,'<div class="alert info">Bu ekran canlı demo verisidir. Gerçek API mutasyonu yapılmaz.</div><div class="timeline"><div class="timeline-item"><span class="timeline-dot"></span><div><strong>Oluşturuldu</strong><small>Yetkili kullanıcı · audit ref DEMO-01</small></div></div><div class="timeline-item"><span class="timeline-dot"></span><div><strong>Doğrulandı</strong><small>Scope ve alan kontrolleri geçti</small></div></div><div class="timeline-item"><span class="timeline-dot"></span><div><strong>Güncel durum</strong><small>Demo workspace üzerinde görüntüleniyor</small></div></div></div>');
}
function toast(msg,type){
  const el=document.createElement("div");el.className="toast "+(type||"");el.textContent=msg;document.getElementById("toastRegion").appendChild(el);setTimeout(function(){el.remove();},3600);
}
function handleAction(action,el){
  const label=el.dataset.label||state.page;
  if(action==="add-cart"){
    const id=el.dataset.id;const line=state.cart.find(function(x){return x.id===id;});
    if(line)line.qty++;else state.cart.push({id:id,qty:1});
    state.activity.unshift("Sepete ürün eklendi: "+PRODUCTS.find(function(x){return x.id===id;}).name);
    toast("Ürün sepete eklendi. Sipariş henüz oluşmadı.","ok");return;
  }
  if(action==="remove-cart"){
    state.cart=state.cart.filter(function(x){return x.id!==el.dataset.id;});toast("Kalem sepetten çıkarıldı.","ok");render();return;
  }
  if(action==="favorite"){
    const id=el.dataset.id;if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);toast("Favori listesi güncellendi.","ok");render();return;
  }
  if(action==="rfq"){formDrawer("Yeni RFQ",[{label:"Ürün / ihtiyaç",name:"item",placeholder:"Örn. Donuk Patates 2.5 kg"},{label:"Miktar",name:"qty",placeholder:"20 koli"},{label:"Son teklif zamanı",name:"deadline",type:"datetime-local"},{label:"Not",name:"note",type:"textarea",full:true,placeholder:"Teslimat, kalite veya ambalaj notu"}],"RFQ Taslağı Oluştur");return;}
  if(action==="supplier-quote"){formDrawer("Teklif Oluştur",[{label:"RFQ",name:"rfq",value:label},{label:"Birim fiyat",name:"price",placeholder:"1280"},{label:"Stok",name:"stock",placeholder:"120"},{label:"Geçerlilik",name:"valid",type:"date"},{label:"Teslimat notu",name:"note",type:"textarea",full:true}],"Teklif Taslağını Kaydet");return;}
  if(action==="support"){formDrawer("Destek Vakası",[{label:"Konu",name:"subject"},{label:"Öncelik",name:"priority",value:"Orta"},{label:"Açıklama",name:"body",type:"textarea",full:true}],"Vaka Aç");return;}
  if(action==="invite"){formDrawer("Kullanıcı Davet Et",[{label:"E-posta",name:"email",type:"email"},{label:"Rol",name:"role",placeholder:"Requester / Approver"},{label:"Scope",name:"scope",placeholder:"Merkez şube"}],"Davet Oluştur");return;}
  if(action==="invoice-upload"){formDrawer("Fatura Yükle",[{label:"Sipariş no",name:"order"},{label:"Fatura no",name:"invoice"},{label:"Tutar",name:"amount"},{label:"Dosya referansı",name:"file"}],"Taslak Kaydet");return;}
  if(action==="release"){
    openDrawer("Production Release Gate",'<div class="alert warn"><strong>Production LOCKED.</strong> Aşağıdaki 8 gate gerçek kanıt olmadan PASS yapılamaz.</div><div class="release-gates">'+["PRIVATE_PILOT","DEFECT_CLOSURE","SECURITY_REVIEW","RESTORE_VERIFICATION","LOAD_VERIFICATION","LEGAL_REVIEW","ACCOUNTING_REVIEW","PRIVACY_REVIEW"].map(function(g){return '<div class="gate"><span class="box"></span><div><strong>'+g+'</strong><small>Evidence ref required</small></div>'+pill("PENDING")+'</div>';}).join("")+'</div>');return;
  }
  if(action==="export"){toast("Export işi job kuyruğuna alındı (demo).","ok");return;}
  if(action==="toggle"){el.classList.toggle("on");toast("Ayar demo olarak değiştirildi.","ok");return;}
  if(action==="go-buyer"){setRoute("buyer","Ana Sayfa");return;}
  if(action==="catalog"){setRoute("buyer","Ürün Ara / Katalog");return;}
  if(action==="supplier-rfq"){setRoute("supplier","Teklif Talepleri");return;}
  if(action==="drawer-close"){closeDrawer();return;}
  if(action==="approval"){openDrawer("Satın Alma Onayı",'<div class="alert info">Four-eyes kuralı örnekleniyor. Sipariş bu adımda otomatik oluşmaz.</div>'+table(["Aşama","Rol","Durum"],[["Talep","Requester",pill("Tamam")],["Onay","Approver",pill("Bekliyor")],["PO_READY","System guard",pill("Bekliyor")]]) );return;}
  if(action==="compare"){openDrawer("Teklif Karşılaştırma · "+label,table(["Tedarikçi","Fiyat","Teslimat","Stok","Seçim"],[
    ["Marmara Gıda","₺1.280","Yarın","Var",'<button class="btn small" data-action="detail" data-label="Marmara teklifi">İncele</button>'],
    ["Profesyonel Donuk","₺1.330","Bugün","Var",'<button class="btn small" data-action="detail" data-label="Profesyonel Donuk teklifi">İncele</button>'],
    ["Anadolu Tedarik","₺1.295","2 gün","Sınırlı",'<button class="btn small" data-action="detail" data-label="Anadolu teklifi">İncele</button>']
  ])+'<div class="alert warn" style="margin-top:14px">Sistem kriterleri gösterir; tedarikçiyi sen seçersin.</div>');return;}
  if(["detail","order-detail","edit-product","stock-update","invoice","filter","preview","data-quality","reservation","help-topic"].includes(action)){detailDrawer(label);return;}
  const forms={
    "list":"Satın Alma Listesi","list-text":"Metin Listesi","list-photo":"Fotoğraf Eşleşme","receiving":"Mal Kabul","generic-create":"Yeni Kayıt",
    "supplier-product":"Ürün Teklifi","price-update":"Fiyat Güncelle","bulk":"Toplu İş","order-status":"Sipariş Durumu","delivery-plan":"Teslimat Planı",
    "finance":"Finans İşlemi","admin-product":"Master Ürün","price-rule":"Fiyat Kuralı","delivery-rule":"Teslimat Kuralı","entity-create":"Yeni Taraf",
    "content-create":"İçerik","campaign-create":"Kampanya","contract":"Sözleşme","webhook":"Webhook","api-client":"API İstemcisi","security-review":"Security Review"
  };
  if(forms[action]){formDrawer(forms[action],[{label:"Başlık / referans",name:"title"},{label:"Kapsam",name:"scope"},{label:"Açıklama",name:"body",type:"textarea",full:true}], "Taslak Kaydet");return;}
  detailDrawer(label);
}
function closeMobileMenu(){document.getElementById("sidebar").classList.remove("open");document.getElementById("overlay").classList.remove("show");}
function openMobileMenu(){document.getElementById("sidebar").classList.add("open");document.getElementById("overlay").classList.add("show");}

document.addEventListener("click",function(e){
  const nav=e.target.closest("[data-nav]");if(nav){setRoute(state.surface,nav.dataset.nav);return;}
  const tab=e.target.closest("[data-surface-tab]");if(tab){setRoute(tab.dataset.surfaceTab,NAV[tab.dataset.surfaceTab][0]);return;}
  const go=e.target.closest("[data-go]");if(go){const p=go.dataset.go.split("|");setRoute(p[0],p[1]);return;}
  const act=e.target.closest("[data-action]");if(act){handleAction(act.dataset.action,act);return;}
});
document.getElementById("drawerClose").addEventListener("click",closeDrawer);
document.getElementById("overlay").addEventListener("click",function(){closeDrawer();closeMobileMenu();});
document.getElementById("menuBtn").addEventListener("click",openMobileMenu);
document.getElementById("closeMenuBtn").addEventListener("click",closeMobileMenu);
document.getElementById("notificationBtn").addEventListener("click",function(){openDrawer("Bildirimler",'<div class="timeline">'+state.activity.map(function(x,i){return '<div class="timeline-item"><span class="timeline-dot"></span><div><strong>'+esc(x)+'</strong><small>'+(i+1)*6+' dk önce</small></div></div>';}).join("")+'</div>');});
document.getElementById("profileBtn").addEventListener("click",function(){openDrawer("Demo Oturum",'<div class="alert info">Bu canlı site Architecture Lock v3 kapsamındaki birleşik demo workspace’tir. Gerçek müşteri/veri mutasyonu yapmaz.</div>'+table(["Alan","Değer"],[["Rol",state.surface==="admin"?"Platform Admin":state.surface==="supplier"?"Supplier Admin":"Business Admin"],["MFA","Açık"],["Environment","GitHub Pages demo"],["Production",pill("LOCKED")]]) );});
document.getElementById("globalSearch").addEventListener("keydown",function(e){
  if(e.key!=="Enter")return;const q=e.currentTarget.value.trim().toLocaleLowerCase("tr-TR");if(!q)return;
  const moduleHits=[];Object.keys(NAV).forEach(function(s){NAV[s].forEach(function(p){if(p.toLocaleLowerCase("tr-TR").includes(q))moduleHits.push([s,p]);});});
  const productHits=PRODUCTS.filter(function(p){return (p.name+" "+p.cat).toLocaleLowerCase("tr-TR").includes(q);});
  openDrawer("Arama Sonuçları",'<div class="alert info">'+(moduleHits.length+productHits.length)+' sonuç bulundu.</div><div class="timeline">'+moduleHits.map(function(h){return '<button class="nav-btn" data-go="'+h[0]+'|'+h[1]+'"><span class="nav-icon">⌘</span>'+h[1]+'</button>';}).join("")+productHits.map(function(p){return '<button class="nav-btn" data-go="buyer|Ürün Ara / Katalog"><span class="nav-icon">'+p.emoji+'</span>'+p.name+'</button>';}).join("")+'</div>');
});
window.addEventListener("hashchange",render);
if(!location.hash)location.hash="public/"+routeKey("Ana Sayfa");else render();
