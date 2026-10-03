# R44 kontrol ve onarım

6 ajan mobil, yönetim, akış, güvenlik, performans ve görünüm alanlarında çalıştı; bitiren ajanlar ikinci çapraz kontrol görevlerine geçti.

## Onarılan sorunlar
- Uzun başlıklarla büyüyen ve farklı hizada kalan mobil ürün kartları: 3 telefon / 4 geniş mobil-tablet, iki satır başlık, dengeli görsel ve bilgi alanları, tek satır miktar. İndirim fiyatları için esnek yükseklik.
- Mobilde saklanan site çevrimiçi göstergesi görünür hale getirildi; yalnız sunucu bağlantısını belirtir.
- Tekrarlanan katalog istekleri birleştirildi; yetkili güncel katalog varken eski katalog ayrıca indirilmez. Tekliften önce fiyat/stok zorunlu yenilenir.
- OUT/pasif/kaldırılan ürün ve eski sepet fiyatı kontrolleri düzeltildi. Görsel/fiyat kaldırıldığında eski sepet değerleri geri dönmez.
- Yayın kontrolünün eski R36 sürümünü zorunlu tutması kaldırıldı. Fiyat geçerlilik tarihleri panel ve müşteri tarafında eşitlendi.
- Gerçek PNG yükleme → saklama → ürün görseli → ana sayfa ve banner akışı KV ve R2 ile doğrulandı. Dosya imzası, yetki ve CSRF kontrolleri korunuyor.
- Sadece açık UUID görselleri bir saat önbelleğe alınır; kullanıcı, yönetim ve katalog verileri alınmaz.
- TOCCO EDT-0127 2200g için bilinen hatalı ekran fotoğrafı URL'si üreticinin ambalaj görseliyle eşlenir. Boş veya sonradan seçilen görseller korunur.

## Kanıt ve sınırlar
16/16 birleşik SQLite/VM entegrasyonu; ürün ekleme/değiştirme/görsel/açıklama/fiyat/seçim/pasifleştirme/geri alma; KV/R2 PNG; yayın kontrolü başarı/fark/ağ hatası; stok ve güvenlik; 320/390/599/600/768/1024 CSS kuralları; 200 SEO GET/HEAD geçti. Canlı R43'te 200 SEO adresi ayrıca dışarıdan HTTP200 ile doğrulandı.

R44 canlıya dağıtılmadı. Giriş yapılmış gerçek yönetim hesabıyla canlı veri değiştirilmedi; tüm yazma senaryoları yerel veritabanında yapıldı. Gerçek telefonda R44 görüntüsü dağıtımdan sonra kontrol edilmelidir. Canlı D1/MEDIA_STORE bağlarının doğru kurulması gereklidir. Katalog yanıtı halen yaklaşık3.7MB; ağ/sunucu gecikmesinin tamamı bu kod değişiklikleriyle giderilmiş sayılmaz.

DENIZ_R44_TAM_KOD.txt ve ZAMAN_R44_TAM_KOD.txt bağımsız tam Worker kodlarıdır; ilgili Worker'a ayrı ayrı yüklenir.
