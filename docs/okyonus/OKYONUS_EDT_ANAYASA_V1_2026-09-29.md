# OKYANUS EDT ANAYASA V1
Tarih: 2026-09-29
Durum: SABIT / ANA REFERANS
Branch: okyonus-commerce-v1

## 1. ANA HEDEF
Okyanus EDT'nin ana yüzü ürün odaklı, kategori odaklı, arama odaklı gerçek HORECA B2B ticaret platformudur.
Ana akış:
Arama / Kategori -> Ürün -> Miktar -> Sepet / Teklif -> Hesap -> Teslimat -> Sipariş / Teklif -> Takip.

## 2. TASARIM KARAKTERI
- Bonservis tipi ticari kullanıcı deneyimi referans alınır.
- Görünüm ve kod Okyanus'a özgü olur.
- Ürün odaklı vitrin korunur.
- Hareketli bannerlar, kategori rayları, fırsatlar, çok satanlar, yeni ürünler, markalar ve kampanyalar ana sayfada yönetilebilir olur.
- Ana sayfada görünen hiçbir ticari alan koda gömülü sabit içerik olmak zorunda değildir; admin panelinden yönetilebilir olmalıdır.

## 3. MOBIL SABIT KURAL
Mobil görünüm birincil ürün deneyimidir ve masaüstünden sonra eklenen ikincil sürüm değildir.
Olmazsa olmazlar:
- mobilde yatay taşma yok
- sticky arama
- swipe banner
- kategori chip/drawer
- kompakt ürün kartları
- fiyat, paket, stok ve sepete/teklife ekleme görünür
- dokunma hedefleri yeterli
- alt mobil navigasyon:
  Ana Sayfa / Kategoriler / Ara / Sepet-Teklif / Hesabım
- iletişim ve yardım mobilde erişilebilir
- ana satış fonksiyonları mobilde masaüstüyle işlevsel eşdeğer olmalı
- üretim öncesi 430 / 390 / 360 px kontrolleri zorunlu

## 4. TABLET SABIT KURAL
Tablet ayrı kırılım olarak ele alınır.
Olmazsa olmazlar:
- 1024 / 768 kontrolleri
- kategori drawer veya kontrollü mega menü
- 2/3 kolon ürün grid
- banner kırpım ve yükseklik kontrolü
- sticky arama ve sepet erişimi
- iletişim ve yardım görünür
- admin paneli tablet kullanımına uygun
- yatay taşma ve üst üste binme kabul edilmez

## 5. İLETİŞİM MODULU SABIT KURAL
İletişim gerçek bir modüldür, footer metni değildir.
Public alan:
- İletişim sayfası
- ad/soyad
- telefon
- e-posta
- konu/kategori
- mesaj
- onay/izin
- gönderim sonucu
- telefon
- e-posta
- işletme bilgileri

Arka plan:
- mesaj ZAMAN / Message Center'a akar
- kayıt D1'de tutulur
- durum: NEW / IN_PROGRESS / RESOLVED / CLOSED
- kimin cevapladığı ve ne zaman işlem yaptığı audit edilir
- e-posta gönderimi mesaj kaydından bağımsız ve retry edilebilir olmalıdır

## 6. İLETİŞİM ARAÇLARI SABIT KURAL
- Telefon
- E-posta
- İletişim Formu
- WhatsApp destek yalnız doğrulanmış ve çalışan durumda ise
- Fotoğrafla Teklif İçerik Stüdyo içinde bulunabilir, fakat gerektiğinde ticari akıştan erişim verilebilir
- iletişim araçları mobil ve tablette erişilebilir olmalıdır
- çalışmayan iletişim butonu görünür bırakılamaz
- WhatsApp admin ayarı: enabled, number, prefill, working_hours

## 7. SITE YARDIM SABIT KURAL
Site Yardım ayrı kullanıcı destek katmanıdır.
İçerik:
- Nasıl Sipariş Verilir
- Nasıl Teklif Alınır
- Teslimat
- Üyelik
- Fiyatlar
- Kampanyalar
- İade
- Stok / Gelince Haber Ver
- Sık Sorulan Sorular
- İletişim
- Sorun Bildir

Site Yardım:
- masaüstü, tablet ve mobilde erişilebilir
- arama destekler
- kategori bazlı yardım makaleleri içerir
- gerektiğinde İletişim Modülüne aktarır
- admin panelinden düzenlenebilir
- yardım içeriği kod değişmeden yayınlanabilir

## 8. İÇERİK STUDYO
Ana ticaret navigasyonunu kalabalıklaştırmaz.
İçerir:
- Dijital Menü
- Fotoğrafla Teklif
- ÇEŞNİ
- COST
- COST Radar
- Akademi
- Kolay Reçete
- legacy/experimental modüller

İsteyen kullanıcı İçerik Stüdyo üzerinden erişir.
Ana satış yüzü ürün ve ticaret odaklı kalır.

## 9. PUBLIC COMMERCE SABIT ALANLAR
- Header
- Büyük Arama
- Teslimat Bölgesi
- Hesap
- Sepet/Teklif
- Mega Kategoriler
- Hareketli Banner
- Ana Kategoriler
- Fırsatlar
- Çok Satanlar
- İndirimli Ürünler
- Yeni Ürünler
- Kategori Rayları
- Markalar
- Hazır HORECA Listeleri
- Kampanyalar
- SEO Landing
- İletişim
- Site Yardım
- Footer

## 10. YONETIM PANELI ZORUNLULUGU
Ön yüzde değiştirilebilir her ticari alanın admin karşılığı bulunur.
Zorunlu yönetim alanları:
- Dashboard
- Vitrin Yönetimi
- Ürünler
- Kategoriler
- Markalar
- Fiyatlar
- Müşteri Özel Fiyatları
- Stok
- Bannerlar
- Kampanyalar
- Hazır Listeler
- Müşteriler
- Sepet/Teklif
- Siparişler
- Teslimat
- İadeler
- İletişim / Mesajlar
- Site Yardım
- Medya
- SEO
- İçerik Stüdyo
- E-bülten
- Audit
- Ayarlar

## 11. URUN YONETIMI
Admin şunları değiştirebilir:
- ürün görseli
- ürün adı
- SKU
- barkod
- marka
- kategori
- alt kategori
- paket/gramaj
- birim
- koli içi
- minimum sipariş
- fiyat
- indirimli fiyat
- müşteriye özel fiyat
- stok durumu
- stok miktarı
- yeni ürün durumu
- fırsat durumu
- açıklama
- saklama
- menşei
- soğuk zincir
- SEO
- görünürlük

## 12. BANNER / VITRIN YONETIMI
Admin:
- desktop görsel
- mobil görsel
- başlık
- alt başlık
- CTA
- URL
- başlangıç
- bitiş
- sıralama
- müşteri segmenti
- bölge
- cihaz
- aktif/pasif
- rail sıralaması
- rail ürün kaynağı
değiştirebilir.

## 13. FIYAT KURALI
Öncelik:
1. müşteri sözleşme fiyatı
2. müşteri kampanya fiyatı
3. genel kampanya fiyatı
4. indirimli fiyat
5. liste fiyatı
Opsiyonel: havale fiyatı.

Her fiyat değişikliği audit edilir.

## 14. KAMPANYA MOTORU
Destekler:
- ürün indirimi
- kategori indirimi
- sepet tutarı indirimi
- eşik hediyesi
- bundle
- kupon
- müşteri özel kampanya
- ücretsiz teslimat
- özel fiyat unlock

## 15. SEPET / TEKLIF HIBRIT
Kullanıcı sade şekilde Sepete Ekle görür.
Arka planda:
- DIRECT_ORDER
- QUOTE_REQUIRED
- MIXED
çalışabilir.
Mevcut teklif motoru korunur.

## 16. TESLIMAT MOTORU
Yönetilebilir alanlar:
- il
- ilçe
- minimum sepet
- teslimat ücreti
- ücretsiz teslimat limiti
- cutoff
- teslimat günü
- soğuk zincir uygunluğu
- ürün kısıtları

## 17. HESAP / UYELIK
- firma
- yetkili
- telefon
- e-posta
- vergi bilgileri
- adresler
- teslimat bölgesi
- fiyat grubu
- siparişler
- teklifler
- favoriler
- fiyat alarmları
- stok alarmları
- tekrar sipariş
- bildirim tercihleri

## 18. MEDYA KUTUPHANESI
- ürün görselleri
- banner
- kategori
- marka
- kampanya
- mobil varyant
- alt metin
- crop
- etiket
- kullanım haritası
- duplicate hash
- WebP/AVIF
- orijinal koruma

Yalnız kullanım hakkı olan medya yayınlanır.

## 19. SEO
Mevcut EDT SEO envanteri korunur.
Commerce hedeflerine bağlanır:
SEO landing -> kategori/ürün -> teklif/sepet.
Canonical, sitemap, breadcrumb ve product schema korunur.

## 20. REGRESYON KILITLARI
Bozulamaz:
- e-posta
- iletişim
- Message Center
- Fotoğrafla Teklif
- teklif oluşturma
- üyelik
- D1 mevcut veri
- ZAMAN auth
- SEO route envanteri
- rollback imkanı

## 21. PRODUCTION PASS KURALI
Canlı PASS demek için gerçek kanıt gerekir:
- ana sayfa
- mobil
- tablet
- arama
- kategori
- ürün
- fiyat
- sepet/teklif
- iletişim
- yardım
- e-posta
- fotoğraf
- üyelik
- teslimat
- admin CRUD
- SEO örnekleri
- rollback

## 22. SABIT GELISTIRME SIRASI
1. Veri şeması / feature flags
2. Commerce shell
3. Header / arama / kategori
4. Mobil + tablet temel
5. Ürün katalog/kart
6. Ürün detay
7. Medya
8. Banner/vitrin
9. Fiyat/kampanya
10. Sepet/teklif
11. Hesap
12. Teslimat
13. İletişim modülü
14. Site Yardım
15. İçerik Stüdyo
16. SEO eşleme
17. Admin hardening
18. staging
19. production smoke

## 23. ANAYASA KURALI
Bu dosya Okyanus EDT Commerce geliştirmesinin ana referansıdır.
Bu kurallarla çelişen sonraki değişiklikler açıkça işaretlenmeden uygulanmaz.
Mobil, tablet, iletişim araçları, İletişim Modülü ve Site Yardım hiçbir sonraki revizyonda kaldırılmaz veya işlevsiz bırakılmaz.
