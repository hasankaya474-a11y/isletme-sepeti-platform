# R32 — İki Worker Tam Kod Teslimi

1. DENİZ için `dist/deniz-worker.single.js` / `exports/OKYANUS_DENIZ_FINAL_2026-10-02.txt`.
2. ZAMAN için `dist/zaman-admin-worker.single.js` / `exports/OKYANUS_ZAMAN_FINAL_2026-10-02.txt`.
3. Ticari veri binding önceliği COMMERCE_DB, ADMIN_DB, DB, eski Türkçe adlar. Seçilen ticari binding iki Worker’da aynı D1 kimliğini kullanır. Giriş/oturum motorunun DB bağlantısı korunur.
4. ZAMAN MEDIA_STORE bir KV namespace’idir; R2 ile değiştirilemez. Yüklenen görsel `studio/UUID.ext` olarak KV’de kalır, D1 URL/metadata saklar.
5. Fiyat/görsel/ana sayfa kutusu değiştirildiğinde panel kaydı tamamlar. “Anasayfayı Kontrol Et” seçili ürün kimliği, adı, görseli, açıklaması ve fiyat alanlarını public API ile karşılaştırır; bağlantı veya sürüm uyuşmazlığı görünürdür.
6. Boş ürün görseli kaldırma anlamındadır; gömülü katalog görseli geri getirilmez. Hero/kategori/banner/logo korunur.
7. Yeni kodlar GitHub’a kaydedilmiştir; canlı Cloudflare dağıtımı bu kaydın parçası değildir. Canlı ortamda 0/1/tümü seçimi, fiyat, görsel yükleme/kaldırma, kayıt hatası, mobil/tablet, üyelik ve teklif akışları aynı D1/KV bağlamalarıyla doğrulanır.

Gizli anahtarlar, oturumlar ve gerçek D1/KV kimlikleri dosyalarda bulunmaz. Eski tarihli exports arşivdir; güncel sürüm 2026-10-02/R31’dir. Tarihli dosyaların içindeki sürüm kimliği ve güncel release manifesti birlikte kontrol edilir.

ZAMAN staging şablonunda `MEDIA_STORE`, `[[kv_namespaces]]` altında olmalıdır; `[[r2_buckets]]` altında tanımlanamaz. `PHOTO_TEMP` R2 olarak kalır. `npm run staging:config-check` KV türünü ve staging yer tutucusunu doğrular.

## Şema ve sürüm durumu

Mevcut eklemeli ticari şema dosyaları korunmuştur: `003_commerce_v2.sql`, `004_commerce_extended.sql`, `005_product_meta.sql`, `006_commerce_control_plane.sql`. Bu onarım mevcut şemayı silmez; ZAMAN eksik kolonları ekleyerek uyumluluğu sağlar.

CODE COMPLETE / READY FOR CONTROLLED DEPLOYMENT
Production DENİZ/ZAMAN Workers: NOT DEPLOYED
Production D1: NOT MODIFIED

Ayrı WhatsApp modül bayrağı: hidden flags: WHATSAPP. Ana sayfadaki satış/iletişim WhatsApp bağlantıları ve yeşil WhatsApp simgesi korunur.

### R32 mobil vitrin ve kategoriler

Mobil/tablette ana vitrin → sekiz kategori → seçili ürünler sırası sabittir. Kategoriler dört sütun, iki satırdır; sayfayla birlikte kayar. Eksik/fazla API kategorileri bu sekiz alanı değiştirmez; yönetimde kaydedilen eşleşen ad/görseller korunur. Geniş vitrin görselleri kırpılmadan gösterilir; mobil büyütme kapalıdır. Canlı dağıtım yapılmadı. Sürüm ve dosya SHA değerleri: `docs/RELEASE_R32_2026-10-02.json`.
