import {newId} from "./id.mjs";
export class ProcurementApprovalService{
 constructor(store){this.store=store;}
 decide({approvalId,businessId,decision,note=null,actorId}){
  if(!["APPROVED","REJECTED"].includes(decision))throw new Error("APPROVAL_DECISION_INVALID");
  const approval=this.store.get("procurementApprovals",approvalId);if(!approval||approval.status!=="PENDING")throw new Error("APPROVAL_NOT_PENDING");
  const req=this.store.get("purchaseRequisitions",approval.requisitionId);if(!req||req.businessId!==businessId)throw new Error("APPROVAL_FORBIDDEN");
  if(approval.requestedBy===actorId)throw new Error("SELF_APPROVAL_FORBIDDEN");
  const now=new Date().toISOString();
  const row=this.store.update("procurementApprovals",approvalId,x=>({...x,status:decision,decidedBy:actorId,note,decidedAt:now}));
  this.store.update("purchaseRequisitions",req.id,x=>({...x,status:decision,updatedAt:now}));
  this.store.update("carts",req.cartId,x=>({...x,status:decision,updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"procurement.approval."+decision.toLowerCase(),resourceType:"procurement_approval",resourceId:approvalId,occurredAt:now});
  return row;
 }
}
