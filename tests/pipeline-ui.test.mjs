import test from "node:test";import assert from "node:assert/strict";import {protect} from "../packages/core/src/request-pipeline.mjs";import {adminShell,identityPage} from "../apps/admin/src/ui-shell.mjs";
const handler=protect(async()=>({ok:true}),{permission:"order.read_own",tenantFromRequest:()=>({type:"BUSINESS",id:"b1"}),csrf:false});
test("pipeline rejects unauthenticated",async()=>{await assert.rejects(()=>handler({method:"GET"}),/UNAUTHENTICATED/);});
test("pipeline allows scoped tenant request",async()=>{const req={method:"GET",auth:{session:{mfaLevel:0},grants:[{permission:"order.read_own",scope:"BUSINESS:b1"}],requiredScope:"BUSINESS:b1",membership:{status:"ACTIVE",organizationType:"BUSINESS",organizationId:"b1"}}};assert.deepEqual(await handler(req),{ok:true});});
test("admin shell contains locked navigation",()=>{const s=adminShell({active:"Üyelik & Yetki"});assert.ok(s.navigation.find(x=>x.label==="Üyelik & Yetki"&&x.active));});
test("identity page exposes codeless invite action",()=>assert.equal(identityPage().toolbar[0].id,"invite"));
