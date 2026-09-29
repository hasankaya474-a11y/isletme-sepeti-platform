import {newId} from "./id.mjs";
import {normalizeCurrency} from "./money-tax-service.mjs";

export class CommissionRuleService{
 constructor(store){this.store=store;}
 create({scopeType="GLOBAL",businessId=null,supplierId=null,name,basis="NET",rateBps,currency="TRY",validFrom=null,validTo=null,actorId}){
  if(!["GLOBAL","SUPPLIER","BUSINESS_SUPPLIER"].includes(scopeType)||!name||!actorId)throw new TypeError("COMMISSION_RULE_FIELDS_REQUIRED");
  if(!["NET","GROSS"].includes(basis)||!Number.isInteger(rateBps)||rateBps<0||rateBps>10000)throw new TypeError("COMMISSION_RULE_INVALID");
  if(scopeType==="SUPPLIER"&&!supplierId)throw new TypeError("SUPPLIER_SCOPE_REQUIRED");
  if(scopeType==="BUSINESS_SUPPLIER"&&(!businessId||!supplierId))throw new TypeError("BUSINESS_SUPPLIER_SCOPE_REQUIRED");
  const now=new Date().toISOString(),row={id:newId("comrule"),scopeType,businessId,supplierId,name,basis,rateBps,currency:normalizeCurrency(currency),status:"DRAFT",version:1,validFrom,validTo,createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"commission.rule.create",resourceType:"commission_rule",resourceId:row.id,occurredAt:now});
  return this.store.insert("commissionRules",row);
 }
 activate({id,actorId}){
  const rule=this.store.get("commissionRules",id);if(!rule)throw new Error("COMMISSION_RULE_NOT_FOUND");
  const now=new Date().toISOString();
  for(const r of this.store.find("commissionRules",x=>x.id!==id&&x.status==="ACTIVE"&&x.scopeType===rule.scopeType&&x.businessId===rule.businessId&&x.supplierId===rule.supplierId&&x.currency===rule.currency)){
   this.store.update("commissionRules",r.id,x=>({...x,status:"INACTIVE",version:x.version+1,updatedAt:now}));
  }
  const row=this.store.update("commissionRules",id,x=>({...x,status:"ACTIVE",version:x.version+1,updatedAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"commission.rule.activate",resourceType:"commission_rule",resourceId:id,occurredAt:now});return row;
 }
 resolve({businessId,supplierId,currency,at=new Date().toISOString()}){
  const active=this.store.find("commissionRules",x=>x.status==="ACTIVE"&&x.currency===currency&&(!x.validFrom||x.validFrom<=at)&&(!x.validTo||x.validTo>=at));
  const exact=active.find(x=>x.scopeType==="BUSINESS_SUPPLIER"&&x.businessId===businessId&&x.supplierId===supplierId);
  const supplier=active.find(x=>x.scopeType==="SUPPLIER"&&x.supplierId===supplierId);
  const global=active.find(x=>x.scopeType==="GLOBAL");
  return exact??supplier??global??null;
 }
}
