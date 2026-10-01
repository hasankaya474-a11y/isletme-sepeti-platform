# Okyanus EDT kişisel hesap ve ticari yönetim güncellemesi

Kaynak: GitHub `46529f5b426cbc4035d1d70ae58ad427e90314eb` üzerine eklenen değişiklikler.

## Kullanım

- Site ve ürün kataloğu ziyaretçilere açıktır. Teklif gönderimi, fotoğraflı teklif ve B2B teklif işlemleri doğrulanmış üye oturumu gerektirir.
- Giriş ve yeni üyelik ekranı sadeleştirildi. Kişisel hesapta tarihli teklifler, sipariş kayıtları, son ziyaretler ve kullanıcıya ait sepet gösterilir. Eski büyük karşılama alanı kaldırıldı. Mevcut özel işletme araçları korunur.
- WhatsApp simgesi yeşil daire içinde SVG olarak gösterilir. Mobil giriş, yeni üyelik ve sepet sayacı eklendi. Sepette güncel katalog kontrolü, miktar düzenleme ve başarılı gönderim özeti vardır.
- Çerez tercihleri zorunlu ve isteğe bağlı kategorileri ayırır; tercih ekranı yeniden açılabilir. Son ziyaretlerin kaydı işlevsel tercihe bağlıdır.
- Mobil/tablet ziyaretinde aktif kampanya kapatılabilir pencerede gösterilir. Kampanya bulunmuyorsa pencere gösterilmez.
- Uygulamayı Kaydet, destekleyen tarayıcıda kurulum istemini; diğer cihazlarda cihazın ana ekrana ekleme yönergesini açar.

## Ticari panel

Ürün, fiyat, açıklama, görsel, anasayfa yayını, kampanya ve mevcut ticari alanlar kendi modüllerinden yönetilir. Yönetici yetkileri korunur.

Toplu Ürün Tablosu: CSV indir → Excel/LibreOffice ile doldur → aynı modülden yükle → önizle → Kaydet. Ürün kodu ve adı eşleşmelidir. Bilinmeyen veya yinelenen kod, yanlış ad, geçersiz fiyat ve görsel adresi tüm yüklemeyi reddeder. Doğrulanan değişiklikler tek D1 batch ile uygulanır. Yeni ana fiyat eski elle girilmiş indirimli fiyatı temizler; kampanya kuralları korunur.

## Çalıştırma ve dosyalar

DENİZ ve ZAMAN/ADMIN ayrı Worker olarak korunur; ortak mevcut D1 bağlanır. Birleştirilmiş dağıtım dosyalarının göreli import bağımlılığı yoktur.

- `exports/OKYANUS_DENIZ_CURRENT_FINAL.txt`: DENİZ tek parça kod.
- `exports/OKYANUS_ZAMAN_ADMIN_CURRENT_FINAL.txt`: ZAMAN/ADMIN tek parça kod.
- `npm run verify`: üretim dosyalarını yeniden oluşturur, kaynak ve çıktı sözdizimini, Worker importunu ve testleri kontrol eder.

Üyelik doğrulaması mevcut EMAIL yapılandırmasını kullanır. Bu güncelleme canlı dağıtım yapmaz. Gerçek canlı D1, e-posta teslimatı ve cihaz kurulumu ancak dağıtılmış ortamda doğrulanabilir. Otomatik testler tarayıcı programlarının sözdizimini ve SQLite/D1 iş akışını sınar; gerçek mobil tarayıcı görsel kontrolünün yerine geçmez.
