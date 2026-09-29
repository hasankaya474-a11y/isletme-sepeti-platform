# Okyanus EDT Worker New Face v1

Gerçek Cloudflare Worker kaynak paketi. Demo HTML değildir.

## Hedefler
- `src/deniz-worker.js` -> DENİZ public/sales Worker
- `src/zaman-worker.js` -> ZAMAN/ADMIN yönetim Worker
- ortak D1 veri omurgası
- mevcut çalışan e-posta gönderim binding sözleşmesini koruma
- `/api/quote`, `/api/contact`, `/api/photo-inquiries` sözleşmelerini koruma
- satış odaklı yeni Okyanus yüzü
- COST, COST Radar, Akademi, ÇEŞNİ public tarafta pasif
- Dijital Menü aktif, minimum 30 tema + 30 şablon
- Yardım yalnız aktif modülleri gösterir

## Kritik koruma kuralları
1. Teklif, mesaj ve fotoğraf önce D1'e kaydedilir; e-posta bildirimi başarısız olsa bile kayıt kaybolmaz.
2. `EMAIL.send({to,from,replyTo,subject,text})` mevcut binding sözleşmesi korunur.
3. Fotoğraf JPEG/PNG/WebP imzası doğrulanmadan medya deposuna kabul edilmez.
4. Public feature görünürlüğü D1 `app_features` üzerinden Admin'den açılıp kapatılabilir.
5. SEO değerli URL'leri ve `/edt-*` landing yolları public ürün deneyimine düşmeye devam eder.
6. Production ID/secret bu repoya yazılmaz.

## Kontrol
```bash
npm run verify
```

## Geçiş
Önce staging Worker + staging D1/R2. Production'a kopyalanırken mevcut binding adları/ID'leri korunur. Eski Worker rollback için tutulur.