import test from "node:test";import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {SupportCaseService} from "../packages/core/src/support-case-service.mjs";
import {DisputeService} from "../packages/core/src/dispute-service.mjs";

test("support case keeps append-only timeline",()=>{const s=new MemoryStore(),svc=new SupportCaseService(s);const c=svc.create({subject:"Teslimat",actorId:"u"});svc.addEvent({caseId:c.id,eventType:"NOTE",body:"Arandı",visibility:"INTERNAL",actorId:"a"});svc.transition({id:c.id,to:"OPEN",actorId:"a"});assert.equal(s.find("supportCaseEvents",x=>x.supportCaseId===c.id).length,2);});
test("dispute requires commercial reference",()=>{const s=new MemoryStore(),d=new DisputeService(new SupportCaseService(s));assert.throws(()=>d.open({subject:"Fatura",actorId:"u"}),/DISPUTE_REFERENCE_REQUIRED/);const c=d.open({organizationId:"b",requesterId:"u",subject:"Fatura",referenceType:"invoice",referenceId:"i1",actorId:"u"});assert.equal(c.caseType,"DISPUTE");});