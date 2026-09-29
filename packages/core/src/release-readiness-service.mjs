import {newId} from "./id.mjs";

export const REQUIRED_RELEASE_GATES=Object.freeze([
 "PRIVATE_PILOT","DEFECT_CLOSURE","SECURITY_REVIEW","RESTORE_VERIFICATION",
 "LOAD_VERIFICATION","LEGAL_REVIEW","ACCOUNTING_REVIEW","PRIVACY_REVIEW"
]);

export class ReleaseReadinessService{
 constructor(store){this.store=store;}

 setGate({gateKey,status,evidenceRef=null,note=null,actorId}){
  if(!REQUIRED_RELEASE_GATES.includes(gateKey))throw new Error("RELEASE_GATE_UNKNOWN");
  if(!["MISSING","PENDING","PASS","FAIL"].includes(status)||!actorId)throw new TypeError("RELEASE_GATE_FIELDS_REQUIRED");
  const now=new Date().toISOString();
  const current=this.store.find("releaseGateEvidence",x=>x.gateKey===gateKey)[0];
  let row;
  if(current) row=this.store.update("releaseGateEvidence",current.id,x=>({...x,status,evidenceRef,note,reviewedBy:actorId,reviewedAt:now,updatedAt:now}));
  else row=this.store.insert("releaseGateEvidence",{id:newId("releasegate"),gateKey,status,evidenceRef,note,reviewedBy:actorId,reviewedAt:now,createdAt:now,updatedAt:now});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"release.gate."+status.toLowerCase(),resourceType:"release_gate",resourceId:row.id,occurredAt:now});
  return row;
 }

 evaluate(){
  const rows=this.store.find("releaseGateEvidence",()=>true);
  const byKey=new Map(rows.map(x=>[x.gateKey,x]));
  const gates=REQUIRED_RELEASE_GATES.map(gateKey=>({gateKey,status:byKey.get(gateKey)?.status??"MISSING",evidenceRef:byKey.get(gateKey)?.evidenceRef??null}));
  const blockers=gates.filter(x=>x.status!=="PASS");
  return {eligible:blockers.length===0,gates,blockers};
 }

 decide({decision,rationale,actorId}){
  if(!["APPROVE","REJECT"].includes(decision)||!rationale||!actorId)throw new TypeError("RELEASE_DECISION_FIELDS_REQUIRED");
  const readiness=this.evaluate();
  if(decision==="APPROVE"&&!readiness.eligible)throw Object.assign(new Error("RELEASE_GATES_INCOMPLETE"),{blockers:readiness.blockers});
  const now=new Date().toISOString();
  const row={id:newId("releasedecision"),decision,rationale,decidedBy:actorId,decidedAt:now,gateSnapshot:readiness.gates};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"release.decision."+decision.toLowerCase(),resourceType:"production_release_decision",resourceId:row.id,occurredAt:now});
  return this.store.insert("productionReleaseDecisions",row);
 }
}
