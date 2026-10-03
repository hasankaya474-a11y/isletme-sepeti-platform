# Okyanus EDT R49 — mobil WhatsApp ve yardım

DENIZ_R49_TAM_KOD.txt tam müşteri Worker kodudur. ZAMAN'ın R48 kodu değişmedi; bu düzeltme için yalnız DENİZ yüklenir. R49 klasöründeki ZAMAN kopyası R48 ile birebir aynıdır.

Neden: eski kritik mobil CSS'teki body .float {position:static!important;right:auto!important;bottom:auto!important} kuralı, sonradan gelen .float sabit konum kuralından daha özeldi. Düğmeler mevcut olduğu halde ekranın sağ altında değil, sayfanın sonunda duruyordu.

Düzeltme: iletişim grubuna özel okyContactDock kimliği eklendi. Konum/display/yön/kenar kuralları bu kimlikle tanımlandı; eski sınıf kurallarından daha özel. WhatsApp yeşil yuvarlak ve mevcut SVG simgesi, yardım Y metinli 48px yuvarlak bağlantı. Yardım /yardim; WhatsApp mevcut yönetim numarası ayarını kullanmayı sürdürür. Mobilde sağ10px/alt14px+safe-area, masaüstünde sağ18px/alt24px. Popup üst katman ve çerez tercihleri üzerinde zorla görünmez; normal gezintide sabit kalır.

Kontrol: Worker sözdizimi, 16 entegrasyon, R48 banner oturum kontrolü ve gerçek ana sayfa/detay teklif akışı geçti. Mobil CSS/bağlantı çapraz incelemesi ektedir. Gerçek telefonda canlı R49 henüz dağıtılmadı; dağıtım sonrasında doğrulanır. Diğer ürün/kampanya/veri düzenleri değiştirilmedi.
