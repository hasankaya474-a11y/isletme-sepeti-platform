export const PHASE7_UI_STATES=Object.freeze({
 cartLoading:{title:"Sepet yükleniyor"},cartEmpty:{title:"Sepetiniz boş"},cartError:{title:"Sepet yüklenemedi"},
 approvalEmpty:{title:"Bekleyen onay yok"},approvalError:{title:"Onay işlemi tamamlanamadı"}
});
export const PHASE7_RESPONSIVE=Object.freeze({
 mobile:{cart:"stacked-lines",summary:"sticky-bottom",approvalActions:"sticky"},
 tablet:{cart:"adaptive-list",summary:"side-card",approvalActions:"visible"},
 desktop:{cart:"dense-table",summary:"side-panel",approvalActions:"toolbar"}
});
