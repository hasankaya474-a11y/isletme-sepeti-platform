import {newId} from "./id.mjs";
import {normalizeCurrency} from "./money-tax-service.mjs";

export class AgreementService{
 constructor(store){this.store=store;}
 create({businessId,supplierId,name,currency="TRY",terms={},validFrom=null,validTo=null,actorId}){
  if(!businessId||!supplierId||!name||!actorId)throw new TypeError("AGREEMENT_FIELDS_REQUIRED");
  if(!this.store.get("businesses",businessId))throw new Error("BUSINESS_NOT_FOUND");
  if(!this.store.get("suppliers",supplierId))throw new Error("SUPPLIER_NOT_FOUND");
  const now=new Date().toISOString(),row={id:newId("agreement"),businessId,supplierId,name,currency:normalizeCurrency(currency),terms,status:"PENDING_ACCEPTANCE",version:1,validFrom,validTo,createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"agreement.create",resourceType:"agreement",resourceId:row.id,occurredAt:now});
  return this.store.insert("commercialAgreements",row);
 }
 accept({agreementId,partyType,partyId,actorId}){
  const a=this.store.get("commercialAgreements",agreementId);if(!a)throw new Error("AGREEMENT_NOT_FOUND");
  const expected=partyType==="BUSINESS"?a.businessId:partyType==="SUPPLIER"?a.supplierId:null;
  if(!expected||expected!==partyId)throw new Error("AGREEMENT_FORBIDDEN");
  if(!["PENDING_ACCEPTANCE","ACTIVE"].includes(a.status))throw new Error("AGREEMENT_STATE_INVALID");
  if(this.store.find("agreementAcceptances",x=>x.agreementId===agreementId&&x.partyType===partyType).length)throw new Error("AGREEMENT_ALREADY_ACCEPTED");
  const now=new Date().toISOString(),acceptance={id:newId("agreementacc"),agreementId,partyType,partyId,acceptedBy:actorId,acceptedAt:now};
  this.store.insert("agreementAcceptances",acceptance);
  const all=this.store.find("agreementAcceptances",x=>x.agreementId===agreementId);
  if(new Set(all.map(x=>x.partyType)).size===2){
   this.store.update("commercialAgreements",agreementId,x=>({...x,status:"ACTIVE",version:x.version+1,updatedAt:now}));
   this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"agreement",aggregateId:agreementId,eventType:"agreement.activated",payload:{agreementId},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  }
  this.store.insert("audit",{id:newId("audit"),actorId,action:"agreement.accept."+partyType.toLowerCase(),resourceType:"agreement",resourceId:agreementId,occurredAt:now});
  return acceptance;
 }
}
