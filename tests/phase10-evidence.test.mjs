import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {EvidenceService} from "../packages/core/src/evidence-service.mjs";
import {CommercialEvidenceFacade} from "../packages/core/src/commercial-evidence-facade.mjs";

test("commercial evidence is participant scoped and append-only",()=>{
 const s=new MemoryStore();s.insert("supplierInvoices",{id:"i",businessId:"b",supplierId:"s"});
 const evidence=new EvidenceService(s),facade=new CommercialEvidenceFacade(s,evidence);
 assert.throws(()=>facade.attachInvoice({invoiceId:"i",organizationType:"BUSINESS",organizationId:"other",evidenceType:"PDF",evidenceSha256:"abc",actorId:"u"}),/FORBIDDEN/);
 const row=facade.attachInvoice({invoiceId:"i",organizationType:"BUSINESS",organizationId:"b",evidenceType:"PDF",evidenceSha256:"abc",actorId:"u"});
 assert.equal(row.entityId,"i");assert.equal(evidence.list("invoice","i").length,1);
 assert.equal(s.find("outboxEvents",x=>x.eventType==="evidence.attached").length,1);
});
