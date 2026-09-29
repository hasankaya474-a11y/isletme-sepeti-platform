# Phase 8 Order / Snapshot / Outbox Touchpoints

Status: ACTIVE FOUNDATION
Date: 2026-09-29

## Order creation
- An order can only be created from a PO_READY requisition through an explicit authenticated action.
- One order is created per explicitly selected supplier group.
- A requisition/supplier uniqueness constraint and idempotency record prevent duplicate creation.
- The API requires an Idempotency-Key header.

## Immutable commercial snapshot
- Product/variant, supplier, quantity, unit price, tax rate and monetary totals are copied into order lines and snapshot data at order creation.
- Later catalog, quote or cart changes do not rewrite the order snapshot.
- Snapshot SHA-256 provides tamper-evidence for the serialized commercial snapshot.

## State machine
- Existing order-state-machine.mjs is preserved as the transition authority.
- Buyer/supplier/platform access is tenant-scoped by the transition service and protected API.

## Transactional outbox
- Order creation/state changes create PENDING outbox events.
- Persistence tests verify transaction rollback keeps order/outbox atomic.
- Failed events can be explicitly retried from Admin; event retry never recreates an order.

## Privacy / legal / accounting
- Order snapshots are commercial evidence and require retention controls.
- Tenant isolation applies to order and line visibility.
- Payment execution is outside this phase.

Production remains locked.
