# Phase 1 Threat Model
Status: BASELINE

Protected assets: credentials, sessions, MFA secrets, memberships, roles/scopes, company identity, audit/security logs.

Threats and controls:
- Credential stuffing: generic login errors, rate limiting, MFA.
- Session theft: random bearer token, hash-at-rest, secure HttpOnly cookie policy, expiry/revocation.
- CSRF: SameSite cookie plus anti-CSRF token for state-changing web requests.
- Cross-tenant IDOR: object-level tenant guard plus scoped authorization.
- Privilege escalation: default deny, explicit permissions/scopes, MFA, four-eyes for selected role changes.
- Recovery abuse: expiring one-time hashed token; password reset revokes active sessions.
- Audit tampering: application has append-oriented audit contract; deployed persistence must restrict update/delete.
- Secret leakage: never log passwords/tokens/MFA secrets; deployed MFA secret storage requires encryption adapter.

Residual work: production-grade distributed throttling, encrypted secret adapter, passkeys, database policy hardening, penetration/security testing before production.
