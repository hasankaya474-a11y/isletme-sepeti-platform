import {newId} from "./id.mjs";
export class DeliveryAdminService{
 constructor(store,capacity){this.store=store;this.capacity=capacity;}
 listDeliveries({status=null}={}){return this.store.find("deliveries",x=>!status||x.status===status);}
 listRmas({status=null}={}){return this.store.find("returnRmas",x=>!status||x.status===status);}
 cancel({deliveryId,actorId}){
  const d=this.store.get("deliveries",deliveryId);if(!d)throw new Error("DELIVERY_NOT_FOUND");
  if(!["PLANNED","SCHEDULED"].includes(d.status))throw new Error("DELIVERY_CANNOT_CANCEL");
  if(d.capacitySlotId)this.capacity.release({slotId:d.capacitySlotId,supplierId:d.supplierId,actorId});
  const now=new Date().toISOString(),row=this.store.update("deliveries",deliveryId,x=>({...x,status:"CANCELLED",updatedAt:now}));
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"delivery",aggregateId:deliveryId,eventType:"delivery.cancelled",payload:{deliveryId},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.admin.cancel",resourceType:"delivery",resourceId:deliveryId,occurredAt:now});return row;
 }
}
