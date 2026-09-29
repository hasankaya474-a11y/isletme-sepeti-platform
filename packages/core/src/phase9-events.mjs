export const PHASE9_EVENTS=Object.freeze({
 DELIVERY_SCHEDULED:"delivery.scheduled",DELIVERY_DISPATCHED:"delivery.dispatched",DELIVERY_ETA_UPDATED:"delivery.eta_updated",
 RECEIVING_COMPLETED:"receiving.completed",RMA_REQUESTED:"rma.requested",RMA_DECIDED:"rma.decided"
});
export function phase9Event({type,resourceType,resourceId,actorId,payload={},occurredAt=new Date().toISOString()}){
 if(!Object.values(PHASE9_EVENTS).includes(type))throw new Error("PHASE9_EVENT_TYPE_INVALID");
 if(!resourceType||!resourceId||!actorId)throw new TypeError("PHASE9_EVENT_FIELDS_REQUIRED");
 return Object.freeze({type,resourceType,resourceId,actorId,payload:structuredClone(payload),occurredAt});
}
