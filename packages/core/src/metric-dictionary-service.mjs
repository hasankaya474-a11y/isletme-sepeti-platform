import {newId} from "./id.mjs";

const STATES=new Set(["DRAFT","REVIEW","ACTIVE","INACTIVE","ARCHIVED"]);

export class MetricDictionaryService{
  constructor(store){this.store=store;}

  create({metricKey,name,description,unit,sourceType,sourceRef,actorId}){
    if(!metricKey||!name||!description||!unit||!sourceType||!sourceRef||!actorId) throw new TypeError("METRIC_FIELDS_REQUIRED");
    if(this.store.find("metricDefinitions",x=>x.metricKey===metricKey).length) throw new Error("METRIC_KEY_DUPLICATE");
    const now=new Date().toISOString();
    const row={id:newId("metric"),metricKey,name,description,unit,sourceType,sourceRef,status:"DRAFT",version:1,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"metric.create",resourceType:"metric_definition",resourceId:row.id,occurredAt:now});
    return this.store.insert("metricDefinitions",row);
  }

  transition({id,to,actorId}){
    if(!actorId||!STATES.has(to)) throw new Error("METRIC_STATE_INVALID");
    const now=new Date().toISOString();
    const row=this.store.update("metricDefinitions",id,x=>({...x,status:to,version:(x.version??1)+1,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"metric."+to.toLowerCase(),resourceType:"metric_definition",resourceId:id,occurredAt:now});
    return row;
  }
}
