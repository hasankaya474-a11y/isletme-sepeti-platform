import {newId} from "./id.mjs";
export class DeliveryOperationService{
 constructor(store,capacity,orderTransitions){this.store=store;this.capacity=capacity;this.orderTransitions=orderTransitions;}
 create({orderId,supplierId,capacitySlotId,deliveryZoneId=null,deliverySlaId=null,scheduledStart=null,scheduledEnd=null,actorId}){
  const order=this.store.get("orders",orderId);if(!order||order.supplierId!==supplierId)throw new Error("ORDER_FORBIDDEN");
  if(!["ACCEPTED","PARTIALLY_ACCEPTED","PREPARING","READY"].includes(order.state))throw new Error("ORDER_NOT_DELIVERY_READY");
  if(this.store.find("deliveries",x=>x.orderId===orderId).length)throw new Error("DELIVERY_ALREADY_EXISTS");
  this.capacity.reserve({slotId:capacitySlotId,supplierId,actorId});
  const now=new Date().toISOString(),row={id:newId("delivery"),orderId,businessId:order.businessId,supplierId,deliveryZoneId,deliverySlaId,capacitySlotId,status:"SCHEDULED",scheduledStart,scheduledEnd,etaAt:null,createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("deliveries",row);
  for(const line of this.store.find("orderLines",x=>x.orderId===orderId))this.store.insert("deliveryItems",{id:newId("delitem"),deliveryId:row.id,orderLineId:line.id,plannedQtyMilli:line.quantityMilli,deliveredQtyMilli:0});
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"delivery",aggregateId:row.id,eventType:"delivery.scheduled",payload:{deliveryId:row.id,orderId},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.create",resourceType:"delivery",resourceId:row.id,occurredAt:now});
  return row;
 }
 dispatch({deliveryId,supplierId,etaAt=null,actorId}){
  const delivery=this.store.get("deliveries",deliveryId);if(!delivery||delivery.supplierId!==supplierId)throw new Error("DELIVERY_FORBIDDEN");
  if(delivery.status!=="SCHEDULED")throw new Error("DELIVERY_STATE_INVALID");
  const order=this.store.get("orders",delivery.orderId);if(order.state!=="READY")throw new Error("ORDER_NOT_READY");
  this.orderTransitions.transition({orderId:order.id,to:"SHIPPED",organizationType:"SUPPLIER",organizationId:supplierId,actorId});
  const now=new Date().toISOString();
  const row=this.store.update("deliveries",deliveryId,x=>({...x,status:"IN_TRANSIT",etaAt,updatedAt:now}));
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"delivery",aggregateId:deliveryId,eventType:"delivery.dispatched",payload:{deliveryId,orderId:delivery.orderId},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.dispatch",resourceType:"delivery",resourceId:deliveryId,occurredAt:now});
  return row;
 }
 setEta({deliveryId,supplierId,etaAt,actorId}){
  const d=this.store.get("deliveries",deliveryId);if(!d||d.supplierId!==supplierId)throw new Error("DELIVERY_FORBIDDEN");
  if(!etaAt||Number.isNaN(new Date(etaAt).getTime()))throw new TypeError("ETA_INVALID");
  const now=new Date().toISOString();
  const row=this.store.update("deliveries",deliveryId,x=>({...x,etaAt,updatedAt:now}));
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"delivery",aggregateId:deliveryId,eventType:"delivery.eta_updated",payload:{deliveryId,etaAt},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.eta.set",resourceType:"delivery",resourceId:deliveryId,occurredAt:new Date().toISOString()});return row;
 }
}
