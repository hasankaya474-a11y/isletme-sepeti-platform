import {newId} from "./id.mjs";

export class CommissionAccrualService{
 constructor(store,rules,ledger){this.store=store;this.rules=rules;this.ledger=ledger;}
 accrue({invoiceId,actorId}){
  const inv=this.store.get("supplierInvoices",invoiceId);if(!inv)throw new Error("INVOICE_NOT_FOUND");
  if(inv.status!=="APPROVED")throw new Error("INVOICE_NOT_APPROVED");
  if(this.store.find("commissionAccruals",x=>x.invoiceId===invoiceId).length)throw new Error("COMMISSION_ALREADY_ACCRUED");
  const rule=this.rules.resolve({businessId:inv.businessId,supplierId:inv.supplierId,currency:inv.currency,at:inv.updatedAt??inv.createdAt});if(!rule)throw new Error("COMMISSION_RULE_NOT_FOUND");
  const basisMinor=rule.basis==="GROSS"?inv.grossMinor:inv.netMinor;
  const commissionMinor=Math.round((basisMinor*rule.rateBps)/10000);
  if(commissionMinor===0)throw new Error("COMMISSION_ZERO");
  const posted=this.ledger.postBalanced({transactionType:"COMMISSION_ACCRUAL",sourceType:"invoice",sourceId:invoiceId,currency:inv.currency,actorId,entries:[
   {accountCode:"PLATFORM_COMMISSION_RECEIVABLE",organizationType:"PLATFORM",organizationId:"platform",amountMinor:commissionMinor,metadata:{invoiceId}},
   {accountCode:"SUPPLIER_COMMISSION_PAYABLE",organizationType:"SUPPLIER",organizationId:inv.supplierId,amountMinor:-commissionMinor,metadata:{invoiceId}}
  ]});
  const now=new Date().toISOString(),row={id:newId("commacc"),invoiceId,commissionRuleId:rule.id,supplierId:inv.supplierId,businessId:inv.businessId,currency:inv.currency,basisMinor,rateBps:rule.rateBps,commissionMinor,ledgerTransactionId:posted.transaction.id,createdAt:now};
  this.store.insert("commissionAccruals",row);
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"invoice",aggregateId:invoiceId,eventType:"commission.accrued",payload:{invoiceId,commissionMinor,currency:inv.currency},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"commission.accrue",resourceType:"invoice",resourceId:invoiceId,occurredAt:now});return row;
 }
}
