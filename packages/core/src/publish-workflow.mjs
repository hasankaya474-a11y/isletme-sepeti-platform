import {newId} from "./id.mjs";import {auditEvent} from "./audit.mjs";
export class PublishWorkflow{
 constructor(store){this.store=store;}
 schedule({actorId,resourceType,resourceId,publishAt,unpublishAt=null}){if(Date.parse(publishAt)<=Date.now())throw new Error("SCHEDULE_MUST_BE_FUTURE");const row={id:newId("pub"),resourceType,resourceId,publishAt,unpublishAt,status:"SCHEDULED",createdBy:actorId,createdAt:new Date().toISOString()};this.store.insert("publishJobs",row);this.store.insert("audit",auditEvent({actorId,action:"publish.schedule",resourceType,resourceId,metadata:{publishAt,unpublishAt}}));return row;}
 due(now=Date.now()){return this.store.find("publishJobs",x=>x.status==="SCHEDULED"&&Date.parse(x.publishAt)<=now);}
 markDone(id,now=new Date().toISOString()){return this.store.update("publishJobs",id,x=>({...x,status:"COMPLETED",completedAt:now}));}
}