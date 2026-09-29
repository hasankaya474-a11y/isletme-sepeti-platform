import {newId} from "./id.mjs";
import {normalizeCurrency} from "./money-tax-service.mjs";

export class LedgerService{
 constructor(store){this.store=store;}
 postBalanced({transactionType,sourceType,sourceId,currency,entries,actorId}){
  if(!transactionType||!sourceType||!sourceId||!actorId||!Array.isArray(entries)||entries.length<2)throw new TypeError("LEDGER_FIELDS_REQUIRED");
  const cur=normalizeCurrency(currency);
  if(this.store.find("ledgerTransactions",x=>x.transactionType===transactionType&&x.sourceType===sourceType&&x.sourceId===sourceId).length)throw new Error("LEDGER_TRANSACTION_DUPLICATE");
  if(entries.some(x=>!Number.isSafeInteger(x.amountMinor)||x.amountMinor===0))throw new TypeError("LEDGER_AMOUNT_INVALID");
  if(entries.reduce((s,x)=>s+x.amountMinor,0)!==0)throw new Error("LEDGER_NOT_BALANCED");
  const now=new Date().toISOString(),tx={id:newId("ledgertx"),transactionType,sourceType,sourceId,currency:cur,status:"POSTED",createdBy:actorId,createdAt:now};
  this.store.insert("ledgerTransactions",tx);
  const posted=entries.map(x=>this.store.insert("ledgerEntries",{id:newId("ledger"),transactionId:tx.id,accountCode:x.accountCode,organizationType:x.organizationType??null,organizationId:x.organizationId??null,amountMinor:x.amountMinor,currency:cur,contraOfEntryId:x.contraOfEntryId??null,metadata:x.metadata??{},createdAt:now}));
  this.store.insert("audit",{id:newId("audit"),actorId,action:"ledger.transaction.post",resourceType:"ledger_transaction",resourceId:tx.id,occurredAt:now});
  return {transaction:tx,entries:posted};
 }
 reverse({transactionId,reason,actorId}){
  const original=this.store.get("ledgerTransactions",transactionId);if(!original||original.status!=="POSTED")throw new Error("LEDGER_TRANSACTION_NOT_REVERSIBLE");
  const originalEntries=this.store.find("ledgerEntries",x=>x.transactionId===transactionId);
  const result=this.postBalanced({transactionType:"REVERSAL",sourceType:"ledger_transaction",sourceId:transactionId,currency:original.currency,actorId,entries:originalEntries.map(x=>({accountCode:x.accountCode,organizationType:x.organizationType,organizationId:x.organizationId,amountMinor:-x.amountMinor,contraOfEntryId:x.id,metadata:{reason}}))});
  this.store.update("ledgerTransactions",transactionId,x=>({...x,status:"REVERSED"}));
  return result;
 }
 entriesFor({organizationType,organizationId,currency=null}){
  return this.store.find("ledgerEntries",x=>(!organizationType||x.organizationType===organizationType)&&(!organizationId||x.organizationId===organizationId)&&(!currency||x.currency===currency));
 }
}
