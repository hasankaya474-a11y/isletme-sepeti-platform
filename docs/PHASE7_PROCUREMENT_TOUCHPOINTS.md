# Phase 7 Smart Cart / Procurement Touchpoints

Status: ACTIVE FOUNDATION
Date: 2026-09-29

## Human agency and approval
- Every cart line contains an explicitly selected supplier.
- Quote-derived cart lines preserve the supplier chosen by the quote.
- Approval-required requisitions cannot be approved by their requester.
- Approval policies are explicit business configuration, not AI decisions.
- PO_READY is a readiness flag only. It creates no order, purchase order document, payment or supplier commitment.

## Help
Help must explain supplier selection, price/tax estimates, cart source, approval thresholds, four-eyes approval, rejection and PO readiness blockers.

## Privacy / commercial controls
- Carts and requisitions are business-scoped.
- Approval decisions and policy changes are audited.
- Estimated values are not final transaction snapshots; Phase 8 must snapshot final order terms.
- Commercial data must not leak across business tenants.

## Production
Production remains locked.
