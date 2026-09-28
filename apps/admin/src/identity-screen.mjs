import {ADMIN_STATES} from "./empty-error-states.mjs";
export function identityScreenModel({memberships=[],sessions=[],securityEvents=[],error=null}){
 if(error)return {state:"ERROR",message:ADMIN_STATES.loadError};
 return {
  state:"READY",
  sections:[
   {key:"memberships",title:"Üyelikler",rows:memberships,empty:memberships.length?null:ADMIN_STATES.membershipsEmpty},
   {key:"sessions",title:"Oturum & Cihazlar",rows:sessions,empty:sessions.length?null:ADMIN_STATES.sessionsEmpty},
   {key:"security",title:"Güvenlik Olayları",rows:securityEvents,empty:securityEvents.length?null:ADMIN_STATES.securityEmpty}
  ]
 };
}
