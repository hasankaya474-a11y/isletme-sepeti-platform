# Okyanus EDT R47 — açılış ve ürün akışı

DENIZ_R47_TAM_KOD.txt müşteri Worker'ının, ZAMAN_R47_TAM_KOD.txt yönetim Worker'ının birbirinden bağımsız tam kodudur. Her TXT kendi .mjs dosyasıyla birebir aynıdır. Önceki sürümlerin üzerine tek parça uygulanır; iki Worker birleştirilmez. Ürün verisi için silme/migrasyon yapılmaz.

Düzeltmeler:
- Ana sayfanın otomatik reklam penceresi kaldırıldı; kampanya mevcut içerik/bağlantılarıyla “Kampanyayı Gör” üzerinden açılır. Çerez düğmesiyle çakışmaz.
- Mevcut mobil kart CSS'i ilk çizimden önce head'de tek kez uygulanır. Telefon üç, tablet dört sütun korunur.
- Ana sayfa veri isteği yalnız seçilmiş aktif ürünleri getirir; seçili ürün sayısı sınırlandırılmaz. Tam katalog ve sepet isteği korunur. Şema envanteri bir kez okunur; bağımsız okumalar paraleldir. Her istek güncel fiyatı okur, no-store korunur.
- Katalog ilk 48 kartı çizer; “Daha Fazla Ürün Göster” sonraki 48'i mevcut kartların miktarlarını/odağını koruyarak ekler. Arama tüm veri kümesini tarar; görseller lazy/async yüklenir.
- Storefront ve üyelik okumaları 15 saniyelik iptal süresiyle sonsuz beklemeye karşı korunur. Başarısız storefront önbelleği temizlenir, sonraki okumada yeniden denenir. Hata halinde sepet/hesap sahibi değiştirilmez.
- Yönetim, katalog tam ise her açılışta tekrar dokuz aktarım ve özet isteği yapmaz. Tamlık sayıyla değil beklenen ürün kaynak kodlarıyla doğrulanır. Eksik katalog aktarımı ve zorunlu eşitleme çalışır. Marka önerileri formun kaydetme işlevini bekletmez.

Kontrol: altı uzman katkısı ve bağımsız çapraz inceleme; sözdizimi, 16 entegrasyon senaryosu, gerçek SQLite ürün ekleme/güncelleme/yayından kaldırma/yeniden yayınlama/fiyat/görsel, KV/R2 görsel aktarımı, 1347 ürün katalog çizim VM'i, zaman aşımı/toparlanma, kampanya açma/kapama, detay ID/fiyat/kampanya, oturum/yetki ve yükleme kontrolleri geçti. Eski entegrasyon testinin başlatıcı seçicisi yeni gerçek başlatıcıya ve DOM API'lerine uyarlanmıştır; çalışma kodundaki hata gizlenmemiştir.

Ölçüm sınırı: Yerel ana sayfa fixture'ı 324 ürün/215106 karakterden 35 seçili ürün/48831 karaktere indi (~%77). Yönetim tam katalog hazırlığı 10 istekten 1'e indi. Bunlar kontrollü testlerdir; canlı cihaz hız garantisi değildir. Canlı R45 ana sayfa ve ürün HTML'i araç ağında ~10 saniye ilk yanıt verdi. Ürün HTML'i kod yolunda sıfır DB sorgusu yapar; kalan ağ/Cloudflare/çalışma ortamı gecikmesinin kaynağı bu testlerle kanıtlanmadı. Cloudflare hesap metriklerine erişmeden kök neden kesinleştirilemez.

R47 canlıya dağıtılmadı; kullanıcı iki TXT'yi kendi Worker'larına dağıtır. Canlı yönetimde ürün/veri değiştirilmedi. Dağıtım sonrasında PC ve gerçek mobil cihaz açılışı, ürün görselinden detay ve yönetim kaydetme akışı yeniden kontrol edilmelidir. SEO 200 bağlantı/4 modül ve mevcut güvenlik kontrolleri korunur.
