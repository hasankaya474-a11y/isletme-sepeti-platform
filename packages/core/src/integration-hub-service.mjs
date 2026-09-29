import {newId} from "./id.mjs";
const STATES=new Set(["DRAFT","ACTIVE","PAUSED","REVOKED","ARCHIVED"]);
export class IntegrationHubService{
  constructor(store){this.store=store;}
  createConnection({providerKey,organizationId=null,capabilities=[],configRef=null,actorId}){
    if(!providerKey||!actorId)throw new TypeError("INTEGRATION_FIELDS_REQUIRED");
    const now=new Date().toISOString(),row={id:newId("integration"),providerKey,organizationId,status:"DRAFT",capabilities:[...capabilities],configRef,createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"integration.create",resourceType:"integration_connection",resourceId:row.id,occurredAt:now});
    return this.store.insert("integrationConnections",row);
  }
  transition({id,to,actorId}){if(!actorId||!STATES.has(to))throw new Error("INTEGRATION_STATE_INVALID");const now=new Date().toISOString();const row=this.store.update("integrationConnections",id,x=>({...x,status:to,updatedAt:now}));this.store.insert("audit",{id:newId("audit"),actorId,action:"integration."+to.toLowerCase(),resourceType:"integration_connection",resourceId:id,occurredAt:now});return row;}
}