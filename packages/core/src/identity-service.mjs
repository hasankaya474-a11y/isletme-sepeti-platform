import {createUser,normalizeEmail} from "./identity.mjs";
import {verifyPassword} from "./password.mjs";
import {issueSession} from "./session.mjs";
import {auditEvent} from "./audit.mjs";
import {securityEvent} from "./security-events.mjs";

export class IdentityService {
  constructor(store){this.store=store;}
  register(input){
    const email=normalizeEmail(input.email);
    if(this.store.find("users",u=>u.emailNormalized===email).length) throw new Error("EMAIL_ALREADY_EXISTS");
    const user=this.store.insert("users",createUser(input));
    this.store.insert("audit",auditEvent({actorId:user.id,action:"identity.user.register",resourceType:"user",resourceId:user.id}));
    return user;
  }
  verifyEmail(userId,now=new Date().toISOString()){
    return this.store.update("users",userId,u=>({...u,status:"ACTIVE",emailVerifiedAt:now,updatedAt:now}));
  }
  login({email,password,ip=null,device=null,now=Date.now()}){
    const normalized=normalizeEmail(email);
    const user=this.store.find("users",u=>u.emailNormalized===normalized)[0];
    if(!user || user.status!=="ACTIVE" || !verifyPassword(password,user.passwordHash)){
      this.store.insert("security",securityEvent({userId:user?.id??null,eventType:"LOGIN_FAILURE",severity:"MEDIUM",outcome:"FAILURE",ip,device,now:new Date(now).toISOString()}));
      throw new Error("INVALID_CREDENTIALS");
    }
    const issued=issueSession({userId:user.id,now});
    this.store.insert("sessions",issued.record);
    this.store.insert("security",securityEvent({userId:user.id,sessionId:issued.record.id,eventType:"LOGIN_SUCCESS",outcome:"SUCCESS",ip,device,now:new Date(now).toISOString()}));
    return issued;
  }
  revokeSession({sessionId,actorId,now=new Date().toISOString()}){
    const s=this.store.update("sessions",sessionId,x=>({...x,revokedAt:now}));
    this.store.insert("audit",auditEvent({actorId,action:"identity.session.revoke",resourceType:"session",resourceId:sessionId}));
    return s;
  }
}
