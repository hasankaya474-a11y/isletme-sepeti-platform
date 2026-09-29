import {newId} from "./id.mjs";
export class PilotEnrollmentService{
 constructor(store){this.store=store;}
 enroll({organizationId,pilotKey,participantType,participantId,locationConsent=false,actorId}){
  if(!organizationId||!pilotKey||!participantType||!participantId||!actorId)throw new TypeError("PILOT_FIELDS_REQUIRED");
  if(this.store.find("pilotEnrollments",x=>x.pilotKey===pilotKey&&x.participantType===participantType&&x.participantId===participantId).length)throw new Error("PILOT_ENROLLMENT_DUPLICATE");
  const now=new Date().toISOString(),row={id:newId("pilot"),organizationId,pilotKey,participantType,participantId,status:"ACTIVE",locationConsent:Boolean(locationConsent),consentedAt:locationConsent?now:null,createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"pilot.enroll",resourceType:"pilot_enrollment",resourceId:row.id,occurredAt:now});
  return this.store.insert("pilotEnrollments",row);
 }
 withdraw({id,actorId}){const now=new Date().toISOString();const row=this.store.update("pilotEnrollments",id,x=>({...x,status:"WITHDRAWN",locationConsent:false,updatedAt:now}));this.store.insert("audit",{id:newId("audit"),actorId,action:"pilot.withdraw",resourceType:"pilot_enrollment",resourceId:id,occurredAt:now});return row;}
}