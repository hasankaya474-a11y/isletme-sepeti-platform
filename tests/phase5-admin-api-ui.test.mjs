import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerPhase5Routes} from "../apps/api/src/phase5-routes.mjs";
import {renderSearchMatchingCenter} from "../apps/admin/src/search-matching-center-page.mjs";
import {renderBuyerSearch} from "../apps/buyer/src/search-page.mjs";
import {renderMatchingReview} from "../apps/buyer/src/matching-page.mjs";

function auth(permission,org="b1",type="BUSINESS"){return {userId:"u1",session:{mfaLevel:1},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE",organizationType:type,organizationId:org}};}
const req=(path,permission,body={})=>({method:"POST",path,body,requestId:"r",cookies:{csrf:"t"},headers:{"x-csrf-token":"t"},auth:auth(permission)});

test("buyer search API derives behavior from protected permission",async()=>{
 const router=new Router();
 registerPhase5Routes(router,{search:{search:()=>[{product:{id:"p"}}]},productCards:{build:()=>({id:"p"})},buyerLists:{},matching:{},searchAdmin:{}});
 const out=await router.handle(req("/v1/buyer/search","buyer.catalog.search",{query:"patates"}));
 assert.equal(out.ok,true);
 assert.deepEqual(out.data,[{id:"p"}]);
});

test("buyer list API derives business identity from membership",async()=>{
 const router=new Router();let seen;
 registerPhase5Routes(router,{search:{},productCards:{},buyerLists:{create:x=>(seen=x,x),addItem:x=>x},matching:{},searchAdmin:{}});
 const out=await router.handle(req("/v1/buyer/lists","buyer.list.manage",{businessId:"attacker",name:"Haftalık"}));
 assert.equal(out.ok,true);
 assert.equal(seen.businessId,"b1");
});

test("phase5 UI surfaces escape untrusted content and explain human review",()=>{
 const admin=renderSearchMatchingCenter({synonyms:[{term:"<script>x</script>",synonym:"patates",status:"ACTIVE"}]});
 const buyer=renderBuyerSearch({cards:[{id:"p",name:"<script>x</script>",baseUnit:"KG",activeOfferCount:1,availableQty:2,priceRangeTry:null}]});
 const match=renderMatchingReview({request:{id:"r"},candidates:[{id:"c",masterProductId:"p",confidence:.8}]});
 assert.doesNotMatch(admin,/<script>/);
 assert.doesNotMatch(buyer,/<script>/);
 assert.match(match,/siz onaylamadan/i);
});
