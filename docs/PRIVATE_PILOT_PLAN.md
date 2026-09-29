# Private Pilot Plan

Status: READY TO EXECUTE
Date: 2026-09-29

## Objective
Validate the full B2B procurement journey in PRIVATE_STAGING / CLOSED_REAL_TEST with a controlled cohort before any production decision.

## Minimum pilot cohort
- at least 2 buyer businesses
- at least 2 suppliers
- at least 1 platform/admin operator
- separate identities for requester and approver where four-eyes is required

## Mandatory end-to-end scenarios
1. Supplier onboarding and supplier offer creation
2. Catalog/search/product-card discovery
3. Buyer list creation and list/photo matching review
4. RFQ creation, supplier invitation, quote submission and factual comparison
5. Cart creation and procurement approval
6. PO_READY -> explicit order creation
7. Stock reservation and delivery planning
8. Delivery, receiving and partial/rejected receiving
9. RMA/dispute path
10. Supplier invoice and three-way match
11. Agreement/evidence review
12. Commission/ledger/reconciliation inspection
13. Report export request
14. Support/call-center case
15. Integration/webhook test adapter
16. Optional live-location pilot only for explicitly consented participants

## Evidence required
For each scenario record:
- scenario ID
- participant roles
- release ID
- start/end timestamp
- result PASS/FAIL
- screenshots/log/artifact reference
- defects raised
- reviewer

## Exit criteria
PRIVATE_PILOT may be marked PASS only when mandatory scenarios are executed with real pilot evidence and there are no unresolved HIGH/CRITICAL pilot defects.
