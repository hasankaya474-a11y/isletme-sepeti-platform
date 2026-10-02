# Sepet / üyelik / teklif uygulama raporu

Patch: `python work/patch-cart.py <hedef-deniz.mjs>`; yalnızca DENİZ değişir. Shared `work/deniz.mjs` dosyasına uygulanmadı. Marker: `cart-idempotency-v1`.

## Sorun → düzeltme

- Gönderim kilidi oturum sorgusundan sonra kuruluyordu; hızlı çift tık iki sorgu ve iki teklif gönderebilirdi. Kilit ilk await öncesinde kurulur ve her çıkışta finally ile açılır.
- HTTP 2xx içinde `ok:false` veya referansı olmayan bozuk yanıt, sepeti temizleyip başarı gösteriyordu. Hem HTTP hem `ok===true` hem de kayıt referansı gerekir.
- Bağlantı kesildikten sonraki tekrar yeni teklif oluşturabiliyordu. İstek anahtarı ve payload imzası localStorage'da tutulur; aynı içerik aynı anahtarla yeniden gönderilir. Server, oturumdaki user/business ve anahtarı SHA256 ile tek inquiry primary key'e dönüştürür. Existing `inquiries.id` PK ile `INSERT OR IGNORE` atomik olarak tek kayıt oluşturur. Aynı anahtar/değişmiş içerik 409 verir. Bildirim yalnızca yeni insertte gönderilir. Yeni şema veya migration yok; mevcut sözleşmeye yalnızca optional `idempotencyKey`, `duplicate`, `status` eklenir.
- Giriş dönüşünde form alanları kayboluyordu. Kullanıcı/guest kapsamlı draft saklanır, guest draft ilk girişte üye kapsamına aktarılır. Checkbox bilgilendirme onayı tekrar kullanıcı tarafından verilir. Mevcut `/uye?next=%2Fsepet` korunur.
- Oturum servis hatası misafir sanılıp girişe yönlendiriliyordu. 401 dışında oturum hatasında sepet/form korunur ve tekrar deneme mesajı gösterilir.
- Manuel miktar girişi step kuralına oturmuyordu. Sepet miktarı min + step'e yuvarlanır; sonsuz değer min'e dönüşür; duplicate satır toplamı yine normalize edilir. Server canonical min/step/unit kontrol eder, 0.001 hassasiyetini korur.
- Content-Length bulunmazsa büyük body sınırı atlanıyordu. Gerçek UTF8 body uzunluğu da sınırlandırılır.
- Katalog reconciliation kullanıcı cart bootstrap'tan önce eski kullanıcının sepetini değiştirebilirdi. Katalog yükleme/reconciliation `okyAccountReady` tamamlandıktan sonra başlar.

## Çalıştırılan doğrulamalar

`node --check work/cart-check.mjs` geçti. `node work/cart-tests.cjs` geçti.

Gerçek patchten çıkarılan server fonksiyonları VM + fake D1 üzerinde çalıştırıldı:

1. İlk gönderim 201, `ok`, kalıcı id, quoteNo.
2. Aynı gönderim 200 duplicate, aynı id/ref, tek insert.
3. Aynı anahtar farklı not 409, ikinci insert yok.
4. Eşzamanlı iki gönderim 201/200 ve yalnızca bir yeni kayıt.
5. Canonical minimum/step dışındaki miktar 400.
6. Oturumsuz gönderim 401.
7. D1 save failure 503; başarı gösterilmedi/kayıt yok.
8. Gerçek body size sınırı 413.

Gerçek render edilmiş browser script derlendi. Miktar ve localStorage model testleri geçti. Browser VM'de gerçek `onsubmit` iki defa eşzamanlı çağrıldı: tek oturum fetch, ikinci handler gönderim yapmadı. 503 oturum yanıtı redirect yapmadı ve sepet korundu.

## İncelendi; gerçek ortamda test edilmedi

- Canlı D1 deployment, mobil Safari/Chrome, gerçek login/verification ve e-posta gönderimi.
- Gerçek D1 atomic PK davranışı SQLite sözleşmesine dayanır; concurrency testi fake D1 modelidir, Cloudflare ölçümü değildir.
- localStorage engelli/dolu olduğunda draft/anahtar persistence garanti edilemez; mevcut sepet storage davranışı korunur. Normal storage persistence model testlidir.
- Diğer legacy çoklu ürün/fotoğraf/B2B tekrar-teklif ekranları bu patch kapsamına alınmadı. `/api/quote` server dedup yalnızca anahtar sağlayan istemciler içindir; eski keyless clients sözleşme gereği kabul edilir.
- Teklif ana kaydı ADMIN_DB'de, kullanıcı geçmişi DB'de: cross-database atomic transaction yok. Ana kayıt sonrasında history write kesilirse yeniden deneme aynı ana inquiry'yi çoğaltmadan history'yi tekrar dener.
- Mevcut canonical ürün listesi/aktiflik kaynağı ve API origin güvenlik katmanı ayrıca ürün/güvenlik uzmanlarınca incelenmelidir.
