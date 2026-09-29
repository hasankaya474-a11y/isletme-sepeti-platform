import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {FinancialLedgerService} from "../packages/core/src/financial-ledger-service.mjs";
import {CommissionService} from "../packages/core/src/commission-service.mjs";
import {ReconciliationService} from "../packages/core/src/reconciliation-service.mjs";

test("ledger is append-only through explicit reversal",()=>{
  const s=new MemoryStore(),ledger=new FinancialLedgerService(s);
  const a=ledger.append({organizationId:"o1",entryType:"RECEIVABLE",direction:"CREDIT",amountMinor:10000,currency:"TRY",referenceType:"invoice",referenceId:"i1",actorId:"admin"});
  const r=ledger.reverse({entryId:a.id,actorId:"admin2"});
  assert.equal(r.entryType,"REVERSAL");
  assert.equal(r.direction,"DEBIT");
  assert.equal(ledger.balance({organizationId:"o1",currency:"TRY"}),0);
  assert.equal(s.find("financialLedger",()=>true).length,2);
});

test("commission accrual requires active rule",()=>{
  const s=new MemoryStore(),ledger=new FinancialLedgerService(s),svc=new CommissionService(s,ledger);
  const rule=svc.createRule({name:"Platform",rateBps:250,currency:"TRY",actorId:"admin"});
  assert.throws(()=>svc.accrue({ruleId:rule.id,organizationId:"o",baseAmountMinor:100000,currency:"TRY",referenceType:"order",referenceId:"1",actorId:"admin"}),/NOT_ACTIVE/);
  s.update("commissionRules",rule.id,x=>({...x,status:"ACTIVE"}));
  const row=svc.accrue({ruleId:rule.id,organizationId:"o",baseAmountMinor:100000,currency:"TRY",referenceType:"order",referenceId:"1",actorId:"admin"});
  assert.equal(row.amountMinor,2500);
});

test("reconciliation records explicit difference and resolution note",()=>{
  const s=new MemoryStore(),svc=new ReconciliationService(s);
  const c=svc.open({organizationId:"o",currency:"TRY",expectedMinor:10000,observedMinor:9500,actorId:"admin"});
  assert.equal(c.differenceMinor,-500);
  assert.equal(svc.resolve({id:c.id,note:"Belge ile doğrulandı",actorId:"admin2"}).status,"RESOLVED");
});
