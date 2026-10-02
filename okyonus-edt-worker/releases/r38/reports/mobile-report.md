# Mobil arayüz incelemesi

Yalnız son commerce CSS bloğuna uygulanacak yama: `patch-mobile.py <hedef.mjs>`.

- Vitrin → sekiz kategori → seçili ürünler sırası korunur; kategori gridi 4×2, ürün gridi 3 sütun.
- 320 px dahil başlıkta menü/arama/giriş/üyelik/sepet 44 px genişliğinde, en az 44 px yüksekliğinde dokunma alanına sahip olur. Marka kalan alanı kullanır ve taşan metin kesilir.
- Tablet başlığı mobil başlık gibi sticky olur; drawer konumu başlığın gerçek yüksekliğine bağlanır. Uzun drawer dikey kaydırılabilir.
- Miktar kontrolleri 44 px yüksekliğe çıkarılır; favori 44×44 olur. Mobil 3 sütun nedeniyle miktar düğmelerinin mevcut yatay genişliği korunur.
- Görsellerin alanı CSS ile rezerve edilir; vitrin oranı değiştirilmez. Kategori/ürün bölümüne gezinmede başlık ofseti sağlanır.
- Geri bağlantının dokunma yüksekliği artırılır. Universal geri navigasyon zaten aynı kökenden referrer + history doğrulaması yapar ve href fallback içerir; akışı değiştirilmez.
- Veri, API, üyelik, sepet betikleri ve görünüm içeriği değiştirilmez.

Doğrulama: yama baseline kopyasında uygulandı; `node --check /tmp/mobile-audit.mjs` geçti. Browser senaryosu `/tmp/test-mobile.cjs` hazırlanıp 320/375/768/1024 ölçüleri için başlatıldı; Playwright Chromium executable kurulu olmadığından çalışmadı. Görsel/browser testinin geçtiği iddia edilmiyor. Canlı dağıtım yapılmadı.
