# Okyanus EDT Commerce V2 Final Release Manifest

Status: CODE COMPLETE / PRE-PRODUCTION
Date: 2026-09-30
Canonical code source commit: `23c27fb7a07a9327184171631867c9ee296625ba`

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

Run only after backup and controlled staging PASS, in this order:

1. `okyonus-edt-worker/migrations/001_sales_mode.sql`
2. `okyonus-edt-worker/migrations/003_commerce_v2.sql`
3. `okyonus-edt-worker/migrations/004_commerce_extended.sql`
4. `okyonus-edt-worker/migrations/005_product_meta.sql`

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

These remain byte-preserved against the supplied baseline files.

## Completed Commerce V2 scope

- sales-first responsive homepage
- moving admin-managed banners
- admin-managed categories
- functional managed storefront sections by kind
- PRODUCT_GRID / CATEGORY_STRIP / CAMPAIGN / PROMO / CONTENT section semantics
- campaigns, brands, delivery, help and media management
- storefront catalog and URL search/category/filter routing
- product detail with image, price, package, stock, brand and description
- product SEO title and description wiring
- product featured / sort order metadata
- direct cart / quote add
- cart integrity and price summary
- quote submission through preserved quote engine
- product create/edit/active-passive control
- safe product soft-delete
- product price history
- safe bulk catalog import up to 500 rows
- mobile/tablet navigation and touch target locks
- staging Wrangler templates and binding checks
- release dry-run and offline staging preflight
- 200 EDT SEO route inventory preserved
- DIGITAL_MENU preserved active
- WHATSAPP remains hidden until separately verified

## Quality evidence

Canonical code source commit `23c27fb7a07a9327184171631867c9ee296625ba`:
- Okyonus Worker Quality: PASS
- quality: PASS

## Production state

- GitHub code: COMPLETE
- DENİZ production Worker: NOT DEPLOYED by this work
- ZAMAN production Worker: NOT DEPLOYED by this work
- Production D1 migrations: NOT RUN
- Production bindings/secrets: NOT MODIFIED

## Controlled deployment order

1. export current DENİZ source
2. export current ZAMAN source
3. record current Worker versions and binding names
4. back up shared production D1
5. create isolated staging bindings
6. run `npm run verify`
7. run `npm run staging:config-check`
8. run `npm run staging:binding-check`
9. run `npm run release:dry-run`
10. run migrations 001, 003, 004 and 005 on staging
11. deploy DENİZ staging
12. deploy ZAMAN staging
13. run `npm run staging:preflight` and collect real smoke-test evidence
14. verify quote email, contact email and photo lifecycle
15. verify member login, Digital Menu and representative SEO URLs
16. take fresh production backup
17. copy canonical DENİZ source preserving existing bindings/secrets
18. copy canonical ZAMAN source preserving existing bindings/secrets
19. run production migrations 001, 003, 004 and 005
20. deploy DENİZ
21. deploy ZAMAN
22. repeat production smoke tests
23. declare production PASS only after evidence is captured

## Rollback triggers

Rollback immediately if any of these fail:
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

GitHub PASS and production PASS are separate gates. Production is not considered PASS until real staging and production evidence exists.
