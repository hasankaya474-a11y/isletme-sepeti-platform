export class InvoiceAdminService{
 constructor(store){this.store=store;}
 listInvoices({status=null}={}){return this.store.find("supplierInvoices",x=>!status||x.status===status);}
 listMatches({status=null}={}){return this.store.find("threeWayMatches",x=>!status||x.status===status);}
 listAgreements({status=null}={}){return this.store.find("commercialAgreements",x=>!status||x.status===status);}
}
