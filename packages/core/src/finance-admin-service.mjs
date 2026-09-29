export class FinanceAdminService{
 constructor(store){this.store=store;}
 listRules({status=null}={}){return this.store.find("commissionRules",x=>!status||x.status===status);}
 listTransactions({transactionType=null}={}){return this.store.find("ledgerTransactions",x=>!transactionType||x.transactionType===transactionType);}
 listReconciliations({status=null}={}){return this.store.find("reconciliationBatches",x=>!status||x.status===status);}
}
