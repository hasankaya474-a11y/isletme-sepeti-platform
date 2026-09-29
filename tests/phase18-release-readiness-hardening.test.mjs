import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {ReleaseReadinessService,REQUIRED_RELEASE_GATES} from "../packages/core/src/release-readiness-service.mjs";
import {PilotDefectService} from "../packages/core/src/pilot-defect-service.mjs";

test("PASS gate requires real evidence reference",()=>{
 const s=new MemoryStore(),r=new ReleaseReadinessService(s);
 assert.throws(()=>r.setGate({gateKey:"LEGAL_REVIEW",status:"PASS",actorId:"legal"}),/EVIDENCE_REQUIRED/);
});

test("open high or critical pilot defect blocks production eligibility at runtime",()=>{
 const s=new MemoryStore(),r=new ReleaseReadinessService(s),d=new PilotDefectService(s);
 for(const gateKey of REQUIRED_RELEASE_GATES)r.setGate({gateKey,status:"PASS",evidenceRef:"evidence:"+gateKey,actorId:"reviewer"});
 d.create({severity:"CRITICAL",title:"Sipariş regresyonu",evidenceRef:"defect:1",actorId:"qa"});
 const state=r.evaluate();
 assert.equal(state.eligible,false);
 assert.ok(state.blockers.some(x=>x.gateKey==="DEFECT_CLOSURE_RUNTIME"));
 assert.throws(()=>r.decide({decision:"APPROVE",rationale:"go",actorId:"release-manager"}),/INCOMPLETE/);
});

test("verified critical defect no longer blocks after all evidence gates pass",()=>{
 const s=new MemoryStore(),r=new ReleaseReadinessService(s),d=new PilotDefectService(s);
 for(const gateKey of REQUIRED_RELEASE_GATES)r.setGate({gateKey,status:"PASS",evidenceRef:"evidence:"+gateKey,actorId:"reviewer"});
 const defect=d.create({severity:"CRITICAL",title:"Pilot hata",evidenceRef:"defect:2",actorId:"qa"});
 d.transition({id:defect.id,to:"VERIFIED",actorId:"qa2"});
 assert.equal(r.evaluate().eligible,true);
});
