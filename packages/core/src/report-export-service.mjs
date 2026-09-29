import {newId} from "./id.mjs";

const FORMATS=new Set(["PDF","XLSX"]);

export class ReportExportService{
  constructor(store){this.store=store;}

  request({reportDefinitionId,requestedBy,organizationId=null,format,filters={}}){
    if(!reportDefinitionId||!requestedBy||!FORMATS.has(format)) throw new TypeError("REPORT_EXPORT_FIELDS_REQUIRED");
    const report=this.store.get("reportDefinitions",reportDefinitionId);
    if(!report||report.status!=="ACTIVE") throw new Error("REPORT_NOT_ACTIVE");
    const unknown=Object.keys(filters).filter(k=>!report.allowedFilters.includes(k));
    if(unknown.length) throw Object.assign(new Error("REPORT_FILTER_NOT_ALLOWED"),{unknown});
    const now=new Date().toISOString();
    const row={id:newId("reportjob"),reportDefinitionId,requestedBy,organizationId,format,filters:structuredClone(filters),status:"QUEUED",artifactRef:null,errorCode:null,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId:requestedBy,action:"report.export.request",resourceType:"report_export_job",resourceId:row.id,occurredAt:now});
    return this.store.insert("reportExportJobs",row);
  }

  complete({id,artifactRef,actorId="system"}){
    if(!artifactRef) throw new TypeError("REPORT_ARTIFACT_REQUIRED");
    const now=new Date().toISOString();
    const row=this.store.update("reportExportJobs",id,x=>({...x,status:"COMPLETED",artifactRef,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"report.export.complete",resourceType:"report_export_job",resourceId:id,occurredAt:now});
    return row;
  }

  fail({id,errorCode,actorId="system"}){
    const now=new Date().toISOString();
    return this.store.update("reportExportJobs",id,x=>({...x,status:"FAILED",errorCode:String(errorCode??"UNKNOWN"),updatedAt:now}));
  }
}
