# DENİZ / ZAMAN R41 — canlı kontrol sonrası

3 Ekim 2026, 09:33–09:38 İstanbul: altı uzmanla canlı R40 dış denetimi yapıldı. Canlı R40 etiketi doğrulandı. 1.347 katalog ürünü ve 27 seçili aktif kart, dört vitrin görseli ve sekiz kategori yükleniyor. 200 SEO sayfasının tümü HTTP 200, canonical ve sitemap üyeliği doğru. HTTPS ve güvenlik başlıkları aktif, anonim üyelik API yanıtı 401.

Tarayıcıda Kayık Patates detayından sepete ekleme, miktarı 1→2 artırma, yenilemede korunma ve ürünü kaldırma test edildi. Açılış reklamını kapatma, zorunlu çerez tercihi ve fotoğrafla teklif ekranına geçiş kontrol edildi. Teklif, mesaj, fotoğraf veya sipariş gönderilmedi. Tam yönetici oturumu ve gerçek mobil cihaz testi yapılmadı.

Dış denetimde bulunan iki hata R41'de onarıldı:
- Duyuru API'den güncellenirken üst kapsayıcının textContent değeri çevrimiçi göstergesini siliyordu. Duyuru kendi metin alanına yazılıyor; durum göstergesi korunuyor.
- Eski important mobil kuralları miktar düğmelerini daraltıyordu. Tablet/mobil kurallarının önceliği düzeltildi; küçük ekranda iki satır ve gerektiğinde tek sütun, daha geniş tabletlerde üçlü miktar alanı korunur. Düğme minimumu 44px; ürünler üç sütunda kalır.

Tam kodlar: DENIZ_R41_CANLI_KONTROL_TAM_KOD.txt (aynı içerikte deniz.mjs ve DENIZ_R41_TAM_KOD.txt), ZAMAN_R41_TAM_KOD.txt (aynı içerikte zaman.mjs). ZAMAN işlevsel olarak R40 ile byte eşittir; yalnız DENİZ yenilenmesi gerekir. Worker'lar ayrı uygulanır. Dosyayı indirerek metin düzenleyicide açın; tarayıcı çevirili kod görünümünden kopyalamayın.

16/16 SQLite/VM çapraz kontrol, 200 rota yerel kontrolü ve gerçek duyuru hydration regresyonu geçti. İki Worker sözdizimi ve TXT hash eşitliği doğrulandı. test-branding-hydration.mjs eski sürümde hatayı yakalar; yeni sürümde durum alanı kalır. Kontrol raporu KONTROL_RAPORU.md ve canlı SEO kanıtı reports/live-r40-seo-200.json içindedir.

R41 canlıya dağıtılmadı. Bu paket denetimde bulunan hataların hazırlanmış onarımıdır; R41'in gerçek canlı görünümü yeni yayın sonrası doğrulanmalıdır. Ürün fiyatları panelde doldurulmadığı için seçili 27 kartta teklif fiyatı görünür; fiyat uydurulmadı. İşletmenin bağımsız ticari güvenilirlik sertifikası iddia edilmez.

build.py değişmemiş R39 kaynakları üzerine R40 onarımlarını ve bu iki R41 düzeltmesini tekrar üretir. checksums.json dosya hashlerini içerir. R40 tam kodları korunur; geri dönüş için önceki Worker kodu ve mevcut bindings kullanılır. Üretim verileri değiştirilmedi.
