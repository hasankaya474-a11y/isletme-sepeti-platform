export const PHASE8_UI_STATES=Object.freeze({
 orderLoading:{title:"Siparişler yükleniyor"},orderEmpty:{title:"Henüz sipariş yok"},orderError:{title:"Siparişler yüklenemedi"},
 createConflict:{title:"Sipariş zaten oluşturulmuş olabilir"},outboxError:{title:"Olay yayımı bekliyor"}
});
export const PHASE8_RESPONSIVE=Object.freeze({
 mobile:{orders:"stacked-cards",detail:"single-column",timeline:"vertical"},
 tablet:{orders:"adaptive-list",detail:"two-column",timeline:"vertical"},
 desktop:{orders:"dense-table",detail:"split-panel",timeline:"horizontal"}
});
