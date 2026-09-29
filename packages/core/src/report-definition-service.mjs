import {newId} from "./id.mjs";
const STATES=new Set(["DRAFT","REVIEW","ACTIVE","INACTIVE","ARCHIVED"]);
export class ReportDefinitionService{
  constructor(store){this.store=store;}
  create({reportKey,name,metricKeys=[],allowedFilters=[],actorId}){
    if(!reportKey||!name||!actorId) throw new TypeError("REPORT_FIELDS_REQUIRED");
    if(this.store.find("reportDefinitions",x=>x.reportKey===reportKey).length) throw new Error("REPORT_KEY_DUPLICATE");
    const missing=metricKeys.filter(k=>!this.store.find("metricDefinitions",x=>x.metricKey===k&&x.status==="ACTIVE").length);
    if(missing.length) throw Object.assign(new Error("REPORT_METRIC_INACTIVE"),{missing});
    const now=new Date().toISOString();
    const row={id:newId("report"),reportKey,name,metricKeys:[...metricKeys],allowedFilters:[...allowedFilters],status:"DRAFT",version:1,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"report.create",resourceType:"report_definition",resourceId:row.id,occurredAt:now});
    return this.store.insert("reportDefinitions",row);
  }
  transition({id,to,actorId}){
    if(!actorId||!STATES.has(to)) throw new Error("REPORT_STATE_INVALID");
    const now=new Date().toISOString();
    const row=this.store.update("reportDefinitions",id,x=>({...x,status:to,version:(x.version??1)+1,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"report."+to.toLowerCase(),resourceType:"report_definition",resourceId:id,occurredAt:now});
    return row;
  }
}
