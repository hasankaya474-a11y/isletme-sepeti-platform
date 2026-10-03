# ZAMAN R52 — Ticaret Yönetimi başlangıç onarımı

Başlangıç: kilitli ZAMAN R48 (R49 yönetim dosyası ile aynı). DENİZ değiştirilmedi.

Görsel URL kontrolündeki dış HTML şablonunun `\u0000` kaçışı gerçek NUL üretiyordu. HTML ayrıştırıcısı NUL karakterini U+FFFD ile değiştirince düzenli ifade aralığı geçersiz oluyor ve tüm yönetim betiği çalışmıyordu. Kontrol artık karakter kodlarını kullanıyor; boşluk, ASCII kontrol karakterleri ve ters eğik çizgi reddi korunuyor.

Doğrulama: eski üretilen HTML betiğinde tarayıcı NUL normalizasyonu sonrası SyntaxError yeniden üretildi. Yeni tam Worker sözdizimi ve normalleştirilmiş betik kontrolü geçti. DOM/VM başlangıç testinde alt sekmeler gizlendi ve Kontrol Merkezi örnek API yanıtıyla render edildi. Güvenli ve sakıncalı URL kontrolleri geçti. Bağımsız ajan kök nedeni doğruladı.

Gerçek D1 yazma ve tüm yönetim CRUD akışları bu oturumda test edilmedi. Canlı yönetim giriş ekranına yönlendi; canlı R52 dağıtımı yapılmadı. Bu testler canlı başarı kanıtı değildir.

Cloudflare ZAMAN/admin Worker için tam tek parça kod: ZAMAN_R52_TAM_KOD.txt. zaman.mjs aynı içeriktir. Kilitli R48 geri dönüş kaynağı korunur.
