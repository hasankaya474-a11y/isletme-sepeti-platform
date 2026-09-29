export const PHASE8_EVENTS=Object.freeze({
 ORDER_CREATED:"order.created",ORDER_STATE_CHANGED:"order.state_changed",OUTBOX_PUBLISHED:"outbox.published",OUTBOX_RETRIED:"outbox.retried"
});
export function phase8Event({type,resourceType,resourceId,actorId,payload={},occurredAt=new Date().toISOString()}){
 if(!Object.values(PHASE8_EVENTS).includes(type))throw new Error("PHASE8_EVENT_TYPE_INVALID");
 if(!resourceType||!resourceId||!actorId)throw new TypeError("PHASE8_EVENT_FIELDS_REQUIRED");
 return Object.freeze({type,resourceType,resourceId,actorId,payload:structuredClone(payload),occurredAt});
}
