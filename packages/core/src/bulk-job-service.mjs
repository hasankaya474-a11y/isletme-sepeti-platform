import {newId} from "./id.mjs";
const TYPES=new Set(["IMPORT","EXPORT"]);
export class BulkJobService{
 constructor(store){this.store=store;}
 create({jobType,domainKey,organizationId=null,artifactRef=null,actorId}){if(!TYPES.has(jobType)||!domainKey||!actorId)throw new TypeError("BULK_JOB_FIELDS_REQUIRED");const now=new Date().toISOString(),row={id:newId("bulkjob"),jobType,domainKey,organizationId,status:jobType==="IMPORT"?"UPLOADED":"READY",artifactRef,validation:{},requestedBy:actorId,createdAt:now,updatedAt:now};this.store.insert("audit",{id:newId("audit"),actorId,action:"bulk."+jobType.toLowerCase()+".create",resourceType:"bulk_job",resourceId:row.id,occurredAt:now});return this.store.insert("bulkJobs",row);}
 markValidated({id,errors=[],warnings=[],actorId}){const current=this.store.get("bulkJobs",id);if(!current||current.jobType!=="IMPORT")throw new Error("BULK_IMPORT_NOT_FOUND");const now=new Date().toISOString();return this.store.update("bulkJobs",id,x=>({...x,status:errors.length?"FAILED":"READY",validation:{errors:[...errors],warnings:[...warnings]},updatedAt:now}));}
}