import {newId} from "./id.mjs";
import {calculateTax} from "./money-tax-service.mjs";

function lineNet(x){return Math.round((x.unitPriceMinor*x.quantityMilli)/1000);}

export class RequisitionService{
 constructor(store,policy){this.store=store;this.policy=policy;}
 submit({cartId,businessId,actorId}){
  const cart=this.store.get("carts",cartId);if(!cart||cart.businessId!==businessId)throw new Error("CART_FORBIDDEN");
  if(cart.status!=="ACTIVE")throw new Error("CART_STATE_INVALID");
  const lines=this.store.find("cartLines",x=>x.cartId===cartId&&x.status==="ACTIVE");if(!lines.length)throw new Error("CART_LINES_REQUIRED");
  if(lines.some(x=>!x.supplierId))throw new Error("SUPPLIER_SELECTION_REQUIRED");
  const currencies=new Set(lines.map(x=>x.currency));if(currencies.size!==1)throw new Error("CART_CURRENCY_MISMATCH");
  const currency=[...currencies][0];let netMinor=0,taxMinor=0;
  for(const line of lines){const totals=calculateTax({netMinor:lineNet(line),taxRateBps:line.taxRateBps});netMinor+=totals.netMinor;taxMinor+=totals.taxMinor;}
  const grossMinor=netMinor+taxMinor,rule=this.policy.activeFor(businessId,currency),needsApproval=!!rule&&grossMinor>=rule.thresholdMinor;
  const now=new Date().toISOString(),status=needsApproval?"PENDING_APPROVAL":"APPROVED";
  const req={id:newId("requisition"),cartId,businessId,status,currency,estimatedNetMinor:netMinor,estimatedTaxMinor:taxMinor,estimatedGrossMinor:grossMinor,requestedBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("purchaseRequisitions",req);
  if(needsApproval)this.store.insert("procurementApprovals",{id:newId("procappr"),requisitionId:req.id,status:"PENDING",requestedBy:actorId,decidedBy:null,note:null,createdAt:now,decidedAt:null});
  this.store.update("carts",cartId,x=>({...x,status,updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"requisition.submit",resourceType:"requisition",resourceId:req.id,occurredAt:now});
  return req;
 }
 markPoReady({requisitionId,businessId,actorId}){
  const req=this.store.get("purchaseRequisitions",requisitionId);if(!req||req.businessId!==businessId)throw new Error("REQUISITION_FORBIDDEN");
  if(req.status!=="APPROVED")throw new Error("REQUISITION_NOT_APPROVED");
  const now=new Date().toISOString();
  const row=this.store.update("purchaseRequisitions",requisitionId,x=>({...x,status:"PO_READY",updatedAt:now}));
  this.store.update("carts",req.cartId,x=>({...x,status:"PO_READY",updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"requisition.po_ready",resourceType:"requisition",resourceId:requisitionId,occurredAt:now});
  return row;
 }
}
