import {newId} from "./id.mjs";
const TYPES=new Set(["PRICE_SIGNAL","STOCK_SIGNAL","SEARCH_SIGNAL","DEMAND_SIGNAL"]);
export class MarketRadarService{
  constructor(store){this.store=store;}
  record({observationType,subjectType,subjectId,metricKey,metricValue,windowStart=null,windowEnd=null,evidence={},actorId="system"}){
    if(!TYPES.has(observationType)||!subjectType||!subjectId||!metricKey||typeof metricValue!=="number"||!Number.isFinite(metricValue)) throw new TypeError("RADAR_OBSERVATION_INVALID");
    const row={id:newId("radar"),observationType,subjectType,subjectId,metricKey,metricValue,windowStart,windowEnd,evidence,createdAt:new Date().toISOString()};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"radar.observe",resourceType:"radar_observation",resourceId:row.id,occurredAt:row.createdAt});
    return this.store.insert("radarObservations",row);
  }
  list({subjectType,subjectId}){return this.store.find("radarObservations",x=>x.subjectType===subjectType&&x.subjectId===subjectId);}
}