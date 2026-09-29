import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {RfqMessageService} from "../packages/core/src/rfq-message-service.mjs";

test("RFQ messaging is participant scoped",()=>{
 const s=new MemoryStore();
 s.insert("rfqs",{id:"r",businessId:"b1",status:"OPEN"});
 s.insert("rfqInvitations",{id:"i",rfqId:"r",supplierId:"s1",status:"INVITED"});
 const m=new RfqMessageService(s);
 assert.throws(()=>m.post({rfqId:"r",organizationType:"SUPPLIER",organizationId:"s2",body:"x",actorId:"u"}),/FORBIDDEN/);
 const row=m.post({rfqId:"r",organizationType:"SUPPLIER",organizationId:"s1",body:"Teslimat yarın.",actorId:"u"});
 assert.equal(row.senderOrgId,"s1");
 assert.equal(m.list({rfqId:"r",organizationType:"BUSINESS",organizationId:"b1"}).length,1);
});
