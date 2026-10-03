# Final upload kontrolü

Çalıştırıldı:

- `node work/cart-tests.cjs final/deniz.mjs`: geçti. Son birleştirilmiş DENİZ üzerinde önceki 8 API + browser quantity/persistence + double submit/session failure testleri tekrarlandı.
- `node work/upload-tests.cjs final/zaman.mjs`: geçti.

Upload testleri gerçek final ZAMAN içinden çıkarılmış endpoint branch ve `uploadImageToEditor` fonksiyonu üzerinde mock fetch ile çalıştırıldı:

- Owner dışında admin 403; GitHub çağrısı yok.
- Token yok 503; GitHub çağrısı yok.
- Yanlış dosya imzası 400.
- Mevcut hash için GET200, PUT yok, token yanıtta yok.
- Yeni dosya GET404 + PUT201, gönderilen base64 gerçek bytes ile aynı.
- GitHub GET403 -> 502; başarısız PUT+retry404 -> 502.
- Concurrent upload PUT409+retryGET200 -> başarı.
- Inline config503 -> mevcut studio-media fallback ve URL ataması.
- Inline403 -> fallback yok; buton/form disabled ve uploading durumları temizlendi.
- CSRF header fallback dahil korunuyor.

Son entegrasyonda ok:false+url yanıtını reddeden başarı kontrolü eklendi ve testler tekrar geçti.

Sınırlar: gerçek GitHub token/branch/PUT çalıştırılmadı. Server image validation MIME magic bytes ile sınırlı; gerçek decoder kullanılmıyor. Network exception outer Worker handler tarafından 500'e çevrilebilir; kullanıcıdaki finally kilitleri açar. Timeout ve kontrollü 502 dönüşü ayrıca iyileştirilebilir. Çalışan Worker dosyalarında edit yapılmadı.
