export const PHASE6_EVENTS=Object.freeze({
 RFQ_CREATED:"rfq.created",RFQ_OPENED:"rfq.opened",RFQ_SUPPLIER_INVITED:"rfq.supplier_invited",
 QUOTE_CREATED:"quote.created",QUOTE_SUBMITTED:"quote.submitted",RFQ_MESSAGE_POSTED:"rfq.message.posted"
});
export function phase6Event({type,resourceType,resourceId,actorId,payload={},occurredAt=new Date().toISOString()}){
 if(!Object.values(PHASE6_EVENTS).includes(type))throw new Error("PHASE6_EVENT_TYPE_INVALID");
 if(!resourceType||!resourceId||!actorId)throw new TypeError("PHASE6_EVENT_FIELDS_REQUIRED");
 return Object.freeze({type,resourceType,resourceId,actorId,payload:structuredClone(payload),occurredAt});
}
