# Okyanus EDT Worker New Face v1

Bu klasör, Worker'a doğrudan kopyalanacak gerçek kaynak kodu içerir.

## Dağıtım hedefleri
- `src/deniz-worker.js` → DENİZ public/satış Worker
- `src/zaman-admin-worker.js` → ZAMAN / ADMIN Worker
- `baseline/` → kullanıcı tarafından sağlanan çalışan kaynakların değişmeden saklanan regresyon referansı
- `migrations/` → ortak D1 görünürlük ve satış katmanı
- `docs/seo-routes.json` → mevcut 200 EDT SEO route envanteri

## Korunan kritik akışlar
- `POST /api/quote`
- `POST /api/contact`
- `POST /api/photo-inquiries`
- mevcut e-posta binding sözleşmesi
- ZAMAN mesaj merkezi
- ZAMAN fotoğraf mesaj akışı

Kritik DENİZ fonksiyonları baseline ile byte-byte korunur. Yeni satış yüzü ve modül görünürlüğü bu motorların dışına eklenmiştir.

## Public varsayılan durum
Aktif: Products, Quote, Photo, WhatsApp, SEO, Membership, Digital Menu.

Pasif/gizli: COST, COST Radar, Akademi, ÇEŞNİ ve diğer legacy araçlar.

## Dijital Menü
Minimum 30 tema + 30 şablon. Public landing `/dijital-menu-cozumleri`, mevcut gerçek builder `/dijital-menu`.

## Kontrol
```bash
npm run verify
```

## Canlı geçiş
Önce mevcut Worker/D1/R2/binding yedeği alınır. DENİZ ve ZAMAN kodları kendi Worker'larına kopyalanır. Secret ve binding değerleri GitHub'a yazılmaz. Dağıtım sonrası teklif, e-posta, mesaj, fotoğraf, SEO ve Dijital Menü smoke testleri yapılır. Eski Worker rollback için tutulur.
