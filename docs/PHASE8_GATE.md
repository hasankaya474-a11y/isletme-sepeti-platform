# Phase 8 Gate
Status: IN PROGRESS
Started: 2026-09-29

Scope: Order creation/state machine, immutable commercial snapshot, idempotency and transactional outbox.

Safety rules:
- orders are created only by explicit action from a PO_READY requisition
- each supplier becomes a distinct order; no supplier is silently selected
- duplicate order creation is blocked by idempotency and requisition/supplier uniqueness
- commercial terms are snapshotted at creation
- state transitions use the existing locked order state machine
- outbox event is written with the order transaction
- no payment execution occurs in this phase

PASS requires the architecture module rule. Production remains locked.
