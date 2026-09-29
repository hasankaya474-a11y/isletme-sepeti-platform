import {newId} from "./id.mjs";

export class ThreeWayMatchService{
 constructor(store){this.store=store;}
 match({invoiceId,businessId,actorId}){
  const inv=this.store.get("supplierInvoices",invoiceId);if(!inv||inv.businessId!==businessId)throw new Error("INVOICE_FORBIDDEN");
  if(!["SUBMITTED","UNDER_REVIEW","EXCEPTION"].includes(inv.status))throw new Error("INVOICE_NOT_MATCHABLE");
  const orderLines=this.store.find("orderLines",x=>x.orderId===inv.orderId),invoiceLines=this.store.find("invoiceLines",x=>x.invoiceId===invoiceId);
  const delivery=this.store.find("deliveries",x=>x.orderId===inv.orderId)[0]??null;
  const receiving=delivery?this.store.find("receivings",x=>x.deliveryId===delivery.id)[0]??null:null;
  const deliveryItems=delivery?this.store.find("deliveryItems",x=>x.deliveryId===delivery.id):[];
  const receivingLines=receiving?this.store.find("receivingLines",x=>x.receivingId===receiving.id):[];
  const issues=[];
  if(!receiving)issues.push({code:"RECEIVING_MISSING"});
  for(const ol of orderLines){
   const il=invoiceLines.find(x=>x.orderLineId===ol.id);
   if(!il){issues.push({code:"INVOICE_LINE_MISSING",orderLineId:ol.id});continue;}
   const di=deliveryItems.find(x=>x.orderLineId===ol.id),rl=di?receivingLines.find(x=>x.deliveryItemId===di.id):null;
   const accepted=rl?.acceptedQtyMilli??null;
   if(accepted===null)issues.push({code:"RECEIVING_LINE_MISSING",orderLineId:ol.id});
   else if(il.quantityMilli!==accepted)issues.push({code:"QUANTITY_MISMATCH",orderLineId:ol.id,expected:accepted,actual:il.quantityMilli});
   if(il.unitPriceMinor!==ol.unitPriceMinor)issues.push({code:"PRICE_MISMATCH",orderLineId:ol.id,expected:ol.unitPriceMinor,actual:il.unitPriceMinor});
   if(il.taxRateBps!==ol.taxRateBps)issues.push({code:"TAX_MISMATCH",orderLineId:ol.id,expected:ol.taxRateBps,actual:il.taxRateBps});
  }
  const snapshot=this.store.find("orderSnapshots",x=>x.orderId===inv.orderId)[0]??null,status=issues.length?"EXCEPTION":"MATCHED",now=new Date().toISOString();
  const previous=this.store.find("threeWayMatches",x=>x.invoiceId===invoiceId)[0];
  const row={id:previous?.id??newId("match3"),invoiceId,status,issues,orderSnapshotSha256:snapshot?.snapshotSha256??null,matchedAt:now,matchedBy:actorId};
  if(previous)this.store.update("threeWayMatches",previous.id,()=>row);else this.store.insert("threeWayMatches",row);
  this.store.update("supplierInvoices",invoiceId,x=>({...x,status,updatedAt:now}));
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"invoice",aggregateId:invoiceId,eventType:"invoice.match_completed",payload:{invoiceId,status,issueCount:issues.length},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"invoice.three_way_match."+status.toLowerCase(),resourceType:"invoice",resourceId:invoiceId,occurredAt:now});
  return row;
 }
}
