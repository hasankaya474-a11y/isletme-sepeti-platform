import {newId} from "./id.mjs";
export class ReceivingService{
 constructor(store,orderTransitions){this.store=store;this.orderTransitions=orderTransitions;}
 start({deliveryId,businessId,actorId}){
  const d=this.store.get("deliveries",deliveryId);if(!d||d.businessId!==businessId)throw new Error("DELIVERY_FORBIDDEN");
  if(d.status!=="IN_TRANSIT")throw new Error("DELIVERY_NOT_RECEIVABLE");
  if(this.store.find("receivings",x=>x.deliveryId===deliveryId).length)throw new Error("RECEIVING_ALREADY_EXISTS");
  const now=new Date().toISOString(),row={id:newId("receiving"),deliveryId,businessId,status:"OPEN",receivedBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"receiving.start",resourceType:"receiving",resourceId:row.id,occurredAt:now});
  return this.store.insert("receivings",row);
 }
 recordLine({receivingId,businessId,deliveryItemId,acceptedQtyMilli,rejectedQtyMilli,reason=null,actorId}){
  const r=this.store.get("receivings",receivingId);if(!r||r.businessId!==businessId)throw new Error("RECEIVING_FORBIDDEN");
  if(r.status!=="OPEN")throw new Error("RECEIVING_NOT_OPEN");
  const item=this.store.get("deliveryItems",deliveryItemId);if(!item||item.deliveryId!==r.deliveryId)throw new Error("DELIVERY_ITEM_INVALID");
  if(!Number.isSafeInteger(acceptedQtyMilli)||!Number.isSafeInteger(rejectedQtyMilli)||acceptedQtyMilli<0||rejectedQtyMilli<0||acceptedQtyMilli+rejectedQtyMilli>item.plannedQtyMilli)throw new Error("RECEIVING_QUANTITY_INVALID");
  if(this.store.find("receivingLines",x=>x.receivingId===receivingId&&x.deliveryItemId===deliveryItemId).length)throw new Error("RECEIVING_LINE_DUPLICATE");
  return this.store.insert("receivingLines",{id:newId("recvline"),receivingId,deliveryItemId,acceptedQtyMilli,rejectedQtyMilli,reason,createdAt:new Date().toISOString()});
 }
 complete({receivingId,businessId,actorId}){
  const r=this.store.get("receivings",receivingId);if(!r||r.businessId!==businessId)throw new Error("RECEIVING_FORBIDDEN");
  if(r.status!=="OPEN")throw new Error("RECEIVING_NOT_OPEN");
  const items=this.store.find("deliveryItems",x=>x.deliveryId===r.deliveryId),lines=this.store.find("receivingLines",x=>x.receivingId===receivingId);
  if(lines.length!==items.length)throw new Error("RECEIVING_LINES_INCOMPLETE");
  let full=true,rejected=false;
  for(const item of items){const l=lines.find(x=>x.deliveryItemId===item.id);const delivered=l.acceptedQtyMilli+l.rejectedQtyMilli;if(delivered!==item.plannedQtyMilli)full=false;if(l.rejectedQtyMilli>0)rejected=true;this.store.update("deliveryItems",item.id,x=>({...x,deliveredQtyMilli:delivered}));}
  const delivery=this.store.get("deliveries",r.deliveryId),to=full&&!rejected?"DELIVERED":"PARTIALLY_DELIVERED",now=new Date().toISOString();
  this.store.update("deliveries",delivery.id,x=>({...x,status:to,updatedAt:now}));
  this.orderTransitions.transition({orderId:delivery.orderId,to,organizationType:"BUSINESS",organizationId:businessId,actorId});
  const row=this.store.update("receivings",receivingId,x=>({...x,status:rejected?"DISPUTED":"COMPLETED",updatedAt:now}));
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"receiving",aggregateId:receivingId,eventType:"receiving.completed",payload:{receivingId,deliveryId:delivery.id,status:row.status},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"receiving.complete",resourceType:"receiving",resourceId:receivingId,occurredAt:now});return row;
 }
}
