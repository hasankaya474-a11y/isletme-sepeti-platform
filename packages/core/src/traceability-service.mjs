import {newId} from "./id.mjs";
export class TraceabilityService{
 constructor(store){this.store=store;}
 append({aggregateType,aggregateId,eventType,sourceType,sourceId=null,evidence={},actorId}){
  if(!aggregateType||!aggregateId||!eventType||!sourceType||!actorId)throw new TypeError("TRACEABILITY_FIELDS_REQUIRED");
  const row={id:newId("trace"),aggregateType,aggregateId,eventType,sourceType,sourceId,evidence:structuredClone(evidence),actorId,occurredAt:new Date().toISOString()};
  return this.store.insert("traceabilityEvents",row);
 }
 list({aggregateType,aggregateId}){return this.store.find("traceabilityEvents",x=>x.aggregateType===aggregateType&&x.aggregateId===aggregateId).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));}
}