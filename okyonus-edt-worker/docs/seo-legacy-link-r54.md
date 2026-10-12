# R54 eski SEO bağlantısı onarımı

Ekran görüntüsündeki `/toptan-kiyma`, mevcut 200 SEO kaydında yer almayan eski bir adres. Canlı kontrol ajanları www adresinde 404, ana alan adında www yönlendirmesinden sonra 404 doğruladı. Canlı ana sayfa ve API SEO listesi mevcut 200 kayıtla eşleşiyor.

GET ve HEAD istekleri, sorgu parametreleri korunarak `https://www.okyonusedt.com/edt-toptan-et-urunleri` adresine 301 yönlendirilir. Hedef mevcut 200 sayfa arasındadır. Kıyma ürünü veya stok bilgisi eklenmez. Bilinmeyen adreslerin 404 davranışı korunur.

Kod hazırlanmıştır; canlıya dağıtım henüz yapılmamıştır.
