import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerPhase8Routes} from "../apps/api/src/phase8-routes.mjs";
import {renderBuyerOrders} from "../apps/buyer/src/orders-page.mjs";
import {renderOrderCenter} from "../apps/admin/src/order-center-page.mjs";

function auth(permission,org="b1",type="BUSINESS"){return {userId:"u",session:{mfaLevel:1},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE",organizationType:type,organizationId:org}};}
const req=(path,permission,body={},headers={})=>({method:"POST",path,body,headers:{"x-csrf-token":"t",...headers},cookies:{csrf:"t"},requestId:"r",auth:auth(permission)});

test("order create API requires idempotency key",async()=>{
 const router=new Router();registerPhase8Routes(router,{orderCreation:{createFromRequisition:x=>x},orderTransitions:{},outbox:{}});
 const out=await router.handle(req("/v1/buyer/orders/create-from-requisition","order.create_from_requisition",{requisitionId:"r"}));
 assert.equal(out.ok,false);assert.equal(out.error.code,"IDEMPOTENCY_KEY_REQUIRED");
});

test("order create API derives business identity from membership",async()=>{
 let seen;const router=new Router();registerPhase8Routes(router,{orderCreation:{createFromRequisition:x=>(seen=x,x)},orderTransitions:{},outbox:{}});
 const out=await router.handle(req("/v1/buyer/orders/create-from-requisition","order.create_from_requisition",{requisitionId:"r",businessId:"attacker"},{"idempotency-key":"abc"}));
 assert.equal(out.ok,true);assert.equal(seen.businessId,"b1");assert.equal(seen.idempotencyKey,"abc");
});

test("order UIs escape untrusted data",()=>{
 const b=renderBuyerOrders({orders:[{id:"<script>x</script>",supplierId:"s",state:"NEW",grossMinor:100,currency:"TRY"}]});
 const a=renderOrderCenter({failedOutbox:[{id:"e",eventType:"<script>x</script>"}]});
 assert.doesNotMatch(b,/<script>/);assert.doesNotMatch(a,/<script>/);
});
