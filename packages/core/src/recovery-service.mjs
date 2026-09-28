import {issueRecoveryChallenge,canConsumeRecovery} from "./recovery.mjs";
import {resetPassword} from "./password-rotation.mjs";
import {auditEvent} from "./audit.mjs";
export class RecoveryService{
 constructor(store){this.store=store;}
 request({userId,now=Date.now()}){const x=issueRecoveryChallenge({userId,now});this.store.insert("recoveries",x.record);return x.token;}
 confirm({userId,token,newPassword,now=Date.now()}){
  const r=this.store.find("recoveries",x=>x.userId===userId&&canConsumeRecovery(x,token,now))[0];if(!r)throw new Error("RECOVERY_INVALID");
  this.store.update("recoveries",r.id,x=>({...x,consumedAt:new Date(now).toISOString()}));
  this.store.update("users",userId,u=>resetPassword({user:u,newPassword,now:new Date(now).toISOString()}));
  for(const s of this.store.find("sessions",x=>x.userId===userId&&!x.revokedAt))this.store.update("sessions",s.id,x=>({...x,revokedAt:new Date(now).toISOString()}));
  this.store.insert("audit",auditEvent({actorId:userId,action:"identity.password.reset",resourceType:"user",resourceId:userId}));
  return true;
 }
}
