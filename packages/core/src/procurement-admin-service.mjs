import {newId} from "./id.mjs";
export class ProcurementAdminService{
 constructor(store){this.store=store;}
 listRequisitions({status=null}={}){return this.store.find("purchaseRequisitions",x=>!status||x.status===status);}
 cancel({requisitionId,actorId}){
  if(!actorId)throw new TypeError("ACTOR_REQUIRED");
  const req=this.store.get("purchaseRequisitions",requisitionId);if(!req)throw new Error("REQUISITION_NOT_FOUND");
  if(["PO_READY","CANCELLED"].includes(req.status))throw new Error("REQUISITION_CANNOT_CANCEL");
  const now=new Date().toISOString();
  const row=this.store.update("purchaseRequisitions",requisitionId,x=>({...x,status:"CANCELLED",updatedAt:now}));
  this.store.update("carts",req.cartId,x=>({...x,status:"ABANDONED",updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"requisition.admin.cancel",resourceType:"requisition",resourceId:requisitionId,occurredAt:now});
  return row;
 }
}
