# Defect Closure Protocol

Status: ACTIVE
Date: 2026-09-29

## Severity
- CRITICAL: security boundary, money integrity, cross-tenant exposure, irreversible commercial corruption or production-blocking failure
- HIGH: core purchase/order/delivery/invoice flow materially fails
- MEDIUM: important workflow degraded with safe workaround
- LOW: cosmetic or low-impact issue

## Lifecycle
OPEN -> IN_PROGRESS -> RESOLVED -> VERIFIED

WONT_FIX is permitted only with documented rationale and governance outside this engineering foundation.

## Closure rule
A defect is not closed for release purposes at RESOLVED. It must reach VERIFIED after regression evidence.

## Release blockers
- any CRITICAL defect not VERIFIED
- any HIGH defect not VERIFIED
- regression failure in a previously locked phase
- unresolved tenant, money, audit, MFA/CSRF or release-gate failure

## Required evidence
- defect ID and severity
- reproduction steps
- root cause
- affected phase/domain
- fix commit/PR
- regression test
- verification evidence
- verifier identity/date
