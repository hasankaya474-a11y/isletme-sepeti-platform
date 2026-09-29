# İşletme Sepeti Platform

İşletme Sepeti B2B Platform Ana Motoru.

## Current status
- Architecture Lock v3: LOCKED
- Engineering plan Phase 0-18: COMPLETE
- Main branch quality gate: required before every merge
- Production: LOCKED
- Production release: evidence-driven, explicit human decision only

## Completed engineering domains
Identity/RBAC, Admin control plane, Catalog/PIM, Pricing/Tax, Stock/Reservation, Search/Buyer UX, RFQ/Quote, Cart/Procurement, Orders/Snapshots/Outbox, Delivery/Receiving/RMA, Invoice/Three-way Match, Agreements/Evidence, Financial Ledger/Reconciliation, Reporting, Support/Disputes, Campaigns/Market Radar, Integration Hub, Retention/Security Readiness, Traceability/Location Pilot and Release Readiness.

## Release path
LOCAL -> DEV -> PRIVATE_STAGING -> CLOSED_REAL_TEST -> PRODUCTION

Production remains unavailable until all mandatory release gates have real evidence and an explicit APPROVE decision is recorded.

See:
- docs/ARCHITECTURE_LOCK.md
- docs/ENGINEERING_COMPLETION.md
- docs/RELEASE_READINESS_RUNBOOK.md
- docs/PRIVATE_PILOT_PLAN.md
- docs/PRODUCTION_RELEASE_CHECKLIST.md
