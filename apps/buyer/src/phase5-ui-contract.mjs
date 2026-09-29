export const PHASE5_UI_STATES=Object.freeze({
  searchLoading:{title:"Ürünler yükleniyor"},
  searchEmpty:{title:"Ürün bulunamadı"},
  searchError:{title:"Arama tamamlanamadı"},
  matchLoading:{title:"Eşleştirmeler hazırlanıyor"},
  matchEmpty:{title:"Henüz aday ürün yok"},
  matchError:{title:"Eşleştirme yüklenemedi"}
});
export const PHASE5_RESPONSIVE=Object.freeze({
  mobile:{productGridColumns:1,filters:"drawer",primaryAction:"sticky"},
  tablet:{productGridColumns:2,filters:"drawer",primaryAction:"visible"},
  desktop:{productGridColumns:4,filters:"sidebar",primaryAction:"visible"}
});
