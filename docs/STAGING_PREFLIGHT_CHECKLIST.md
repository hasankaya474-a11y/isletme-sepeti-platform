# PRIVATE_STAGING / CLOSED_REAL_TEST Preflight

Status: READY
Date: 2026-09-29

Before pilot execution verify:

- APP_ENV is PRIVATE_STAGING or CLOSED_REAL_TEST
- RELEASE_ID identifies the tested commit/build
- environment secrets are isolated from production
- PUBLIC_BASE_URL and API_BASE_URL point only to the intended test environment
- PRIVATE_STAGING is authenticated and noindex
- production payment execution is disabled
- production email/SMS/WhatsApp adapters are disabled unless explicitly approved test adapters are configured
- production customer data is not copied into test
- admin MFA and CSRF protections are active
- tenant isolation tests are green
- database migration set is current
- backup reference exists before destructive pilot tests
- restore procedure is known
- audit logging is enabled
- outbox/webhook integrations use test endpoints
- optional location collection is disabled unless pilot enrollment + consent exists
- current main quality run is SUCCESS

A failed preflight item blocks pilot start until corrected.
