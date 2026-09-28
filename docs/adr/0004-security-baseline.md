# ADR-0004 Security Baseline

Status: Accepted
Date: 2026-09-28

Identity uses default-deny authorization, tenant scopes, one-way password derivation, hashed session/recovery tokens, MFA for high-risk operations, security-event logging, rate-limit primitives and four-eyes approval for selected critical actions.

TOTP is an initial interoperable MFA mechanism. The architecture keeps passkeys/WebAuthn as a stronger future method. Secrets must be encrypted or held by a secret-management adapter in deployed environments.

In-memory adapters are development/test infrastructure only. Production persistence must use transactional repositories and environment-isolated storage.
