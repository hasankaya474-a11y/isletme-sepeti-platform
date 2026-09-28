# Environment Policy

LOCAL -> DEV -> PRIVATE_STAGING -> CLOSED_REAL_TEST -> PRODUCTION

PRODUCTION is disabled by policy until formal approval.

Each environment has isolated configuration and secrets. Secrets never enter source control.

Required environment controls:
- APP_ENV
- RELEASE_ID
- PUBLIC_BASE_URL
- API_BASE_URL
- FEATURE_FLAG_SOURCE
- LOG_LEVEL

Real payment, production email/SMS/WhatsApp, production customer data and public indexing are forbidden in LOCAL/DEV unless a specific approved test adapter is used.

PRIVATE_STAGING must default to noindex and authenticated access.
