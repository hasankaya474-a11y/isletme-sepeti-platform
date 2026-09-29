import {newId} from "./id.mjs";
import {assertMinorUnits,normalizeCurrency} from "./money-tax-service.mjs";

export class CommissionService{
  constructor(store,ledger){this.store=store;this.ledger=ledger;}

  createRule({name,rateBps,currency=null,actorId}){
    if(!name||!actorId||!Number.isInteger(rateBps)||rateBps<0||rateBps>10000) throw new TypeError("COMMISSION_RULE_INVALID");
    const now=new Date().toISOString();
    const row={id:newId("commissionrule"),name,rateBps,currency:currency?normalizeCurrency(currency):null,status:"DRAFT",createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"commission.rule.create",resourceType:"commission_rule",resourceId:row.id,occurredAt:now});
    return this.store.insert("commissionRules",row);
  }

  accrue({ruleId,organizationId,baseAmountMinor,currency,referenceType,referenceId,actorId}){
    const rule=this.store.get("commissionRules",ruleId);
    if(!rule||rule.status!=="ACTIVE") throw new Error("COMMISSION_RULE_NOT_ACTIVE");
    assertMinorUnits(baseAmountMinor);
    const c=normalizeCurrency(currency);
    if(rule.currency&&rule.currency!==c) throw new Error("COMMISSION_CURRENCY_MISMATCH");
    const amountMinor=Math.round(baseAmountMinor*rule.rateBps/10000);
    return this.ledger.append({organizationId,entryType:"COMMISSION",direction:"DEBIT",amountMinor,currency:c,referenceType,referenceId,memo:`Commission ${rule.rateBps} bps`,actorId});
  }
}
