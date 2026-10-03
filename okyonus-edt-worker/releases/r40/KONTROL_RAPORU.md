# R40 çapraz kontrol raporu

Altı uzman: SEO, mobil/tablet, müşteri akışları, yönetim/banner, logo/çevrimiçi görünüm, güvenlik. Kaynak: PR78 başı `b6905b3a98121bcc267e28dbcce6eacc48b3a954` içindeki en son R39 tam dosyaları. Canlı başlangıç etiketi R36 resource-fix; GitHub sürümüyle aynı kabul edilmedi.

## Sonuçlar

| Senaryo | Sonuç |
|---|---|
| Canlı 200 SEO adresi + canonical + sitemap | 200/200 açıldı, 200/200 sitemap içinde |
| R40 dört bölüm × 50 benzersiz bağlantı | Geçti |
| Türkçe başlık, H1, canonical, sosyal paylaşım bilgisi | Geçti |
| SQLite/VM müşteri–yönetim çapraz kontrolü | 16/16 |
| 16 seçili ürünün panel → müşteri API aktarımı, seçimi kaldırma, owner-only | Geçti |
| Teklif tekrar/çift gönderim, oturum hatası, miktar/istek sınırı | Geçti |
| Görsel yükleme yetki/imza/hata/mevcut depoya dönüş | Geçti; uzak yükleme mock |
| Aynı ad farklı ürün kimliği ve bozuk sepet | Geçti |
| Banner dolu/boş/pasif/15 adet/unsafe URL | Geçti |
| Boş/dolu/süresi geçmiş koleksiyonlar | Geçti; gerçek cihaz testi ayrı |
| Çevrimiçi gösterge başarılı/hatalı/çevrimdışı | Oluşturulan script VM'de geçti |
| Sağlık GET/HEAD/POST, başlıklar, oturum/admin no-store | Geçti |
| Tam MJS/TXT eşitliği ve ASCII güvenli kaynak | Geçti |

## Çalıştırma

Depo kökünden:

```bash
python3 okyonus-edt-worker/releases/r40/build.py
node --check okyonus-edt-worker/releases/r40/deniz.mjs
node --check okyonus-edt-worker/releases/r40/zaman.mjs
node okyonus-edt-worker/releases/r40/tests/validation.mjs okyonus-edt-worker/releases/r40
node okyonus-edt-worker/releases/r40/tests/seo-status.mjs
node okyonus-edt-worker/releases/r40/tests/cart-tests.cjs okyonus-edt-worker/releases/r40/deniz.mjs
node okyonus-edt-worker/releases/r40/tests/upload-tests.cjs okyonus-edt-worker/releases/r40/zaman.mjs
node okyonus-edt-worker/releases/r40/tests/admin-banner.test.mjs
node okyonus-edt-worker/releases/r40/tests/security-r40.mjs
node okyonus-edt-worker/releases/r40/flows-test.mjs
node okyonus-edt-worker/releases/r40/tests/mobile-collections.cjs
```

Test hatası senaryosunda görülen `INQUIRIES_INSERT_UNSUCCESSFUL`, başarısız kaydın başarı gibi gösterilmediğini kontrol eden beklenen simülasyon çıktısıdır.

## Canlı doğrulama sınırı

R40 canlıya dağıtılmadı. Yerel geçişler canlı yayın kanıtı değildir. Tam mobil cihaz/gerçek yönetici oturumu/gerçek teklif ve görsel yükleme/Cloudflare CPU ölçümü henüz doğrulanmadı. Ayrı workers.dev yönetim hostuna okuma otomatik onay incelemesinde kapsam dışı bulunarak reddedildi; tekrar denenmedi. Ürün fiyatları veya yeni ticari kimlik/adres/sertifika bilgisi uydurulmadı. HTTPS ve sağlık kontrolü sunucu erişimini destekler, ticari güvenilirliği bağımsız olarak kanıtlamaz.

## 3 Ekim kapsam onarımı

Ekran görüntüsündeki `Cannot find name commerceClientShell` sorunu giderildi: Hakkımızda renderer fonksiyonu aynı ticaret modülünün kapsamına taşındı. `/hakkimizda` ve `/about` GET/HEAD çalıştırma, Türkçe içerik ve oluşturulan JavaScript kontrolleri eklendi; 16/16 çapraz kontrol geçti. Düzeltilmiş tam DENİZ: `DENIZ_R40_DUZELTILMIS_TAM_KOD.txt`. ZAMAN içeriği değişmedi.
