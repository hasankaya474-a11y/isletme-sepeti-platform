import {newId} from "./id.mjs";
export class RmaService{
 constructor(store){this.store=store;}
 request({orderId,businessId,reason,lines,actorId}){
  const order=this.store.get("orders",orderId);if(!order||order.businessId!==businessId)throw new Error("ORDER_FORBIDDEN");
  if(!["DELIVERED","PARTIALLY_DELIVERED","COMPLETED"].includes(order.state))throw new Error("ORDER_NOT_RETURNABLE");
  if(!reason||!Array.isArray(lines)||!lines.length)throw new TypeError("RMA_FIELDS_REQUIRED");
  const orderLines=this.store.find("orderLines",x=>x.orderId===orderId),now=new Date().toISOString();
  for(const l of lines){const ol=orderLines.find(x=>x.id===l.orderLineId);if(!ol||!Number.isSafeInteger(l.quantityMilli)||l.quantityMilli<=0||l.quantityMilli>ol.quantityMilli)throw new Error("RMA_LINE_INVALID");}
  const rma={id:newId("rma"),orderId,businessId,supplierId:order.supplierId,status:"REQUESTED",reason,requestedBy:actorId,createdAt:now,updatedAt:now};this.store.insert("returnRmas",rma);
  for(const l of lines)this.store.insert("returnRmaLines",{id:newId("rmaline"),rmaId:rma.id,orderLineId:l.orderLineId,quantityMilli:l.quantityMilli,reason:l.reason??null,createdAt:now});
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"rma",aggregateId:rma.id,eventType:"rma.requested",payload:{rmaId:rma.id,orderId},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"rma.request",resourceType:"rma",resourceId:rma.id,occurredAt:now});return rma;
 }
 decide({rmaId,supplierId,decision,actorId}){
  if(!["APPROVED","REJECTED"].includes(decision))throw new Error("RMA_DECISION_INVALID");
  const r=this.store.get("returnRmas",rmaId);if(!r||r.supplierId!==supplierId)throw new Error("RMA_FORBIDDEN");
  if(r.status!=="REQUESTED")throw new Error("RMA_STATE_INVALID");
  const now=new Date().toISOString();
  const row=this.store.update("returnRmas",rmaId,x=>({...x,status:decision,updatedAt:now}));
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"rma",aggregateId:rmaId,eventType:"rma.decided",payload:{rmaId,decision},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"rma."+decision.toLowerCase(),resourceType:"rma",resourceId:rmaId,occurredAt:new Date().toISOString()});return row;
 }
}
