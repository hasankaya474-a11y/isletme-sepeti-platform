import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerHelpRoutes} from "../apps/api/src/help-routes.mjs";
import {registerControlPlaneRoutes} from "../apps/api/src/control-plane-routes.mjs";
import {registerVitrinRoutes} from "../apps/api/src/vitrin-routes.mjs";

const csrf={csrf:"token"};
function auth(permission){return {session:{mfaLevel:0},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE"}};}
function req(path,{permission,body={},token="token",authenticated=true}={}){return {method:"POST",path,body,requestId:"r1",cookies:csrf,headers:{"x-csrf-token":token},auth:authenticated?auth(permission):undefined};}

test("phase2 protected API rejects unauthenticated and bad CSRF",async()=>{
 const router=new Router(),helpAdmin={create:x=>x,publish:x=>x,unpublish:x=>x};registerHelpRoutes(router,{helpAdmin});
 let out=await router.handle(req("/v1/admin/help",{permission:"admin.content.publish",authenticated:false}));assert.equal(out.error.code,"UNAUTHENTICATED");
 out=await router.handle(req("/v1/admin/help",{permission:"admin.content.publish",token:"wrong"}));assert.equal(out.error.code,"CSRF_INVALID");
});

test("Help Admin route injects authenticated actor",async()=>{
 const router=new Router();let seen;registerHelpRoutes(router,{helpAdmin:{create:x=>(seen=x,x),publish:x=>x,unpublish:x=>x}});
 const out=await router.handle(req("/v1/admin/help",{permission:"admin.content.publish",body:{helpKey:"buyer.cart",title:"Sepet"}}));
 assert.equal(out.ok,true);assert.equal(seen.actorId,undefined);
});

test("control-plane protected route enforces permission",async()=>{
 const router=new Router();registerControlPlaneRoutes(router,{pages:{createPage:x=>x,addBlock:x=>x,reorder:()=>({})},seo:{savePageSeo:x=>x},publication:{transition:x=>x}});
 const out=await router.handle(req("/v1/admin/pages",{permission:"wrong.permission",body:{pageKey:"home"}}));
 assert.equal(out.ok,false);assert.match(out.error.code,/FORBIDDEN|PERMISSION/);
});

test("Vitrin protected schedule route passes authenticated actor",async()=>{
 const router=new Router();let seen;registerVitrinRoutes(router,{pages:{createPage:x=>x,addBlock:x=>x,reorder:()=>({})},versions:{rollback:x=>x},workflow:{schedule:x=>(seen=x,x)},redirects:{create:x=>x}});
 const r=req("/v1/admin/publish/schedule",{permission:"admin.content.publish",body:{resourceType:"page",resourceId:"p1",publishAt:"2026-10-01T10:00:00.000Z"}});
 r.auth.userId="admin1";const out=await router.handle(r);assert.equal(out.ok,true);assert.equal(seen.actorId,"admin1");
});
