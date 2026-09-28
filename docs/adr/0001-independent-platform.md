# ADR-0001: Independent Platform and Deployment

Status: Accepted
Date: 2026-09-28

## Decision
Build İşletme Sepeti as an independent platform with its own repository, application surfaces, data ownership, environments and deployment lifecycle.

## Environment progression
LOCAL -> DEV -> PRIVATE STAGING -> DOMAIN CONNECTED -> CLOSED REAL TEST -> FINAL APPROVAL -> PRODUCTION

## Constraints
- No production/public release merely because code exists.
- No real-money flow before payment, security, accounting and legal gates.
- No arbitrary code editor in Admin.
- Provider-specific infrastructure must sit behind adapters where practical.
