import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {DeliveryPolicyService} from "../packages/core/src/delivery-policy-service.mjs";
import {evaluateLeadWindow} from "../packages/core/src/delivery-sla-evaluator.mjs";

test("delivery zones are unique inside organization",()=>{
  const s=new MemoryStore(),svc=new DeliveryPolicyService(s);
  svc.createZone({organizationId:"org1",name:"İstanbul Avrupa",zoneCode:"IST-AVR",actorId:"admin"});
  assert.throws(()=>svc.createZone({organizationId:"org1",name:"Tekrar",zoneCode:"IST-AVR",actorId:"admin"}),/DELIVERY_ZONE_DUPLICATE/);
});

test("delivery SLA rejects invalid lead range",()=>{
  const s=new MemoryStore(),svc=new DeliveryPolicyService(s);
  assert.throws(()=>svc.createSla({organizationId:"org1",name:"Hızlı",minLeadMinutes:120,maxLeadMinutes:60,actorId:"admin"}),/DELIVERY_SLA_RANGE_INVALID/);
});

test("lead evaluator is deterministic",()=>{
  const r=evaluateLeadWindow({now:"2026-09-29T08:00:00+03:00",requestedAt:"2026-09-29T11:00:00+03:00",minLeadMinutes:120,maxLeadMinutes:300});
  assert.deepEqual(r,{allowed:true,reason:null,leadMinutes:180});
});
