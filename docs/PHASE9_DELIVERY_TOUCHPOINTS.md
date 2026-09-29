# Phase 9 Delivery / Receiving / RMA Touchpoints

Status: ACTIVE FOUNDATION
Date: 2026-09-29

## Delivery policy and capacity
- Phase 4 zones, calendars and SLA remain the policy source.
- Suppliers explicitly create/select capacity slots; the system does not silently choose routes, carriers or slots.
- One operational delivery is created per supplier order in this foundation.

## ETA transparency
- ETA source is always exposed.
- SUPPLIER_CONFIRMED means the supplier explicitly set eta_at.
- SCHEDULE_WINDOW_END means no supplier ETA exists and the UI shows the scheduled window end.
- No opaque predictive ETA is generated.

## Receiving
- Business users record accepted and rejected quantities per delivery item.
- Completing receiving transitions the order through the locked order state machine.
- Rejected quantities mark receiving DISPUTED and preserve evidence.

## Returns / RMA
- RMA requests are business-scoped and supplier decisions are supplier-scoped.
- RMA records do not create refunds, credits, payments or accounting entries.
- Financial treatment belongs to later invoice/ledger phases.

## Privacy / audit
- Delivery times, operational capacity and receiving evidence are commercially sensitive and tenant-scoped.
- Mutations are audited and operational events use the shared outbox/event architecture.

Production remains locked.
