import {newId} from "./id.mjs";
import {assertMinorUnits,normalizeCurrency} from "./money-tax-service.mjs";

const TYPES=new Set(["COMMISSION","RECEIVABLE","PAYABLE","ADJUSTMENT","REVERSAL"]);
const DIRECTIONS=new Set(["DEBIT","CREDIT"]);

export class FinancialLedgerService{
  constructor(store){this.store=store;}

  append({organizationId,entryType,direction,amountMinor,currency,referenceType,referenceId,sourceEntryId=null,memo=null,actorId}){
    if(!organizationId||!referenceType||!referenceId||!actorId) throw new TypeError("LEDGER_FIELDS_REQUIRED");
    if(!TYPES.has(entryType)||!DIRECTIONS.has(direction)) throw new Error("LEDGER_ENUM_INVALID");
    assertMinorUnits(amountMinor);
    const row={id:newId("ledger"),organizationId,entryType,direction,amountMinor,currency:normalizeCurrency(currency),referenceType,referenceId,sourceEntryId,memo,createdBy:actorId,createdAt:new Date().toISOString()};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"ledger.append",resourceType:"financial_ledger_entry",resourceId:row.id,occurredAt:row.createdAt});
    return this.store.insert("financialLedger",row);
  }

  reverse({entryId,actorId,memo="Reversal"}){
    const original=this.store.get("financialLedger",entryId);
    if(!original) throw new Error("LEDGER_ENTRY_NOT_FOUND");
    if(this.store.find("financialLedger",x=>x.entryType==="REVERSAL"&&x.sourceEntryId===entryId).length) throw new Error("LEDGER_ALREADY_REVERSED");
    return this.append({
      organizationId:original.organizationId,
      entryType:"REVERSAL",
      direction:original.direction==="DEBIT"?"CREDIT":"DEBIT",
      amountMinor:original.amountMinor,
      currency:original.currency,
      referenceType:original.referenceType,
      referenceId:original.referenceId,
      sourceEntryId:entryId,
      memo,
      actorId
    });
  }

  balance({organizationId,currency}){
    const c=normalizeCurrency(currency);
    return this.store.find("financialLedger",x=>x.organizationId===organizationId&&x.currency===c)
      .reduce((sum,x)=>sum+(x.direction==="CREDIT"?x.amountMinor:-x.amountMinor),0);
  }
}
