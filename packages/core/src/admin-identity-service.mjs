import {assertMfa} from "./mfa-policy.mjs";
import {createChangeRequest,approveChange} from "./four-eyes.mjs";
import {auditEvent} from "./audit.mjs";
export class AdminIdentityService{
 constructor(store){this.store=store;}
 listSessions(userId){return this.store.find("sessions",s=>s.userId===userId);}
 revokeAllSessions({actorId,userId,session}){
  assertMfa({permission:"admin.configuration.manage",session});
  const rows=this.listSessions(userId).filter(s=>!s.revokedAt);
  for(const row of rows)this.store.update("sessions",row.id,x=>({...x,revokedAt:new Date().toISOString()}));
  this.store.insert("audit",auditEvent({actorId,action:"identity.sessions.revoke_all",resourceType:"user",resourceId:userId}));
  return rows.length;
 }
 requestRoleChange({actorId,membershipId,payload}){
  const r=createChangeRequest({requestedBy:actorId,actionCode:"security.role.change",resourceType:"membership",resourceId:membershipId,payload,riskLevel:"HIGH"});
  return this.store.insert("changes",r);
 }
 approveRoleChange({requestId,approverId}){
  return this.store.update("changes",requestId,r=>approveChange(r,{approverId}));
 }
}
