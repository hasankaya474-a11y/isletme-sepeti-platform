export const PHASE5_EVENTS=Object.freeze({
  SEARCH_SYNONYM_CHANGED:"search.synonym.changed",
  BUYER_LIST_CREATED:"buyer.list.created",
  BUYER_LIST_ITEM_ADDED:"buyer.list.item_added",
  MATCH_REQUEST_CREATED:"matching.request.created",
  MATCH_CANDIDATES_READY:"matching.candidates.ready",
  MATCH_CANDIDATE_REVIEWED:"matching.candidate.reviewed"
});
export function phase5Event({type,resourceType,resourceId,actorId,payload={},occurredAt=new Date().toISOString()}){
  if(!Object.values(PHASE5_EVENTS).includes(type)) throw new Error("PHASE5_EVENT_TYPE_INVALID");
  if(!resourceType||!resourceId||!actorId) throw new TypeError("PHASE5_EVENT_FIELDS_REQUIRED");
  return Object.freeze({type,resourceType,resourceId,actorId,payload:structuredClone(payload),occurredAt});
}
