import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerPhase6Routes} from "../apps/api/src/phase6-routes.mjs";
import {renderQuoteComparison} from "../apps/buyer/src/quote-comparison-page.mjs";
import {renderRfqCenter} from "../apps/admin/src/rfq-center-page.mjs";

function auth(permission,org,type){return {userId:"u1",session:{mfaLevel:1},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE",organizationType:type,organizationId:org}};}
const req=(path,permission,org,type,body={})=>({method:"POST",path,body,requestId:"r",cookies:{csrf:"t"},headers:{"x-csrf-token":"t"},auth:auth(permission,org,type)});

test("buyer RFQ API derives business identity from membership",async()=>{
 let seen;const router=new Router();
 registerPhase6Routes(router,{rfqs:{create:x=>(seen=x,x)},quotes:{},comparison:{},messages:{},rfqAdmin:{}});
 const out=await router.handle(req("/v1/buyer/rfqs","rfq.create","b1","BUSINESS",{businessId:"attacker",title:"X"}));
 assert.equal(out.ok,true);assert.equal(seen.businessId,"b1");
});

test("supplier quote API derives supplier identity from membership",async()=>{
 let seen;const router=new Router();
 registerPhase6Routes(router,{rfqs:{},quotes:{createDraft:x=>(seen=x,x)},comparison:{},messages:{},rfqAdmin:{}});
 const out=await router.handle(req("/v1/supplier/quotes","rfq.respond_own","s1","SUPPLIER",{supplierId:"attacker",rfqId:"r"}));
 assert.equal(out.ok,true);assert.equal(seen.supplierId,"s1");
});

test("comparison and admin pages escape untrusted data and do not announce winner",()=>{
 const h=renderQuoteComparison({quotes:[{quoteId:"q",supplierId:"<script>x</script>",currency:"TRY",netMinor:100,taxMinor:20,grossMinor:120}]});
 const a=renderRfqCenter({rfqs:[{id:"r",title:"<script>x</script>",status:"OPEN"}]});
 assert.doesNotMatch(h,/<script>/);assert.doesNotMatch(a,/<script>/);assert.match(h,/Sistem kazanan tedarikçi seçmez/);
});
