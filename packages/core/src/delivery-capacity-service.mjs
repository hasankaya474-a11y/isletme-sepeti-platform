import {newId} from "./id.mjs";
export class DeliveryCapacityService{
 constructor(store){this.store=store;}
 createSlot({supplierId,deliveryZoneId=null,deliveryCalendarId=null,slotStart,slotEnd,capacityUnits,actorId}){
  if(!supplierId||!slotStart||!slotEnd||!Number.isSafeInteger(capacityUnits)||capacityUnits<=0||!actorId)throw new TypeError("CAPACITY_SLOT_FIELDS_REQUIRED");
  if(new Date(slotEnd)<=new Date(slotStart))throw new Error("CAPACITY_SLOT_RANGE_INVALID");
  const now=new Date().toISOString(),row={id:newId("capslot"),supplierId,deliveryZoneId,deliveryCalendarId,slotStart,slotEnd,capacityUnits,reservedUnits:0,status:"OPEN",createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.capacity.create",resourceType:"delivery_capacity_slot",resourceId:row.id,occurredAt:now});
  return this.store.insert("deliveryCapacitySlots",row);
 }
 reserve({slotId,supplierId,actorId}){
  const slot=this.store.get("deliveryCapacitySlots",slotId);if(!slot||slot.supplierId!==supplierId)throw new Error("CAPACITY_SLOT_FORBIDDEN");
  if(slot.status!=="OPEN"||slot.reservedUnits>=slot.capacityUnits)throw new Error("CAPACITY_UNAVAILABLE");
  const now=new Date().toISOString();
  const row=this.store.update("deliveryCapacitySlots",slotId,x=>({...x,reservedUnits:x.reservedUnits+1,updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.capacity.reserve",resourceType:"delivery_capacity_slot",resourceId:slotId,occurredAt:now});
  return row;
 }
 release({slotId,supplierId,actorId}){
  const slot=this.store.get("deliveryCapacitySlots",slotId);if(!slot||slot.supplierId!==supplierId)throw new Error("CAPACITY_SLOT_FORBIDDEN");
  if(slot.reservedUnits<=0)throw new Error("CAPACITY_NOT_RESERVED");
  return this.store.update("deliveryCapacitySlots",slotId,x=>({...x,reservedUnits:x.reservedUnits-1,updatedAt:new Date().toISOString()}));
 }
}
