import {newId} from "./id.mjs";
export class RestoreVerificationService{
 constructor(store){this.store=store;}
 record({backupRef,environment,checks={},passed,actorId}){if(!backupRef||!environment||!actorId)throw new TypeError("RESTORE_FIELDS_REQUIRED");const now=new Date().toISOString(),row={id:newId("restore"),backupRef,environment,status:passed?"PASS":"FAIL",checks:structuredClone(checks),verifiedBy:actorId,verifiedAt:now,createdAt:now};this.store.insert("audit",{id:newId("audit"),actorId,action:"restore.verify",resourceType:"restore_verification",resourceId:row.id,occurredAt:now});return this.store.insert("restoreVerifications",row);}
}