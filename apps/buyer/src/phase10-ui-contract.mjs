export const PHASE10_UI_STATES=Object.freeze({
 invoiceLoading:{title:"Fatura yükleniyor"},invoiceEmpty:{title:"Fatura bulunmuyor"},invoiceError:{title:"Fatura yüklenemedi"},
 matchException:{title:"Üçlü eşleştirme uyuşmazlığı"},agreementPending:{title:"Karşı tarafın kabulü bekleniyor"}
});
export const PHASE10_RESPONSIVE=Object.freeze({
 mobile:{invoice:"stacked-sections",match:"issue-cards",actions:"sticky"},
 tablet:{invoice:"two-column",match:"adaptive-table",actions:"visible"},
 desktop:{invoice:"split-panel",match:"dense-table",actions:"toolbar"}
});
