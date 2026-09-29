import {newId} from "./id.mjs";
export class InvoiceReviewService{
 constructor(store){this.store=store;}
 decide({invoiceId,businessId,decision,overrideReason=null,actorId}){
  if(!["APPROVED","REJECTED"].includes(decision))throw new Error("INVOICE_DECISION_INVALID");
  const inv=this.store.get("supplierInvoices",invoiceId);if(!inv||inv.businessId!==businessId)throw new Error("INVOICE_FORBIDDEN");
  if(!["MATCHED","EXCEPTION"].includes(inv.status))throw new Error("INVOICE_NOT_REVIEWABLE");
  if(decision==="APPROVED"&&inv.status==="EXCEPTION"&&!overrideReason?.trim())throw new Error("INVOICE_OVERRIDE_REASON_REQUIRED");
  const now=new Date().toISOString(),row=this.store.update("supplierInvoices",invoiceId,x=>({...x,status:decision,updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"invoice.review."+decision.toLowerCase(),resourceType:"invoice",resourceId:invoiceId,metadata:{overrideReason},occurredAt:now});
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"invoice",aggregateId:invoiceId,eventType:"invoice."+decision.toLowerCase(),payload:{invoiceId,overrideReason},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  return row;
 }
}
