import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {ReceivingService} from "../packages/core/src/receiving-service.mjs";
import {OrderTransitionService} from "../packages/core/src/order-transition-service.mjs";
import {RmaService} from "../packages/core/src/rma-service.mjs";

test("full receiving transitions shipped order to delivered",()=>{
 const s=new MemoryStore();s.insert("orders",{id:"o",businessId:"b",supplierId:"s",state:"SHIPPED"});s.insert("orderLines",{id:"ol",orderId:"o",quantityMilli:1000});
 s.insert("deliveries",{id:"d",orderId:"o",businessId:"b",supplierId:"s",status:"IN_TRANSIT"});s.insert("deliveryItems",{id:"di",deliveryId:"d",orderLineId:"ol",plannedQtyMilli:1000,deliveredQtyMilli:0});
 const svc=new ReceivingService(s,new OrderTransitionService(s)),r=svc.start({deliveryId:"d",businessId:"b",actorId:"u"});
 svc.recordLine({receivingId:r.id,businessId:"b",deliveryItemId:"di",acceptedQtyMilli:1000,rejectedQtyMilli:0,actorId:"u"});
 assert.equal(svc.complete({receivingId:r.id,businessId:"b",actorId:"u"}).status,"COMPLETED");
 assert.equal(s.get("orders","o").state,"DELIVERED");assert.equal(s.get("deliveries","d").status,"DELIVERED");
});

test("short or rejected receiving becomes disputed and partially delivered",()=>{
 const s=new MemoryStore();s.insert("orders",{id:"o",businessId:"b",supplierId:"s",state:"SHIPPED"});s.insert("orderLines",{id:"ol",orderId:"o",quantityMilli:1000});
 s.insert("deliveries",{id:"d",orderId:"o",businessId:"b",supplierId:"s",status:"IN_TRANSIT"});s.insert("deliveryItems",{id:"di",deliveryId:"d",orderLineId:"ol",plannedQtyMilli:1000,deliveredQtyMilli:0});
 const svc=new ReceivingService(s,new OrderTransitionService(s)),r=svc.start({deliveryId:"d",businessId:"b",actorId:"u"});
 svc.recordLine({receivingId:r.id,businessId:"b",deliveryItemId:"di",acceptedQtyMilli:700,rejectedQtyMilli:100,actorId:"u",reason:"Eksik/hasarlı"});
 assert.equal(svc.complete({receivingId:r.id,businessId:"b",actorId:"u"}).status,"DISPUTED");
 assert.equal(s.get("orders","o").state,"PARTIALLY_DELIVERED");
});

test("RMA is tenant scoped and creates no payment/refund",()=>{
 const s=new MemoryStore();s.insert("orders",{id:"o",businessId:"b",supplierId:"s",state:"DELIVERED"});s.insert("orderLines",{id:"ol",orderId:"o",quantityMilli:1000});
 const svc=new RmaService(s),r=svc.request({orderId:"o",businessId:"b",reason:"Hasarlı",lines:[{orderLineId:"ol",quantityMilli:500}],actorId:"u"});
 assert.throws(()=>svc.decide({rmaId:r.id,supplierId:"other",decision:"APPROVED",actorId:"x"}),/FORBIDDEN/);
 assert.equal(svc.decide({rmaId:r.id,supplierId:"s",decision:"APPROVED",actorId:"x"}).status,"APPROVED");
 assert.equal(s.find("payments",()=>true).length,0);assert.equal(s.find("refunds",()=>true).length,0);
});
