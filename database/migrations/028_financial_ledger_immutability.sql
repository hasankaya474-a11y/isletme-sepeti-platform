PRAGMA foreign_keys=ON;

CREATE TRIGGER financial_ledger_entries_no_update
BEFORE UPDATE ON financial_ledger_entries
BEGIN
 SELECT RAISE(ABORT,'FINANCIAL_LEDGER_ENTRY_IMMUTABLE');
END;

CREATE TRIGGER financial_ledger_entries_no_delete
BEFORE DELETE ON financial_ledger_entries
BEGIN
 SELECT RAISE(ABORT,'FINANCIAL_LEDGER_ENTRY_IMMUTABLE');
END;
