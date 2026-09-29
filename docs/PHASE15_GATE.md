# Phase 15 Gate
Status: IN PROGRESS
Started: 2026-09-29

Scope: Integration Hub, API/webhooks and bulk import/export.

Foundation rules:
- external integrations use explicit connection records and scoped capabilities
- webhook delivery is signed, retryable and auditable
- bulk imports are staged/validated before apply
- exports are explicit jobs with access control
- integrations may not bypass domain permissions or ownership
- normal operations are codeless from Admin
- production remains locked

PASS requires the full module PASS rule in docs/ARCHITECTURE_LOCK.md.
