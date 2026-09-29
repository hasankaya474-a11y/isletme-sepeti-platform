import {newId} from "./id.mjs";
import {transitionOrder} from "./order-state-machine.mjs";

export class OrderTransitionService{
 constructor(store){this.store=store;}
 transition({orderId,to,organizationType,organizationId,actorId}){
  const current=this.store.get("orders",orderId);if(!current)throw new Error("ORDER_NOT_FOUND");
  const allowed=organizationType==="PLATFORM"||(organizationType==="BUSINESS"&&current.businessId===organizationId)||(organizationType==="SUPPLIER"&&current.supplierId===organizationId);
  if(!allowed)throw new Error("ORDER_FORBIDDEN");
  const next=transitionOrder(current,to);
  const row=this.store.update("orders",orderId,()=>next);
  const now=new Date().toISOString();
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"order",aggregateId:orderId,eventType:"order.state_changed",payload:{from:current.state,to},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"order.transition."+to.toLowerCase(),resourceType:"order",resourceId:orderId,occurredAt:now});
  return row;
 }
}
