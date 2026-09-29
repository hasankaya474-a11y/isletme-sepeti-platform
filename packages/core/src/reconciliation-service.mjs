import {newId} from "./id.mjs";
import {normalizeCurrency} from "./money-tax-service.mjs";

export class ReconciliationService{
  constructor(store){this.store=store;}

  open({organizationId,currency,expectedMinor,observedMinor,actorId}){
    if(!organizationId||!actorId||!Number.isSafeInteger(expectedMinor)||!Number.isSafeInteger(observedMinor)) throw new TypeError("RECONCILIATION_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row={id:newId("recon"),organizationId,currency:normalizeCurrency(currency),expectedMinor,observedMinor,differenceMinor:observedMinor-expectedMinor,status:"OPEN",resolutionNote:null,createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"reconciliation.open",resourceType:"reconciliation_case",resourceId:row.id,occurredAt:now});
    return this.store.insert("reconciliationCases",row);
  }

  resolve({id,note,actorId}){
    if(!actorId||!note) throw new TypeError("RECONCILIATION_RESOLUTION_REQUIRED");
    const now=new Date().toISOString();
    const row=this.store.update("reconciliationCases",id,x=>({...x,status:"RESOLVED",resolutionNote:note,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"reconciliation.resolve",resourceType:"reconciliation_case",resourceId:id,occurredAt:now});
    return row;
  }
}
