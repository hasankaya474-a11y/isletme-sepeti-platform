# Okyanus R45 – Ticari yönetim ve ürün açılışı

DENIZ_R45_TAM_KOD.txt ve ZAMAN_R45_TAM_KOD.txt ayrı tam Worker dosyalarıdır. İlgili Worker'lara ikisi de yüklenir. Bu denetimde canlıya dağıtım veya canlı veri yazımı yapılmadı.

Kapsam yalnız ticari yönetim kaydetme/görsel yükleme akışı ile ürün görselinden detay açılışıdır. Mobil kart düzeni ve R44 ürün/veri kuralları korunur.

- Mevcut ürün düzenleme+kaydetme yerel VM senaryosunda 5 API isteğinden1isteğe indi. Tüm katalog tekrar indirilmez; sunucunun döndürdüğü güncel kayıt kullanılır. Arama/kategori/sayfa korunur.
- Ürün detayında tam katalog yerine ilgili ürün ve en fazla5benzer ürün yüklenir. Güncel fiyat/ayar hesapları korunur; tam katalog endpoint'i değişmez.
- Görsel ve başlık bağlantıları aynı benzersiz ürün kimliğine gider. Görselin iç öğeleri dokunmayı bağlantıya aktarır; sürükleme kapalıdır. Favori ayrı işlem olarak kalır.
- Görsel yüklerken erken kayıt engellenir; geçersiz URL/zaman aşımı/ağ hatasında form açılır ve önceki değer korunur. API multipart boyut sınırı ve uzak yükleme zaman aşımı vardır.

Kanıt sınırı: canlı R44'te ana sayfa ilk görseli normal tıklamayla EDT-0035 ürününü252.50fiyatıyla doğru açtı. Google/Lens davranışı tekrar üretilemedi; ekran görüntüsü Google menüsünü göstermiyor. Kullanılmayan eski şablondaki DIV ve varsayımsal kaynakIDçakışması canlı Google yönlendirmesinin kanıtlanmış nedeni değildir. Gerçek telefon uzunbasma/dokunma ayrımı R45dağıtımı sonrası doğrulanmalı.

Yerel testler:16/16SQLite/VM entegrasyonu, ürün ekle/değiştir/görsel/fiyat/yayın/geri alma, PNGKV/R2, fiyat geçerliliği, doğruvaryantID, dokunmabağlantıoluşturucusu, görselyüklemebaşarı/hata/zaman aşımı, kompaktürünyanıtı senaryoları. Canlı yönetim hesabında yazma testi yapılmadı. İstek azalması ölçüldü; gerçek internet gecikmesinin ortadan kalktığı iddia edilmez.

Rebuild: python okyonus-edt-worker/releases/r45/build.py
