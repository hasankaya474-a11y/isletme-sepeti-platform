import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {DeliveryCapacityService} from "../packages/core/src/delivery-capacity-service.mjs";
import {DeliveryOperationService} from "../packages/core/src/delivery-operation-service.mjs";
import {DeliveryEtaService} from "../packages/core/src/delivery-eta-service.mjs";
import {OrderTransitionService} from "../packages/core/src/order-transition-service.mjs";

test("capacity slot cannot be overbooked",()=>{
 const s=new MemoryStore(),capacity=new DeliveryCapacityService(s);
 const slot=capacity.createSlot({supplierId:"s",slotStart:"2026-09-30T08:00:00Z",slotEnd:"2026-09-30T10:00:00Z",capacityUnits:1,actorId:"u"});
 capacity.reserve({slotId:slot.id,supplierId:"s",actorId:"u"});
 assert.throws(()=>capacity.reserve({slotId:slot.id,supplierId:"s",actorId:"u"}),/CAPACITY_UNAVAILABLE/);
});

test("delivery uses explicit slot and transparent ETA source",()=>{
 const s=new MemoryStore();s.insert("orders",{id:"o",businessId:"b",supplierId:"s",state:"READY"});s.insert("orderLines",{id:"ol",orderId:"o",quantityMilli:1000});
 const capacity=new DeliveryCapacityService(s),slot=capacity.createSlot({supplierId:"s",slotStart:"2026-09-30T08:00:00Z",slotEnd:"2026-09-30T10:00:00Z",capacityUnits:1,actorId:"u"});
 const ops=new DeliveryOperationService(s,capacity,new OrderTransitionService(s));
 const d=ops.create({orderId:"o",supplierId:"s",capacitySlotId:slot.id,scheduledEnd:"2026-09-30T10:00:00Z",actorId:"u"});
 assert.equal(new DeliveryEtaService(s).get({deliveryId:d.id,businessId:"b"}).source,"SCHEDULE_WINDOW_END");
 ops.dispatch({deliveryId:d.id,supplierId:"s",etaAt:"2026-09-30T09:30:00Z",actorId:"u"});
 assert.equal(s.get("orders","o").state,"SHIPPED");
 assert.equal(new DeliveryEtaService(s).get({deliveryId:d.id,businessId:"b"}).source,"SUPPLIER_CONFIRMED");
});
