# Okyanus EDT — R30 / 2 Ekim 2026

Bu sürüm, kullanıcı tarafından 2 Ekim’de gönderilen canlı DENİZ ve ZAMAN kodları temel alınarak hazırlanmıştır. İki Worker mimarisi korunur.

## Güncel tam kodlar

- DENİZ: `dist/deniz-worker.single.js` veya `exports/OKYANUS_DENIZ_FINAL_2026-10-02.txt`
- ZAMAN / ADMIN: `dist/zaman-admin-worker.single.js` veya `exports/OKYANUS_ZAMAN_FINAL_2026-10-02.txt`
- Eski tarihli exports dosyaları arşivdir; güncel dağıtım için kullanılmaz.
- Kaynak monolitler `src/deniz-worker.js` / `src/zaman-admin-worker.js` ile aynı içeriktedir. `npm run build:single` yalnız güncel çıktıları eşitler, iç içe kod üretmez.

## Eksiksiz iş kapsamı

1. Yönetimde seçilen aktif ürünlerin tamamının ana sayfada yayınlanması; seçilmeyenlerin yayınlanmaması; sabit 10/20/500 kart sınırının kaldırılması.
2. Fiyat, indirimli fiyat, açıklama, görsel ve aktiflik değişikliklerinin ortak ticari D1’den okunması.
3. `COMMERCE_DB → ADMIN_DB → DB → eski Türkçe adlar` önceliğinin ticari katmanda eşitlenmesi. Üyelik, oturum ve Dijital Menü motorları korunur.
4. Ürün oluşturma/güncelleme/pasife alma için atomik D1 batch; hatada görünür durum, tekrar kayıt engeli, checkbox geri alma.
5. Günlük yönetim için arama/kategori/sayfalama; yeni ürün formunun kapalı bölüme alınması; hızlı yeni ürün düğmesi.
6. Ürün görseli ekleme/kaldırma; kaldırılan görselin eski otomatik görselle geri gelmemesi; gereksiz gömülü ürün görselleri ve eşleme kodlarının kaldırılması.
7. Yeni görsellerin Worker kodu yerine ZAMAN `MEDIA_STORE` KV’de `studio/UUID.ext` anahtarıyla tutulması. D1’da URL ve medya bilgileri saklanır. `/studio-media/UUID.ext` görseli sunar.
8. Tarayıcıda ürün görsellerini 1600 px, diğer vitrin görsellerini 2400 px üst sınırında küçültme; yalnız daha küçük sonuç oluşursa WebP yükleme; yükleme sırasında kaydetmeyi engelleme.
9. Mobil e-bültenin sayfanın aşağısına taşınması; DOM ve flex sıralamasının birlikte düzeltilmesi.
10. Büyük vitrin, dört görsel ve kategori görsellerinin korunması; telefon/tablette en az 220 px vitrin yüksekliği; mobil/tablette üç ürün kolonu.
11. Alan kaplamayan hafif vitrin hareketi; hover/focus sırasında durma; azaltılmış hareket tercihine uyum.
12. Açılış reklamı, kampanya, kategori, vitrin, medya ve SEO yönetimi; mevcut satış, teklif, fotoğraf, üyelik, KVKK/çerez, PWA ve yardımcı modüllerin regresyon kontrolü.
13. Kaynak/çıktı/TXT sürüm eşitliği; doğru dist hedefleri ve KV/D1 binding dokümantasyonu; GitHub’da tek sürüm teslimi.

## Bağlantı sözleşmesi

DENİZ ve ZAMAN ticari veriler için **aynı D1 kimliğine** bağlanmalıdır. `DB` zaten bu ortak D1 ise yeni binding gerekmez. Ayrı oturum DB’si kullanılan ortamda `ADMIN_DB` veya `COMMERCE_DB` iki Worker’da aynı ticari D1’e bağlanır. Aynı binding adının farklı D1 kimliğine bağlanması yalnız kod değişikliğiyle düzeltilemez.

`MEDIA_STORE` bir **KV namespace** olmalıdır: kod `put/getWithMetadata` kullanır. Mevcut `MEDYA_MAĞAZASI` ve `MEDYA_DEPO` adları desteklenir. Gizli anahtarlar ve gerçek D1/KV kimlikleri depoya yazılmaz.

Ürün görselini kaldırmak kart bağlantısını kaldırır; başka yerde kullanılan medya dosyası otomatik silinmez. Kod temizliği mevcut D1 kayıtlarını veya kullanıcı yüklemelerini topluca silmez. Hero/kategori/banner/logo görselleri korunmuştur.

## Doğrulama

```bash
npm run verify
```

Kontroller; gerçek SQLite ürün kaydı→vitrin okuması, 0/1/28/tümü seçim, farklı DB binding’leri, fiyat null/sıfır/değişiklik, görsel kaldırma, başarısız kayıt, oturum/owner yetkisi, anonim teklif engeli, sepet/teklif, dahili bağlantılar ve tarayıcı JavaScript ayrıştırmasını kapsar.

GitHub kaydı canlı Cloudflare dağıtımı değildir. Canlı D1/KV binding kimlikleri ve canlı görsel yükleme davranışı dağıtım ortamında ayrıca doğrulanmalıdır. Bu çalışma canlı kayıtları değiştirmez.
