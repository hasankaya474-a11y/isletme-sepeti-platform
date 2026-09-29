import {newId} from "./id.mjs";
import {normalizeCurrency,assertMinorUnits} from "./money-tax-service.mjs";

export class ProcurementPolicyService{
 constructor(store){this.store=store;}
 create({businessId,name,currency="TRY",thresholdMinor,actorId}){
  if(!businessId||!name||!actorId)throw new TypeError("PROCUREMENT_POLICY_FIELDS_REQUIRED");
  assertMinorUnits(thresholdMinor);
  const now=new Date().toISOString();
  const row={id:newId("procrule"),businessId,name,currency:normalizeCurrency(currency),thresholdMinor,status:"DRAFT",createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"procurement.policy.create",resourceType:"procurement_policy",resourceId:row.id,occurredAt:now});
  return this.store.insert("procurementApprovalRules",row);
 }
 activate({id,businessId,actorId}){
  const current=this.store.get("procurementApprovalRules",id);
  if(!current||current.businessId!==businessId)throw new Error("PROCUREMENT_POLICY_FORBIDDEN");
  const now=new Date().toISOString();
  for(const x of this.store.find("procurementApprovalRules",r=>r.businessId===businessId&&r.currency===current.currency&&r.status==="ACTIVE"&&r.id!==id))this.store.update("procurementApprovalRules",x.id,r=>({...r,status:"INACTIVE",updatedAt:now}));
  const row=this.store.update("procurementApprovalRules",id,x=>({...x,status:"ACTIVE",updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"procurement.policy.activate",resourceType:"procurement_policy",resourceId:id,occurredAt:now});
  return row;
 }
 activeFor(businessId,currency){return this.store.find("procurementApprovalRules",x=>x.businessId===businessId&&x.currency===currency&&x.status==="ACTIVE")[0]??null;}
}
