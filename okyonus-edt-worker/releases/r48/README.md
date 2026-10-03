# Okyanus EDT R48 — açılış banner'ı ve fiyat teklifi

DENIZ_R48_TAM_KOD.txt ve ZAMAN_R48_TAM_KOD.txt ayrı Worker'ların tam kodudur. Her TXT ilgili .mjs ile birebir aynıdır; kod parçaları birleştirilmez. R47 hız ve güvenlik düzeltmeleri korunmuştur. Canlı dağıtım yapılmamıştır.

- Açılış banner'ı etkinse ana sayfada DOM hazır olduğunda otomatik gösterilir. Aynı kampanya bir tarayıcı oturumunda bir kez açılır; kapanış/yenileme tekrar penceresi oluşturmaz. Yeni kampanya anahtarı tekrar açılır. R48 oturum anahtarı önceki sürümün kapatma kaydından ayrıdır; eski kayıt ilk açılışı engellemez. “Kampanyayı Gör” ile yeniden açılabilir. Tarayıcı sessionStorage engellerse sayfa içi bellek kullanılır; bu bellek tam yenilemede korunamaz.
- Fiyatı pozitif olmayan ürünlerin “Fiyat için teklif al” metni gerçek type=button oldu. Ana sayfa, katalog ve ürün detayında seçilen miktarı mevcut sepet işleviyle ekler; başarılı eklemeden sonra /sepet açılır. Nihai talep otomatik gönderilmez; üyelik, müşteri bilgileri ve KVKK adımları korunur.
- Oturum/hesap sepeti hazırlığı beklenir; çift dokunma bir kez işlenir. Stok yok, oturum ve yerel kayıt hatalarında yönlendirme yapılmaz. Fiyat uydurulmaz; null fiyat korunur.
- Mobil teklif düğmesi en az44px hedef, tam genişlik ve satır kaydırma kullanır. Telefon3/tablet4 sütun düzeni korunur.
- ZAMAN açılış reklamı durum kutusu false/0/off/FALSE değerlerinde pasif durumunu doğru gösterir; public ile aynı yorum yapılır.

Altı uzman kontrolü: gerçek üretilen JS senaryoları, popup ilk açılış/yenileme/Escape/manuel açılış, fiyat teklifi/tek ekleme/miktar/stok/oturum/kayıt hatası, anonim nihai API401, SQLite fiyat-null/yayınlama/banner ayarları, 16 genel entegrasyon, 1347 katalog kartı, zaman aşımı/toparlanma, mobil CSS ve sözdizimi kontrolleri geçti. Ayrıntılı raporlar ve testler bu klasördedir.

Canlı başlangıç R47 olarak doğrulandı: banner ayarı etkin, otomatik açılış kapalıydı; seçili8ürünün5'inde fiyat yok ve teklif alanı yalnız metindi. Canlıda teklif/ürün/veri yazımı yapılmadı. R48'in canlı çalışması dağıtımdan sonra ayrıca kontrol edilmelidir; gerçek cihaz performansı veya tüm olası hataların yokluğu garantisi verilmez.
