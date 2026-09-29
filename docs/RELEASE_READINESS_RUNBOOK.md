# İşletme Sepeti Release Readiness Runbook

Status: ACTIVE
Date: 2026-09-29

## Purpose
This runbook is the single operational path from engineering-complete to a production decision. It does not authorize production by itself.

## Required evidence gates
Every mandatory gate must be entered as PASS with a concrete evidence reference.

1. PRIVATE_PILOT
   - pilot cohort and dates
   - completed business/supplier scenarios
   - observed defects and outcomes
   - sign-off reference

2. DEFECT_CLOSURE
   - open defect inventory
   - HIGH/CRITICAL defects VERIFIED or formally governed outside this foundation
   - regression-test evidence

3. SECURITY_REVIEW
   - security review or penetration-test report reference
   - unresolved critical findings: zero for approval

4. RESTORE_VERIFICATION
   - backup reference
   - restore environment
   - restore checks and result
   - reviewer identity/date

5. LOAD_VERIFICATION
   - scenario keys
   - target and observed throughput
   - p95 latency
   - error rate
   - evidence artifact

6. LEGAL_REVIEW
   - contracts/terms/privacy/commercial workflow review reference
   - reviewer and date

7. ACCOUNTING_REVIEW
   - invoice/tax/commission/ledger/reconciliation review reference
   - reviewer and date

8. PRIVACY_REVIEW
   - retention, exports, support data and live-location pilot review reference
   - reviewer and date

## Release sequence
PRIVATE_STAGING -> CLOSED_REAL_TEST -> evidence review -> release decision.

Production approval is allowed only when:
- every mandatory gate is PASS with evidence,
- there are no unresolved HIGH/CRITICAL pilot defects,
- the release manager records an explicit APPROVE decision with rationale.

The APPROVE decision does not deploy anything. Deployment remains a separate controlled operational action.

## Failure handling
A FAIL, PENDING or MISSING gate keeps production locked. Any new HIGH/CRITICAL pilot defect reintroduces a blocker until VERIFIED.

## Non-negotiable controls
Do not fabricate evidence. Do not mark a gate PASS from repository tests alone when the gate requires real pilot, legal, accounting, privacy or external security review.
