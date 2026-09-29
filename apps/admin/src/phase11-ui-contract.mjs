export const PHASE11_UI_STATES=Object.freeze({
 loading:{title:"Finansal kayıtlar yükleniyor"},
 empty:{title:"Henüz finansal kayıt yok"},
 error:{title:"Finansal kayıtlar yüklenemedi"},
 reconciliationOpen:{title:"Mutabakat farkı inceleme bekliyor"}
});
export const PHASE11_RESPONSIVE=Object.freeze({
 mobile:{ledger:"entry-cards",reconciliation:"stacked",actions:"sticky"},
 tablet:{ledger:"adaptive-table",reconciliation:"two-column",actions:"visible"},
 desktop:{ledger:"dense-table",reconciliation:"split-panel",actions:"toolbar"}
});