import {createMembership} from "./tenancy.mjs";
import {transitionMembership} from "./membership-policy.mjs";
import {auditEvent} from "./audit.mjs";

export class MembershipService {
  constructor(store){this.store=store;}
  invite({actorId,userId,organizationType,organizationId}){
    const existing=this.store.find("memberships",m=>m.userId===userId&&m.organizationType===organizationType&&m.organizationId===organizationId&&m.status!=="REVOKED");
    if(existing.length) throw new Error("MEMBERSHIP_ALREADY_EXISTS");
    const m=this.store.insert("memberships",createMembership({userId,organizationType,organizationId}));
    this.store.insert("audit",auditEvent({actorId,action:"membership.invite",resourceType:"membership",resourceId:m.id,scope:organizationType+":"+organizationId}));
    return m;
  }
  changeStatus({actorId,membershipId,to}){
    const m=this.store.update("memberships",membershipId,x=>transitionMembership(x,to));
    this.store.insert("audit",auditEvent({actorId,action:"membership.status."+to.toLowerCase(),resourceType:"membership",resourceId:m.id,scope:m.organizationType+":"+m.organizationId}));
    return m;
  }
}
