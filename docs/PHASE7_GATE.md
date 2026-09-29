# Phase 7 Gate
Status: IN PROGRESS
Started: 2026-09-29

Scope: Smart Cart, procurement approvals, requisition and PO readiness.

Safety rules:
- every cart line carries an explicitly chosen supplier
- cart calculations are deterministic; no hidden supplier substitution
- approval policies are explicit and code-free
- requester cannot approve their own approval-required requisition
- PO_READY does not create an order or payment
- prior locked phases remain additive and unchanged

PASS requires the full module rule in docs/ARCHITECTURE_LOCK.md.
Production remains locked.
