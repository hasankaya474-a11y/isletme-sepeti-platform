import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerPhase9Routes} from "../apps/api/src/phase9-routes.mjs";
import {renderBuyerDelivery} from "../apps/buyer/src/delivery-page.mjs";
import {renderDeliveryCenter} from "../apps/admin/src/delivery-center-page.mjs";
import {renderRma} from "../apps/buyer/src/rma-page.mjs";

function auth(permission,org,type){return {userId:"u",session:{mfaLevel:1},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE",organizationType:type,organizationId:org}};}
const req=(path,permission,org,type,body={})=>({method:"POST",path,body,requestId:"r",cookies:{csrf:"t"},headers:{"x-csrf-token":"t"},auth:auth(permission,org,type)});

test("supplier delivery API derives supplier identity from membership",async()=>{
 let seen;const router=new Router();
 registerPhase9Routes(router,{capacity:{createSlot:x=>(seen=x,x)},deliveryOps:{},eta:{},receiving:{},rmas:{},deliveryAdmin:{}});
 const out=await router.handle(req("/v1/supplier/delivery/capacity-slots","delivery.manage_own","s1","SUPPLIER",{supplierId:"attacker",capacityUnits:1,slotStart:"a",slotEnd:"b"}));
 assert.equal(out.ok,true);assert.equal(seen.supplierId,"s1");
});

test("buyer receiving API derives business identity from membership",async()=>{
 let seen;const router=new Router();
 registerPhase9Routes(router,{capacity:{},deliveryOps:{},eta:{},receiving:{start:x=>(seen=x,x)},rmas:{},deliveryAdmin:{}});
 const out=await router.handle(req("/v1/buyer/receivings","receiving.manage_own","b1","BUSINESS",{businessId:"attacker",deliveryId:"d"}));
 assert.equal(out.ok,true);assert.equal(seen.businessId,"b1");
});

test("delivery/RMA/admin UIs escape untrusted content and expose ETA source",()=>{
 const b=renderBuyerDelivery({delivery:{id:"<script>x</script>",status:"IN_TRANSIT"},eta:{etaAt:"x",source:"SUPPLIER_CONFIRMED"}});
 const a=renderDeliveryCenter({rmas:[{id:"x"}]});
 const r=renderRma({rmas:[{id:"r",status:"REQUESTED",reason:"<script>x</script>"}]});
 assert.doesNotMatch(b,/<script>/);assert.doesNotMatch(r,/<script>/);assert.match(b,/SUPPLIER_CONFIRMED/);assert.match(a,/Teslimat & RMA Merkezi/);
});
