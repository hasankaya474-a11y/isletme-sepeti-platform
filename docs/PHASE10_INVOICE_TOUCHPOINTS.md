# Phase 10 Invoice / Three-way Match / Agreement Touchpoints

Status: ACTIVE FOUNDATION
Date: 2026-09-29

## Three-way match
- Commercial price and tax expectations come from immutable order lines/snapshot.
- Quantity expectations come from receiving evidence.
- Missing receiving, missing invoice line, quantity, price and tax mismatches are explicit issue codes.
- MATCHED means data alignment only. It is not payment authorization.

## Invoice review
- Business/accounting users explicitly approve or reject.
- An EXCEPTION can only be approved with a recorded override reason.
- Approval creates no payment, bank instruction or ledger settlement.

## Agreements
- Agreements become ACTIVE only after explicit BUSINESS and SUPPLIER acceptances.
- Terms are versioned commercial configuration and do not silently replace order snapshots.

## Evidence
- Evidence attachments are append-only references scoped to invoice/agreement participants or platform Admin.
- Evidence and invoice data are commercially sensitive and audited.

Production remains locked.
