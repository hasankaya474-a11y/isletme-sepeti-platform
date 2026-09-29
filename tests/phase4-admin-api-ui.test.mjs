import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerPhase4Routes} from "../apps/api/src/phase4-routes.mjs";
import {renderPhase4Operations} from "../apps/admin/src/phase4-operations-page.mjs";

function auth(permission){return {userId:"admin1",session:{mfaLevel:1},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE",organizationType:"PLATFORM",organizationId:"platform"}};}
const req=(path,body={})=>({method:"POST",path,body,requestId:"r",cookies:{csrf:"t"},headers:{"x-csrf-token":"t"},auth:auth("admin.configuration.manage")});

test("phase4 admin page exposes codeless operations and escapes content",()=>{
 const h=renderPhase4Operations({priceBooks:[{name:"<script>x</script>"}],deliveryZones:[{}]});
 assert.match(h,/Fiyat Listeleri/);
 assert.match(h,/Stok Lokasyonları/);
 assert.match(h,/Teslimat Bölgeleri/);
 assert.doesNotMatch(h,/<script>/);
});

test("phase4 API propagates authenticated admin actor",async()=>{
 const router=new Router(); let seen;
 registerPhase4Routes(router,{
   pricing:{createPriceBook:x=>(seen=x,x),attachOfferPrice:x=>x},
   stock:{createLocation:x=>x,receive:x=>x},
   reservations:{release:x=>x},
   delivery:{createZone:x=>x,createCalendar:x=>x,createSla:x=>x}
 });
 const out=await router.handle(req("/v1/admin/pricing/price-books",{name:"Ana Liste",currency:"TRY"}));
 assert.equal(out.ok,true);
 assert.equal(seen.actorId,"admin1");
});

test("phase4 admin mutation rejects missing MFA",async()=>{
 const router=new Router();
 registerPhase4Routes(router,{
   pricing:{createPriceBook:x=>x,attachOfferPrice:x=>x},
   stock:{createLocation:x=>x,receive:x=>x},
   reservations:{release:x=>x},
   delivery:{createZone:x=>x,createCalendar:x=>x,createSla:x=>x}
 });
 const r=req("/v1/admin/delivery/zones",{organizationId:"o",name:"İstanbul",zoneCode:"IST"});
 r.auth.session.mfaLevel=0;
 const out=await router.handle(r);
 assert.equal(out.error.code,"MFA_REQUIRED");
});
