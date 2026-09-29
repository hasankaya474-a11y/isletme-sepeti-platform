# Phase 15 Integration Touchpoints
Status: ACTIVE FOUNDATION
Date: 2026-09-29

- External systems use explicit integration connection records.
- Capabilities are scoped; integrations never bypass domain permissions.
- Webhook endpoints and signing secrets are referenced, not stored as plaintext operational output.
- Webhook deliveries are idempotent per subscription/event pair.
- Bulk imports are staged and validated before apply.
- Bulk exports remain access-controlled and auditable.
- Help content must explain connection lifecycle, capabilities, webhook retries and bulk-job validation.
- Production remains locked.
