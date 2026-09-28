# ADR-0005 Secret Storage
Status: Accepted
Date: 2026-09-28

MFA and integration secrets must never be stored as plaintext. The domain depends on a secret-box/provider abstraction. The local implementation uses authenticated AES-256-GCM with an externally supplied 32-byte key. Deployment keys belong in the environment secret manager, not source, database rows or logs. Key rotation/versioning is required before production.
