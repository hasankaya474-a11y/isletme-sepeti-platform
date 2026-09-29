# Okyanus EDT Commerce V2 Final Release Manifest

Status: CODE COMPLETE / PRE-PRODUCTION
Date: 2026-09-30
Source main commit: `b7c38a6bc5fba162a185c188de5c53d7a2b4dccb`

## Canonical Worker sources

DENİZ public Worker:
`okyonus-edt-worker/src/deniz-worker.js`

ZAMAN / ADMIN Worker:
`okyonus-edt-worker/src/zaman-admin-worker.js`

Commerce V2 public layer:
`okyonus-edt-worker/src/commerce-v2.js`

Commerce V2 admin layer:
`okyonus-edt-worker/src/commerce-admin-v2.js`

## Required production migrations

Run only after backup and controlled staging PASS:

1. `okyonus-edt-worker/migrations/001_sales_mode.sql`
2. `okyonus-edt-worker/migrations/003_commerce_v2.sql`
3. `okyonus-edt-worker/migrations/004_commerce_extended.sql`

`002_sales_data.sql` remains optional and is not part of the required production release set.

## Preserved critical engines

DENİZ regression locks:
- `sendBoundEmail`
- `quoteAPI`
- `photoInquiryAPI`
- `okyContactMessageAPI`

ZAMAN regression locks:
- `messageCenterRoute`
- `photoMessageRouteV2`

These are protected by contract tests against the supplied baseline files.

## Commerce V2 completed scope

- sales-first responsive homepage
- moving managed banners
- managed categories
- managed storefront sections
- managed campaigns
- managed brands
- managed delivery rules
- managed help content
- storefront product catalog
- URL search/category/filter routing
- product detail with image, price, package and stock
- direct cart / quote add
- cart integrity and price summary
- quote submission through preserved quote engine
- product create/edit/active-passive control
- safe product soft-delete
- product price history
- media management
- responsive admin controls
- mobile/tablet navigation and touch target locks
- 200 EDT SEO route inventory preserved
- DIGITAL_MENU preserved active
- WHATSAPP remains hidden until separately verified

## Quality evidence

Main commit `b7c38a6bc5fba162a185c188de5c53d7a2b4dccb`:
- Okyonus Worker Quality: PASS
- quality: PASS

The final code-completion branch also passed both gates before merge.

## Production state

- GitHub code: COMPLETE
- DENİZ production Worker: NOT DEPLOYED by this release preparation
- ZAMAN production Worker: NOT DEPLOYED by this release preparation
- Production D1 migrations: NOT RUN by this release preparation
- Production bindings/secrets: NOT MODIFIED

## Controlled deployment order

1. export current DENİZ source
2. export current ZAMAN source
3. record deployment versions and binding names
4. back up shared production D1
5. stage canonical DENİZ and ZAMAN sources
6. bind staging D1/R2/email/secrets
7. run migrations 001, 003 and 004 on staging
8. execute DENİZ smoke tests
9. execute ZAMAN smoke tests
10. verify quote email, contact email and photo lifecycle with real evidence
11. verify member login, Digital Menu and representative SEO URLs
12. take fresh production backup
13. copy canonical DENİZ source preserving existing bindings/secrets
14. copy canonical ZAMAN source preserving existing bindings/secrets
15. run required production migrations
16. deploy DENİZ
17. deploy ZAMAN
18. repeat smoke tests in production
19. declare production PASS only after evidence is captured

## Rollback triggers

Rollback immediately if any of the following fail:
- quote intake
- quote notification email
- contact/message recording
- contact notification
- photo upload or Admin retrieval
- member authentication
- core product route
- Admin authentication
- severe SEO routing regression

## Final rule

Do not label the live site PASS from GitHub test results alone. GitHub code PASS and production PASS are separate gates.
