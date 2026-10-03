# DENİZ R50 — mobil menü ve arama

Taban: korunan DENİZ R49, commit 72a445553e90ae5d9281c226e396fc97b07d9af2. ZAMAN R48 aynen kullanılmaya devam eder.

Kök neden: mobil drawer/search position:fixed iken sonraki CSS top:100% yapıyordu. Paneller açılıyor ama viewport altında kalıyordu. R50 position:absolute ve details position:static kullanarak panelleri sticky header altında konumlandırır. Aktif İndirimli Ürünler, Yeni Ürünler, Markalar, İçerik Stüdyo, Dijital Menü bağlantıları hamburger menüye eklendi.

Kontroller: Worker sözdizimi; CSS cascade ve aktif link kontrolü; ana sayfa ve ürün detay teklif→sepet senaryoları geçti. Ajan bağımsız diff incelemesi geçti. Playwright mobil geometri testi hazır, fakat tarayıcı indirme başarısız olduğu için çalıştırılamadı; gerçek mobil/klavye ve canlı arama sonucu henüz doğrulanmadı. Canlıya dağıtılmadı.

DENIZ_R50_TAM_KOD.txt tek parça tam müşteri Worker kodudur. Eski R49/R48 kilitli arşivi değiştirilmedi.
