import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {OrderTransitionService} from "../packages/core/src/order-transition-service.mjs";
import {OutboxService} from "../packages/core/src/outbox-service.mjs";

test("order transition is tenant scoped and emits outbox",()=>{
 const s=new MemoryStore();s.insert("orders",{id:"o",businessId:"b1",supplierId:"s1",state:"NEW",updatedAt:"x"});
 const svc=new OrderTransitionService(s);
 assert.throws(()=>svc.transition({orderId:"o",to:"WAITING",organizationType:"SUPPLIER",organizationId:"s2",actorId:"u"}),/FORBIDDEN/);
 assert.equal(svc.transition({orderId:"o",to:"WAITING",organizationType:"SUPPLIER",organizationId:"s1",actorId:"u"}).state,"WAITING");
 assert.equal(s.find("outboxEvents",x=>x.eventType==="order.state_changed").length,1);
});

test("failed outbox can be retried without touching order",()=>{
 const s=new MemoryStore();s.insert("outboxEvents",{id:"e",status:"FAILED",attempts:1,lastError:"network",createdAt:"2026"});
 const outbox=new OutboxService(s);assert.equal(outbox.retry({id:"e",actorId:"admin"}).status,"PENDING");
 assert.equal(s.find("orders",()=>true).length,0);
});
