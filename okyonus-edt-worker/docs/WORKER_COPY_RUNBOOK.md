# DENİZ / ZAMAN Worker Copy and Release Runbook

Status: READY FOR CONTROLLED DEPLOYMENT
Date: 2026-09-29

## Canonical files

DENİZ:
`okyonus-edt-worker/src/deniz-worker.js`

ZAMAN:
`okyonus-edt-worker/src/zaman-admin-worker.js`

Required visibility migration:
`okyonus-edt-worker/migrations/001_sales_mode.sql`

Do not treat `migrations/002_sales_data.sql` as a mandatory production migration. It is an optional extension layer.

## 1. Before touching Cloudflare

1. Export the current DENİZ Worker source.
2. Export the current ZAMAN Worker source.
3. Record current deployment/version identifiers.
4. Back up the shared production D1.
5. Record binding names and presence without copying secret values into GitHub.
6. Confirm the old Worker source can be restored immediately.

## 2. Staging first

1. Copy DENİZ source to a staging Worker.
2. Copy ZAMAN source to a staging Admin Worker.
3. Bind staging D1 and staging R2 buckets.
4. Configure staging email/notification bindings.
5. Run `001_sales_mode.sql` on staging.
6. Confirm active flags: PRODUCTS, QUOTE, PHOTO, WHATSAPP, SEO, MEMBERSHIP, DIGITAL_MENU.
7. Confirm hidden flags: COST, COST_RADAR, ACADEMY, CESNI and other intentionally hidden legacy modules.

## 3. DENİZ smoke test

- homepage returns 200 and new sales-first UI
- product catalog/search
- quote list
- real test quote creates request number
- quote email arrives
- contact form records message before notification
- contact email arrives
- photo upload creates request number
- photo notification arrives
- WhatsApp deep link has correct number/context
- member login
- Digital Menu builder
- at least 30 themes
- at least 30 templates
- menu publish/update/delete
- public QR menu
- hidden modules unavailable/noindex
- Help exposes active guides only
- representative legacy SEO URLs
- sitemap/robots

## 4. ZAMAN smoke test

- admin login
- session and CSRF behavior
- Message Center
- Photo request workflow
- B2B quote list/detail/status/pricing/order conversion
- product create/edit/stock/toggle
- price history
- customer list/detail/status
- reports
- Studio/media
- Sales Mode/module flags
- audit entry for module change

## 5. Production copy

Only after staging PASS:
1. take a fresh production backup
2. copy canonical DENİZ source
3. preserve all existing DENİZ bindings/secrets
4. copy canonical ZAMAN source
5. preserve all existing ZAMAN bindings/secrets
6. run only required migration `001_sales_mode.sql`
7. deploy DENİZ
8. deploy ZAMAN
9. run the same smoke tests against production
10. keep prior Worker source/deployment available for rollback

## 6. Immediate rollback triggers

Rollback if any of these fail:
- quote intake
- quote notification email
- contact/message recording
- contact notification
- photo upload or Admin retrieval
- member authentication
- core product route
- Admin authentication
- severe SEO routing regression

## 7. Production evidence

Do not call production PASS until real evidence exists for:
- email receipt
- contact/message receipt
- photo request lifecycle
- quote lifecycle
- member login
- Digital Menu publish/open
- sample SEO URLs
- rollback availability
