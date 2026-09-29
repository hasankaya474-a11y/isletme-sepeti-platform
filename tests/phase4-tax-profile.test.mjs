import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {TaxProfileService} from "../packages/core/src/tax-profile-service.mjs";

test("tax profile validates rate and audits lifecycle",()=>{
  const s=new MemoryStore(),svc=new TaxProfileService(s);
  assert.throws(()=>svc.create({name:"Hatalı",countryCode:"TR",taxRateBps:10001,actorId:"admin"}),/INVALID_TAX_RATE/);
  const row=svc.create({name:"KDV %20",countryCode:"TR",taxRateBps:2000,actorId:"admin"});
  assert.equal(row.status,"DRAFT");
  assert.equal(svc.transition({id:row.id,to:"ACTIVE",actorId:"admin2"}).status,"ACTIVE");
  assert.equal(s.find("audit",x=>x.resourceType==="tax_profile").length,2);
});
