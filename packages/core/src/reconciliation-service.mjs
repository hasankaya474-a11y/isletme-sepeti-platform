import {newId} from "./id.mjs";

export class ReconciliationService{
 constructor(store){this.store=store;}
 runCommission({supplierId=null,businessId=null,currency="TRY",periodStart=null,periodEnd=null,actorId}){
  if(!actorId)throw new TypeError("ACTOR_REQUIRED");
  const accruals=this.store.find("commissionAccruals",x=>(!supplierId||x.supplierId===supplierId)&&(!businessId||x.businessId===businessId)&&x.currency===currency&&(!periodStart||x.createdAt>=periodStart)&&(!periodEnd||x.createdAt<=periodEnd));
  const entries=this.store.find("ledgerEntries",x=>x.accountCode==="PLATFORM_COMMISSION_RECEIVABLE"&&x.currency===currency);
  const now=new Date().toISOString(),batch={id:newId("recon"),businessId,supplierId,currency,status:"OPEN",periodStart,periodEnd,expectedMinor:0,ledgerMinor:0,differenceMinor:0,createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("reconciliationBatches",batch);
  let expected=0,ledger=0;
  for(const a of accruals){
   const related=entries.filter(e=>e.metadata?.invoiceId===a.invoiceId);
   const ledgerMinor=related.reduce((s,e)=>s+e.amountMinor,0),difference=a.commissionMinor-ledgerMinor;
   expected+=a.commissionMinor;ledger+=ledgerMinor;
   this.store.insert("reconciliationItems",{id:newId("reconitem"),batchId:batch.id,sourceType:"commission_accrual",sourceId:a.id,expectedMinor:a.commissionMinor,ledgerMinor,differenceMinor:difference,status:difference===0?"MATCHED":"DIFFERENCE",resolutionNote:null,resolvedBy:null,resolvedAt:null});
  }
  const difference=expected-ledger,status=difference===0?"RECONCILED":"REVIEW";
  const row=this.store.update("reconciliationBatches",batch.id,x=>({...x,status,expectedMinor:expected,ledgerMinor:ledger,differenceMinor:difference,updatedAt:new Date().toISOString()}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"finance.reconcile",resourceType:"reconciliation_batch",resourceId:batch.id,occurredAt:new Date().toISOString()});return row;
 }
 resolveItem({itemId,note,actorId}){
  const item=this.store.get("reconciliationItems",itemId);if(!item||item.status!=="DIFFERENCE")throw new Error("RECONCILIATION_ITEM_NOT_OPEN");
  if(!note?.trim())throw new Error("RECONCILIATION_NOTE_REQUIRED");
  return this.store.update("reconciliationItems",itemId,x=>({...x,status:"RESOLVED",resolutionNote:note,resolvedBy:actorId,resolvedAt:new Date().toISOString()}));
 }
}
