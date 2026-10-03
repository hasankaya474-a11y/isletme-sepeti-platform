# Okyanus EDT DENİZ / ZAMAN R40 — 3 Ekim 2026

Altı uzman denetimiyle, en son Türkçe karakter düzeltmesi bulunan R39 kaynaklarından hazırlanmış ayrı çalışma sürümü. Canlıya dağıtılmadı; ana dal birleştirilmedi. İşletme Sepeti kodları değiştirilmedi.

## Tam kodlar

- `DENIZ_R40_TAM_KOD.txt` / `deniz.mjs`: aynı içerikte, tam müşteri Worker'ı.
- `ZAMAN_R40_TAM_KOD.txt` / `zaman.mjs`: aynı içerikte, tam yönetim Worker'ı.

İki Worker ayrı ayrı uygulanır. Tek dosyada birleştirilmez. Mevcut D1/binding/secret ayarları korunur. GitHub dosyasını **indirerek** metin düzenleyicide açın; tarayıcının çevirdiği kod görünümünden kopyalamayın. Kaynak ASCII güvenli Unicode kaçışları kullanır; çalışma anındaki Türkçe korunur.

## Onarımlar

- 200 benzersiz SEO bağlantısı dört açılır bölümde 50'şer korunur. Türkçe başlıklar, ana sayfa H1/canonical/Open Graph/WebSite bilgileri; API'nin listeyi eksiltmesine karşı koruma.
- Aynı isimli farklı marka/ambalaj ürünlerinin bağlantısı sabit ürün kimliğine dayanır. Detay alanı kaçışları ve bozuk sepet kaydından kurtarma.
- Boş Deniz Ürünleri ve Yeni Ürünler alanları gizlenir; seçilmiş uygun kartlar geldiğinde açılır. Vitrin → sekiz kategori sırası ve mobil üç ürün sütunu korunur. Miktar düğmeleri daha geniş dokunma alanı alır.
- Panelden gelen aktif banner'lar vitrinde uygulanır; boş/pasif liste veya görsel yükleme hatasında onaylı başlangıç vitrini geri gelir. Banner'a özel keyfi 10 sınırı kaldırılır.
- Mevcut çalışan logo/favicon/telefon ikonları korunur. Gerçek sunucu yanıtıyla “Site çevrimiçi” ve kontrol saati gösterilir; hata/çevrimdışı durumu doğru yazılır. Bu, satış ekibinin çevrimiçi olduğu anlamına gelmez.
- HTTPS güvenlik başlıkları ve oturum/yönetim yanıtlarında önbellek engeli eklenir. Yapısal CSP uygulanır; eski inline kodu korumak için script politikası Report-Only'dir, tam nonce geçişi veya güvenlik sertifikası değildir.
- Hakkımızda güncel aktif hizmetlere göre düzenlenir; müşteri ekranındaki geliştirme notları temizlenir. R38 teklif, gelen kutusu, görsel yükleme ve yetki korumaları korunur.

## Doğrulama

`tests/last-results.json`: 16/16 SQLite/VM çapraz kontrol. `tests/seo-status.mjs`: yayımlanmamış sürümde 200 rota, canonical/site haritası, dört bölüm, Türkçe/H1/noindex ve gerçek durum scriptinin başarılı/hatalı/çevrimdışı senaryoları. Sepet/teklif, görsel yükleme, ürün kimliği, banner ve güvenlik testleri ayrıca geçti. Tam test komutları `KONTROL_RAPORU.md` içinde.

Canlı denetimde 200 SEO adresinin tamamı HTTP 200 ve site haritasında; kanıt `reports/live-seo-200.json`. Site açılır, favicon/manifest erişilir. HTTPS teknik bağlantıyı korur; işletmenin ticari güvenilirliği veya bağımsız sertifikasyonu kanıtlanmış değildir.

Gerçek mobil/tablet cihaz testi, canlı yönetici oturumu/ürün kaydetme/yükleme, canlı teklif gönderimi ve Cloudflare CPU/1102 ölçümü bu teslimde yapılmadı. Ayrı yönetim sunucusuna okuma otomatik onay incelemesinde kapsam dışı bulunarak reddedildi. 27 seçili canlı üründe fiyat boştu; fiyat uydurulmadı. Mevcut üçüncü taraf ürün görsellerinin tamamına erişim garantisi verilmez.

## Yeniden üretim ve geri dönüş

`python3 build.py` değişmemiş R39'dan R40'ı tekrar üretir. `checksums.json` tam dosyaların ve başlangıç R39'un SHA-256 değerlerini içerir. Önceki R39/R38 dosyaları değişmeden durur; geri dönüş için önceki Worker dosyaları ve mevcut yapılandırma kullanılır. Bu değişiklik veri tablosu silmez veya üretim verisini değiştirmez. Canlıya geçişten önce iki ayrı test Worker'ında gerçek bindings ile panel → müşteri ekranı kontrolü yapılmalıdır.

## 3 Ekim kapsam onarımı

Ekran görüntüsündeki `Cannot find name commerceClientShell` sorunu giderildi: Hakkımızda renderer fonksiyonu aynı ticaret modülünün kapsamına taşındı. `/hakkimizda` ve `/about` GET/HEAD çalıştırma, Türkçe içerik ve oluşturulan JavaScript kontrolleri eklendi; 16/16 çapraz kontrol geçti. Düzeltilmiş tam DENİZ: `DENIZ_R40_DUZELTILMIS_TAM_KOD.txt`. ZAMAN içeriği değişmedi.
