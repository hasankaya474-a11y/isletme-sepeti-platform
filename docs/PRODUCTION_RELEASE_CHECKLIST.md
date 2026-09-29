# Production Release Checklist

Status: LOCKED / NOT YET AUTHORIZED
Date: 2026-09-29

## Engineering baseline
- Phase 0-18 engineering foundation complete
- main quality workflow green
- Architecture Lock v3 unchanged or changed only through ADR
- release-readiness hardening enabled
- PASS gates require evidence references
- unresolved HIGH/CRITICAL pilot defects block approval

## Mandatory evidence gates
- [ ] PRIVATE_PILOT PASS + evidence
- [ ] DEFECT_CLOSURE PASS + evidence
- [ ] SECURITY_REVIEW PASS + evidence
- [ ] RESTORE_VERIFICATION PASS + evidence
- [ ] LOAD_VERIFICATION PASS + evidence
- [ ] LEGAL_REVIEW PASS + evidence
- [ ] ACCOUNTING_REVIEW PASS + evidence
- [ ] PRIVACY_REVIEW PASS + evidence

## Final decision
Only after all boxes above are backed by real evidence:
- release manager records APPROVE with rationale
- gate snapshot is stored
- deployment remains a separate controlled action

## Stop conditions
Do not release if any gate is MISSING, PENDING or FAIL, if evidence is absent, or if any HIGH/CRITICAL pilot defect remains unresolved/unverified.

Production remains locked until this checklist is satisfied.
