import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerPhase7Routes} from "../apps/api/src/phase7-routes.mjs";
import {renderBuyerCart} from "../apps/buyer/src/cart-page.mjs";
import {renderProcurementCenter} from "../apps/admin/src/procurement-center-page.mjs";

function auth(permission,org="b1"){return {userId:"u1",session:{mfaLevel:1},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE",organizationType:"BUSINESS",organizationId:org}};}
const req=(path,permission,body={})=>({method:"POST",path,body,requestId:"r",cookies:{csrf:"t"},headers:{"x-csrf-token":"t"},auth:auth(permission)});

test("cart API derives business identity from membership",async()=>{
 let seen;const router=new Router();
 registerPhase7Routes(router,{carts:{create:x=>(seen=x,x)},requisitions:{},approvals:{},policies:{},poReadiness:{},procurementAdmin:{}});
 const out=await router.handle(req("/v1/buyer/carts","cart.manage",{businessId:"attacker",name:"Sepet"}));
 assert.equal(out.ok,true);assert.equal(seen.businessId,"b1");
});

test("PO-ready API blocks when readiness has blockers",async()=>{
 const router=new Router();
 registerPhase7Routes(router,{carts:{},requisitions:{markPoReady:x=>x},approvals:{},policies:{},poReadiness:{evaluate:()=>({ready:false,blockers:["X"]})},procurementAdmin:{}});
 const out=await router.handle(req("/v1/buyer/requisitions/po-ready","cart.manage",{requisitionId:"r"}));
 assert.equal(out.ok,false);assert.equal(out.error.code,"PO_NOT_READY");
});

test("cart and admin UI escape untrusted content",()=>{
 const c=renderBuyerCart({cart:{name:"<script>x</script>",status:"ACTIVE"},lines:[]});
 const a=renderProcurementCenter({rules:[{name:"<script>x</script>",status:"ACTIVE"}]});
 assert.doesNotMatch(c,/<script>/);assert.doesNotMatch(a,/<script>/);
});
