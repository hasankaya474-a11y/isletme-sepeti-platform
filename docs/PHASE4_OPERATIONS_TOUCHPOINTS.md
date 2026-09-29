# Phase 4 Operations Touchpoints

Status: ACTIVE FOUNDATION
Date: 2026-09-29

This is an engineering control map, not legal or tax advice.

## Help
Contextual Help & Site Guide content must cover:
- creating and activating price books and tax profiles
- stock receipt, reservation, release and commit semantics
- the difference between on-hand, reserved and available stock
- delivery zones, calendars, cutoff and SLA lead windows
- common validation failures and safe recovery steps

Normal operations are expected to be code-free from authorized Admin surfaces.

## Privacy / legal / accounting touchpoints
- Pricing and tax configuration changes are audited.
- Tax profiles are configuration records, not a substitute for professional tax determination.
- Stock and reservation events may reveal supplier operating capacity; access is scope-controlled.
- Delivery zones and calendars should avoid storing unnecessary personal location data.
- Commercial transaction snapshots in later phases must preserve the price/tax terms actually used at transaction time.
- Retention/archive rules must preserve legally required financial and audit history.

## Events
Phase 4 defines explicit event contracts for pricing, tax, stock reservation and delivery-policy changes.
Events do not authorize payments, silently alter prices, choose suppliers or place orders.

## UI states
Admin surfaces define loading, empty, error and forbidden states and inherit the platform keyboard, focus, touch-target and responsive contracts.

## Production
Production remains locked until the Architecture Lock release gates are satisfied.
