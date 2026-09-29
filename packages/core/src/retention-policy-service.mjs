import {newId} from "./id.mjs";
const STATES=new Set(["DRAFT","REVIEW","ACTIVE","INACTIVE","ARCHIVED"]);
export class RetentionPolicyService{
 constructor(store){this.store=store;}
 create({dataClass,scopeType,scopeId=null,retainDays,disposition,actorId}){if(!dataClass||!scopeType||!actorId||!Number.isInteger(retainDays)||retainDays<0)throw new TypeError("RETENTION_FIELDS_REQUIRED");const now=new Date().toISOString(),row={id:newId("retention"),dataClass,scopeType,scopeId,retainDays,disposition,status:"DRAFT",createdBy:actorId,createdAt:now,updatedAt:now};this.store.insert("audit",{id:newId("audit"),actorId,action:"retention.create",resourceType:"retention_policy",resourceId:row.id,occurredAt:now});return this.store.insert("retentionPolicies",row);}
 transition({id,to,actorId}){if(!actorId||!STATES.has(to))throw new Error("RETENTION_STATE_INVALID");const now=new Date().toISOString();const row=this.store.update("retentionPolicies",id,x=>({...x,status:to,updatedAt:now}));this.store.insert("audit",{id:newId("audit"),actorId,action:"retention."+to.toLowerCase(),resourceType:"retention_policy",resourceId:id,occurredAt:now});return row;}
}