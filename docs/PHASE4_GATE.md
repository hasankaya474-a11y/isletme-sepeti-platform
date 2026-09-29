# Phase 4 Gate
Status: IN PROGRESS
Started: 2026-09-29

Scope: Pricing, Money/Tax, Stock, Reservation, Delivery Zones, Calendar and SLA.

Foundation sequence:
1. Pricing + Money/Tax deterministic domain rules
2. Stock + reservation consistency
3. Delivery zone/calendar/SLA contracts
4. Admin/control counterparts for normal operations
5. Protected APIs, persistence E2E, audit/events/help/privacy touchpoints
6. responsive/accessibility/error-empty-loading states and regression coverage

Safety rules:
- no silent AI price changes
- money stored as integer minor units with explicit currency
- tax computation is deterministic and explainable
- production remains locked
- Phase 2 and Phase 3 contracts remain additive and unchanged

PASS requires the full module PASS rule in docs/ARCHITECTURE_LOCK.md.
