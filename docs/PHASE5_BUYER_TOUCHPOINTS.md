# Phase 5 Buyer Search & Matching Touchpoints

Status: ACTIVE FOUNDATION
Date: 2026-09-29

This is an engineering control map.

## Human agency
- Search returns discoverable products and commercial signals.
- Product cards show offer counts, price range and stock signals without selecting a supplier.
- List/photo matching creates candidates only.
- Candidate confirmation or rejection is an explicit buyer/admin action.
- No candidate can silently become a substitution, supplier choice, cart line, order or payment action.

## Help
Help & Site Guide must explain search, filters, product-card fields, price-range semantics, stock signals, list upload, photo upload, confidence indicators, candidate review and rejection.

## Privacy
- Photo/list uploads can contain business-sensitive information and must be access-scoped.
- Raw uploads should not be retained longer than needed for matching and audit requirements.
- Personal data accidentally present in uploaded material should not be used for unrelated purposes.
- Access to matching requests and candidate decisions is tenant-scoped and auditable.

## Search fairness and transparency
- Search relevance is product-query matching, not hidden supplier favoritism.
- Supplier selection remains explicit.
- Search synonym changes are Admin-managed and audited.

## Production
Production remains locked.
