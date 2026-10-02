# Bağımsız doğrulama — 2 Ekim 2026

Çalıştırma: `node work/tests/validation.mjs work` (Node 24, yerleşik `node:sqlite`). Test hedefi başka klasör verilebilir. Shared DENİZ/ZAMAN dosyaları değiştirilmedi.

## İlk ölçüm

`baseline` ve başlangıç `work`: 11/11 senaryo geçti. Bunlar özellik gerilemesini yakalayan yerel kontrollerdir; Cloudflare CPU limiti veya canlı erişim testi değildir.

- Üyeliksiz ana sayfa/katalog/sepet/iletişim/yardım/marka/kampanya/teslimat 200.
- HEAD yanıtlarında gövde yok.
- HTML içinde vitrin ardından sekiz kategori bağlantısı.
- Üyeliksiz teklif 401; yönetim ekranı girişe yönlendiriyor, yönetim API 401.
- Gerçek SQLite adaptörüyle ZAMAN şema oluşturma, transaction destekli D1 batch ve ikinci istekte CREATE tekrarının olmaması.
- Aynı SQLite üzerinden DENİZ katalog, en az sekiz kategori ve 200 SEO bağlantısı.
- Tarayıcı VM içinde kalıcı sepet sayacının yenilemede korunması.
- Katalog VM içinde miktar artırma/azaltma, aynı ürünü toplama, fiyat bilgisi ve stok yok engeli.
- Ana sayfa/katalog/sepet/iletişim tarayıcı scriptlerinin JavaScript sözdizimi doğrulaması.

Ek senaryo sonrası `work`: **12/12**. Gerçek SQLite üzerinde yönetim API ile 16 ürüne ana sayfa seçimi verildi; DENİZ 16 seçili ürün döndürdü, bir seçim kaldırılınca 15 oldu; viewer rolü değiştirmede 403 aldı. Böylece 12 kart sınırı ve rol hatası için regression kapısı kuruldu.

## Sınırlar

D1 adaptörü gerçek SQLite SQL yürütür; Cloudflare D1 ağ/CPU/zaman sınırlarını taklit etmez. `commerceAdminApi` iç fonksiyonu test kopyasında export edilerek owner nesnesiyle çalıştırıldı; bu test gerçek giriş oturumu değildir. VM basit DOM yüzeyi içerir, gerçek ekran geometrisi/scroll/paint doğrulaması değildir. Kurulu yerel Chrome/Chromium/Firefox çalıştırılabilir dosyası bulunamadı. Gerçek mobil/tablet görsel doğrulaması ayrıca gereklidir.

## Entegrasyon

Birleştirilmiş kod geldikten sonra test suite tekrar çalıştırılacak; kalan doğrulanmamış alanlar tam başarılı gibi gösterilmeyecek.

## Birleştirilmiş final doğrulaması

`node work/tests/validation.mjs final`: **14/14 geçti** (2026-10-02 18:53 UTC).

Yeni katalog formu nedeniyle VM fixture içinde eksik `catalogTools` DOM globali ilk çalıştırmada hata verdi. Fixture tamamlandı; Worker koduna müdahale edilmedi.

Ek doğrulamalar:

- Yönetim sayfasının ürettiği tüm inline scriptler sözdizimi kontrolünden geçti.
- Gerçek SQLite ile iletişim/fotoğraf/teklif tablosu birleşimi çalıştı.
- NEW/REVIEWING/PRICED kaynak durumları NEW/IN_PROGRESS/ANSWERED olarak eşlendi.
- Yanıt bekleyenler sayısı durum kaydı sonrasında 2'den 1'e indi.
- ANSWERED kaydı ve audit satırı gerçekten yazıldı.
- Literal `%` ve `_` içeren arama doğru kaçışla tek doğru kaydı buldu.
- Viewer güncellemesi 403; bulunmayan talep 404; sahte durum satırı oluşturulmadı.

Bu sonuç yerel kod/SQLite/VM doğrulamasıdır. Canlı Cloudflare kaynak limitleri, gerçek gönderilen e-posta, tam giriş oturumu ve fiziksel mobil tarayıcı görünümü bu suite ile doğrulanmadı.


## Ayrı D1 binding son doğrulaması

`node final/tests/validation.mjs final`: **15/15 geçti** (2026-10-02 18:59 UTC).

Üç ayrı gerçek SQLite DB kullanıldı: auth/member DB, ADMIN_DB ve COMMERCE_DB. Aynı tablolar ve aynı contact ID ile yanıltıcı kayıtlar eklenerek doğru kaynak seçimi sınandı. Gelen kutusu iletişim/fotoğrafı ADMIN_DB'den, teklifi auth/member DB'den aldı; commerce ve diğer kaynaklardaki sahte kayıtlar çıkmadı. Ayrı kaynaklarda limit/offset sıralaması da doğru kaldı.

Durum güncellemesi doğru source DB'ye yazıldı; mesaj ayrıntısı doğru müşteriyi gösterdi. Mesaj durum değiştirme ve taslak yanıt doğru ADMIN_DB üzerinde çalıştı; gerektiğinde inquiry_replies tablosu oluşturuldu. Fotoğraf ayrıntısı ve view-start doğru ADMIN_DB kaydını açtı. Dört audit kaydı auth DB'ye yazıldı; ADMIN_DB/COMMERCE_DB audit tabloları boş kaldı. Worker dosyaları değiştirilmedi.
