# Okyanus DENİZ / ZAMAN R38

Mevcut tasarım ve ürün verileri korunarak hazırlanan ayrı çalışma sürümü. Canlıya dağıtım yapılmadı. Başlangıç: DENİZ R37, ZAMAN R36.

## Tamamlanan değişiklikler

- Mobilde vitrin → sekiz kategori → seçili ürünler sırası ve üç sütun korunur. Dokunma alanları, başlık, drawer kaydırma ve görsel alanları düzenlendi.
- Katalogda Enter sayfayı yenilemez; ambalaj/SKU aranır; süt ürünlerinin et grubuna yanlış eşlenmesi düzeltildi. Yeni ürünler gerçek new_until verisine göre gösterilir.
- Boş marka/kampanya ekranlarında ürünlere dönüş vardır. Kampanya linkleri ve iletişim formunun başarı/tekrar gönderim kontrolü düzeltildi.
- Sepet ve teklif taslağı korunur; çift tıklama kilidi, kullanıcıya bağlı kalıcı işlem anahtarı ve atomik tekrar gönderim kontrolü eklendi. Miktar, adım, birim ve gerçek istek boyutu doğrulanır.
- Ticari yönetim yedi günlük bölüme ayrıldı. Gelen kutusu iletişim, fotoğraf ve ürün tekliflerini toplar. Yeni / İşlemde / Yanıtlandı / Tamamlandı durumları ayrı ek tabloda saklanır; kaynak sipariş/silme durumları korunur. Ayrı ADMIN_DB/DB/COMMERCE_DB bağlantıları kaynaklarına göre okunur; iletişim/fotoğraf detayları doğru kaynakta açılır ve audit özgün yetki veritabanında kalır. Durum seçimi mesaj göndermez.
- Mevcut 30 görsel/ikon byte korunarak assets klasörüne ayrıldı. DENİZ yaklaşık %46 küçüldü. URLler doğrulanan görsel commitine sabitlendi; eski asset yolları yönlenir. Görselde GitHub ağ bağımlılığı vardır; bu boyut azalması canlı hız veya 1102 çözümünün kanıtı değildir.
- Panelde GitHub yükleme yolu eklendi. Anahtar yoksa mevcut studio-media yükleme yolu kullanılır; eski görseller kaldırılmaz.

## Dosyalar ve uygulama

`deniz.mjs` ve `zaman.mjs` ayrı, tam Worker dosyalarıdır. Aynı içerikte TXT kopyaları da verilir. Önce ayrı test Workerlarında mevcut bindings ve secrets korunarak sınanmalıdır. Bu sürüm ana dalı birleştirmez ve Cloudflare dağıtımı yapmaz. SQL değişiklikleri gelen kutusunun ek durum tablosu ve ayrı mesaj kaynağında eksikse yanıt tablosudur; tablolar ilk yetkili istekte oluşturulur.

GitHub görsel yükleme için ZAMAN secret: `GITHUB_MEDIA_TOKEN` (yalnız hedef depoda Contents write yetkisi). İsteğe bağlı var: `GITHUB_MEDIA_BRANCH`; varsayılan `codex/okyanus-r38-20261002`. Hedef depo `hasankaya474-a11y/isletme-sepeti-platform`, klasör `okyonus-edt-worker/media/uploads/`. Token kodda veya tarayıcıda tutulmaz. JPEG/PNG/WebP imzası ve 8 MB sınırı kontrol edilir; dosya hash ismiyle kaydedilir. Canlı token olmadığı için gerçek yetkili panel yüklemesi yapılmadı.

## Doğrulama ve sınırlar

`node tests/validation.mjs .` — birleştirilmiş sürümde 15/15 kontrol: public routes/HEAD, 8 kategori sırası, üyelik kapısı, gerçek SQLite D1 şeması, tekrar şema hazırlığı, katalog/SEO, 16 seçili ürünün ZAMAN→DENİZ aktarımı, VM sepet miktar/stok/yenileme, public/admin inline JavaScript, gelen kutusu filtre/durum/audit/rol.

`node tests/cart-tests.cjs deniz.mjs` ve `node tests/upload-tests.cjs zaman.mjs` — tekrar/aynı anda gönderim, hata, miktar/boyut, taslak, yükleme yetkisi/imza/hash/HTTP hata ve fallback senaryoları. Harici GitHub API yüklemesi mock ile sınandı.

30 GitHub görselinin erişimi ve SHA-256 içeriği ayrıca doğrulandı. Gerçek cihaz/tarayıcı görsel kontrolü ve canlı Cloudflare CPU/1102 ölçümü yapılmadı: tarayıcı çalıştırılabilir dosyası yoktu. Mevcut kaynak fotoğraf/teklif fiyatlandırma ekranları korunur; yeni Teklifler/Müşteriler özeti salt okunurdur. WhatsApp yazışması entegrasyonu yoktur.

## Geri dönüş

`baseline/deniz-r37.mjs.gz` ve `baseline/zaman-r36.mjs.gz` başlangıç kodlarının kayıpsız sıkıştırılmış kopyalarıdır. `gzip -dc` ile çıkarılır; checksums.json başlangıç ve son dosyaların SHA-256 değerlerini içerir. Kod geri dönüşü ek gelen kutusu durum tablosunu silmez; tablo mevcut kaynak verileri değiştirmez.
