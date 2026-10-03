# ZAMAN ticari yönetim ve gelen kutusu

Tamamlanan 7 günlük bölüm: Kontrol Merkezi, Ürünler ve Fiyatlar, Vitrin, Gelen Kutusu, Teklifler/Müşteriler, Kampanyalar, Ayarlar. Mevcut ayrıntılı ürün, toplu tablo, reklam, kategori, banner, marka, kurallar, teslimat, medya, SEO ve e-bülten ekranları alt bölümlerde korunur. Başlangıçta katalog aktarımı çalıştırılmaz; bölüm açıldığında gerekli veri yüklenir.

Gelen kutusu 3 mevcut kaynağı toplar: inquiries (iletişim/eski teklif), photo_inquiries, b2b_quotes_v1. GET /api/daily-inbox filtreleri: status=WAITING veya NEW/IN_PROGRESS/ANSWERED/COMPLETED, source=contact/photo/quote, q, limit ve offset. Toplam ve durum sayaçları tüm kayıtları sayar; liste sayfalıdır. POST aynı endpoint source/id/status alır. İş durumu oky_daily_inbox_status_v1 ek tablosunda tutulur; fotoğraf transfer/silme durumları ve fiyatlandırma/sipariş durumları değiştirilmez. Durum değişikliği mesaj gönderildiğini iddia etmez. İşlem audit kaydına girer; viewer yazamaz. Mevcut origin/CSRF API geçidi korunur.

Teklifler/Müşteriler ekranı mevcut APIlerden teklif/müşteri listesi ve teklif ürün detayını okur. Yeni fiyatlandırma/sipariş UI yazılmadı; mevcut API davranışı aynen korunur. Fotoğrafın mevcut güvenli indir/sil süreci ve mesaj yanıt ekranına bağlantı vardır. WhatsApp mesaj entegrasyonu kurulmuş değildir.

Testler: Node Worker sözdizimi; commerceAdminPage çıktısındaki inline JavaScript new Function ile derlendi; SQLite üç kaynak birleşimi/durum sayaçları; API boş yanıt; viewer POST ve yetkisiz rol 403. Hepsi geçti. Canlı D1 ve tarayıcı etkileşim testi yapılmadı.

Varsayım: Anayasadaki ortak ticari D1. Birleşik kutu COMMERCE_DB || ADMIN_DB || DB kullanır. Ayrı D1 bağlanırsa tablolar eksik olan kaynaklar gösterilmez; üretimde bindings eşitliği doğrulanmalıdır.

Uygulama: python work/patch-admin.py INPUT.mjs OUTPUT.mjs. Baseline veya shared dosyayı doğrudan değiştirmez. Script tek kez uygulanmalıdır.
