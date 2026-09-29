export const PHASE7_EVENTS=Object.freeze({
 CART_CREATED:"cart.created",CART_LINE_ADDED:"cart.line_added",REQUISITION_SUBMITTED:"requisition.submitted",
 APPROVAL_DECIDED:"procurement.approval.decided",REQUISITION_PO_READY:"requisition.po_ready",PROCUREMENT_POLICY_CHANGED:"procurement.policy.changed"
});
export function phase7Event({type,resourceType,resourceId,actorId,payload={},occurredAt=new Date().toISOString()}){
 if(!Object.values(PHASE7_EVENTS).includes(type))throw new Error("PHASE7_EVENT_TYPE_INVALID");
 if(!resourceType||!resourceId||!actorId)throw new TypeError("PHASE7_EVENT_FIELDS_REQUIRED");
 return Object.freeze({type,resourceType,resourceId,actorId,payload:structuredClone(payload),occurredAt});
}
