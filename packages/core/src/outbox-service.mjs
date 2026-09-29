import {newId} from "./id.mjs";
export class OutboxService{
 constructor(store){this.store=store;}
 pending(limit=100){return this.store.find("outboxEvents",x=>x.status==="PENDING").sort((a,b)=>a.createdAt.localeCompare(b.createdAt)).slice(0,limit);}
 markPublished({id,actorId="system"}){
  const now=new Date().toISOString();
  const row=this.store.update("outboxEvents",id,x=>({...x,status:"PUBLISHED",attempts:(x.attempts??0)+1,publishedAt:now,lastError:null}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"outbox.publish",resourceType:"outbox_event",resourceId:id,occurredAt:now});return row;
 }
 markFailed({id,error,actorId="system"}){
  const now=new Date().toISOString();
  return this.store.update("outboxEvents",id,x=>({...x,status:"FAILED",attempts:(x.attempts??0)+1,lastError:String(error??"UNKNOWN"),updatedAt:now}));
 }
 retry({id,actorId}){
  const current=this.store.get("outboxEvents",id);if(!current||current.status!=="FAILED")throw new Error("OUTBOX_NOT_FAILED");
  const row=this.store.update("outboxEvents",id,x=>({...x,status:"PENDING",lastError:null}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"outbox.retry",resourceType:"outbox_event",resourceId:id,occurredAt:new Date().toISOString()});return row;
 }
}
