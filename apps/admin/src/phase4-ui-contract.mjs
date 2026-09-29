export const PHASE4_UI_STATES=Object.freeze({
  loading:{title:"Veriler yükleniyor",body:"Fiyat, stok ve teslimat verileri hazırlanıyor."},
  empty:{title:"Henüz operasyon verisi yok",body:"İlk fiyat listesi, stok lokasyonu veya teslimat politikası oluşturabilirsiniz."},
  error:{title:"Operasyon verileri yüklenemedi",body:"Değişiklik yapılmadı. Yeniden deneyin veya destek kaydı açın."},
  forbidden:{title:"Bu alan için yetkiniz yok",body:"Gerekli yönetim yetkisi ve kapsam yöneticiniz tarafından atanmalıdır."}
});

export const PHASE4_RESPONSIVE=Object.freeze({
  mobile:{layout:"single-column",primaryActions:"sticky",tables:"cards-or-horizontal-safe"},
  tablet:{layout:"two-column-adaptive",primaryActions:"visible",tables:"adaptive"},
  desktop:{layout:"control-grid",primaryActions:"toolbar",tables:"dense"}
});
