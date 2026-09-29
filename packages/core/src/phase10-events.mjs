export const PHASE10_EVENTS=Object.freeze({
 INVOICE_SUBMITTED:"invoice.submitted",INVOICE_MATCHED:"invoice.match_completed",INVOICE_REVIEWED:"invoice.reviewed",
 AGREEMENT_ACTIVATED:"agreement.activated",EVIDENCE_ATTACHED:"evidence.attached"
});
export function phase10Event({type,resourceType,resourceId,actorId,payload={},occurredAt=new Date().toISOString()}){
 if(!Object.values(PHASE10_EVENTS).includes(type))throw new Error("PHASE10_EVENT_TYPE_INVALID");
 if(!resourceType||!resourceId||!actorId)throw new TypeError("PHASE10_EVENT_FIELDS_REQUIRED");
 return Object.freeze({type,resourceType,resourceId,actorId,payload:structuredClone(payload),occurredAt});
}
