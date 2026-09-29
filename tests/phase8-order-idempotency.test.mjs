import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {OrderCreationService} from "../packages/core/src/order-creation-service.mjs";

function fixture(){
 const s=new MemoryStore();
 s.insert("purchaseRequisitions",{id:"r",cartId:"c",businessId:"b",status:"PO_READY",currency:"TRY"});
 s.insert("cartLines",{id:"l1",cartId:"c",masterProductId:"p1",supplierId:"s1",supplierOfferId:"o1",sourceQuoteLineId:null,quantityMilli:10000,unitPriceMinor:1000,currency:"TRY",taxRateBps:2000,status:"ACTIVE"});
 s.insert("cartLines",{id:"l2",cartId:"c",masterProductId:"p2",supplierId:"s2",supplierOfferId:"o2",sourceQuoteLineId:null,quantityMilli:5000,unitPriceMinor:2000,currency:"TRY",taxRateBps:1000,status:"ACTIVE"});
 return s;
}

test("order creation groups by explicit supplier and is idempotent",()=>{
 const s=fixture(),svc=new OrderCreationService(s);
 const first=svc.createFromRequisition({requisitionId:"r",businessId:"b",idempotencyKey:"key-1",actorId:"u"});
 const second=svc.createFromRequisition({requisitionId:"r",businessId:"b",idempotencyKey:"key-1",actorId:"u"});
 assert.equal(first.orderIds.length,2);
 assert.deepEqual(second.orderIds,first.orderIds);
 assert.equal(second.idempotentReplay,true);
 assert.equal(s.find("orders",()=>true).length,2);
 assert.equal(s.find("outboxEvents",x=>x.eventType==="order.created").length,2);
 assert.equal(s.find("orderSnapshots",()=>true).length,2);
 assert.ok(s.find("orderSnapshots",()=>true).every(x=>x.snapshotSha256.length===64));
});

test("different idempotency key cannot recreate already ordered requisition",()=>{
 const s=fixture(),svc=new OrderCreationService(s);
 svc.createFromRequisition({requisitionId:"r",businessId:"b",idempotencyKey:"key-1",actorId:"u"});
 assert.throws(()=>svc.createFromRequisition({requisitionId:"r",businessId:"b",idempotencyKey:"key-2",actorId:"u"}),/REQUISITION_ALREADY_ORDERED/);
});

test("snapshot does not change when cart source changes later",()=>{
 const s=fixture(),svc=new OrderCreationService(s);
 const out=svc.createFromRequisition({requisitionId:"r",businessId:"b",idempotencyKey:"key",actorId:"u"});
 const orderId=out.orderIds.find(id=>s.get("orders",id).supplierId==="s1");
 const before=s.get("orderSnapshots",s.find("orderSnapshots",x=>x.orderId===orderId)[0].id);
 s.update("cartLines","l1",x=>({...x,unitPriceMinor:999999}));
 const after=s.get("orderSnapshots",before.id);
 assert.deepEqual(after.snapshot,before.snapshot);
});
