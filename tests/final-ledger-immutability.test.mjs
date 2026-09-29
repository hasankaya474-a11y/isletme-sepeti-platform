import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("financial ledger immutability is enforced by database migration",async()=>{
  const sql=await readFile("database/migrations/028_financial_ledger_immutability.sql","utf8");
  assert.match(sql,/CREATE TRIGGER financial_ledger_entries_no_update/);
  assert.match(sql,/BEFORE UPDATE ON financial_ledger_entries/);
  assert.match(sql,/CREATE TRIGGER financial_ledger_entries_no_delete/);
  assert.match(sql,/BEFORE DELETE ON financial_ledger_entries/);
  assert.match(sql,/FINANCIAL_LEDGER_ENTRY_IMMUTABLE/);
});
