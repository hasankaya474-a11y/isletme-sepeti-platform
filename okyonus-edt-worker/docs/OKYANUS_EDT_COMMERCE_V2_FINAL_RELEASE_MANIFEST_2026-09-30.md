# Okyanus EDT Commerce V2 Final Release Manifest

Status: CODE COMPLETE / PRE-PRODUCTION
Date: 2026-09-30
Canonical code source commit: `96406528a399b66f986d155af4a8544f93bc46a0`
Architecture build: `commerce-v2-2026-09-30-architecture-v15`

## Canonical Worker sources

DENİZ public Worker:
`okyonus-edt-worker/src/deniz-worker.js`

ZAMAN / ADMIN Worker:
`okyonus-edt-worker/src/zaman-admin-worker.js`

Commerce public layer:
`okyonus-edt-worker/src/commerce-v2.js`

Commerce admin/control layer:
`okyonus-edt-worker/src/commerce-admin-v2.js`

Single-file manual copy bundles:
- `okyonus-edt-worker/dist/deniz-worker.single.js`
- `okyonus-edt-worker/dist/zaman-admin-worker.single.js`

## Required production migrations

Run only after backup and controlled staging PASS, in this order:

1. `okyonus-edt-worker/migrations/001_sales_mode.sql`
2. `okyonus-edt-worker/migrations/003_commerce_v2.sql`
3. `okyonus-edt-worker/migrations/004_commerce_extended.sql`
4. `okyonus-edt-worker/migrations/005_product_meta.sql`
5. `okyonus-edt-worker/migrations/006_commerce_control_plane.sql`

`002_sales_data.sql` remains optional and is not part of the required production sequence.

## Preserved critical engines

DENİZ regression locks:
- `sendBoundEmail`
- `quoteAPI`
- `photoInquiryAPI`
- `okyContactMessageAPI`

ZAMAN regression locks:
- `messageCenterRoute`
- `photoMessageRouteV2`

These functions remain byte-preserved against the supplied baseline sources.

## Completed public commerce architecture

- sales-first responsive homepage
- sticky desktop/mobile commerce header and search
- desktop left category rail and mobile navigation
- Okyanus logo and centrally managed site/contact settings
- Hasan Kaya sales-contact setting with phone, email and WhatsApp
- admin-managed moving banner carousel
- desktop/mobile banner media, dots, prev/next, keyboard, hover pause and touch swipe
- admin-managed category media with safe fallback visual
- product catalog, URL search, category and discount/new filters
- product cards with image, brand/category, pack, unit, stock and badges
- list price, sale price and effective campaign price display
- product SKU, barcode, subcategory, origin, storage and cold-chain metadata
- minimum-order and quantity-step contract
- product favorites stored client-side
- product detail and related products
- product SEO title/description
- robust product select → cart → quote flow
- current-catalog reconciliation, duplicate merge and missing-product protection
- live cart count, quantity controls, remove/clear, totals and request confirmation
- preserved `/api/quote` contract
- explicit KVKK consent on quote/contact flows
- cookie preference panel with essential/all choice persistence
- searchable Site Help
- consented newsletter signup
- 200 EDT SEO routes rendered in four 50-link modules
- admin-managed SEO link labels/groups/order/visibility
- managed storefront sections by semantic kind
- brands, campaigns, delivery, help and media surfaces
- DIGITAL_MENU preserved
- hidden legacy modules remain outside the primary commerce surface

## Completed Admin control plane

Commerce Admin controls:
- products and activation/soft-delete
- product image and metadata
- SKU and barcode
- category and subcategory
- unit, package, minimum order and quantity step
- stock status
- base/list/sale price
- price history
- featured / bestseller / new-until
- brand relation
- product SEO
- categories with hierarchy, images and SEO
- banners with desktop/mobile media, schedule, audience/device fields and CTA
- managed storefront sections
- brands
- campaigns
- campaign discount rules for PRODUCT / CATEGORY / BRAND / ALL
- percent/fixed product campaign pricing
- delivery rules and cold-chain control
- media library records
- Site Help
- 200-link SEO control
- site/contact settings
- newsletter subscriber visibility/unsubscribe control
- safe bulk catalog import
- existing Okyanus catalog sync

Operational customer, quote, order, Message Center, photo workflow, audit, authentication and B2B customer-price operations remain in the existing ZAMAN/ADMIN backbone rather than being duplicated.

## Media rule

Bonservis or other third-party product imagery is not copied into this release. Product/category/banner media must be Okyanus-owned, licensed, supplied by the user, or separately generated/original. Missing product imagery uses the Okyanus fallback visual so cards never render as empty boxes.

## Quality evidence

Canonical code source commit `96406528a399b66f986d155af4a8544f93bc46a0`:
- Okyonus Worker Quality: PASS
- quality: PASS
- single-file bundle byte-current contract: PASS
- protected legacy engine contract: PASS

## Production state

- GitHub architecture/code: COMPLETE
- DENİZ production Worker deployment by this release pass: NOT PERFORMED
- ZAMAN production Worker deployment by this release pass: NOT PERFORMED
- Production D1 migrations by this release pass: NOT RUN
- Production bindings/secrets by this release pass: NOT MODIFIED

## Controlled deployment order

1. export current DENİZ source
2. export current ZAMAN source
3. record current Worker versions and bindings
4. back up shared production D1
5. create isolated staging bindings
6. run `npm run verify`
7. run `npm run staging:config-check`
8. run `npm run staging:binding-check`
9. run `npm run release:dry-run`
10. run migrations 001, 003, 004, 005 and 006 on staging
11. deploy DENİZ staging
12. deploy ZAMAN staging
13. run `npm run staging:preflight`
14. verify managed banner motion and responsive media
15. verify category/product media coverage
16. verify product price, campaign discount, min-order and qty-step behavior
17. verify product → cart → quote and request-number lifecycle
18. verify quote email, contact email and photo lifecycle
19. verify Hasan Kaya contact settings / WhatsApp / email
20. verify KVKK/cookie preferences and newsletter consent
21. verify member login and Digital Menu
22. verify 4 x 50 SEO modules and representative SEO URLs
23. verify Admin controls and ZAMAN operational flows
24. confirm rollback source/version
25. take a fresh production backup
26. only then run required production migrations
27. only then deploy DENİZ and ZAMAN
28. repeat production smoke tests
29. declare production PASS only after evidence is captured

## Rollback triggers

Rollback immediately if any of these fail:
- quote intake
- quote notification email
- contact/message recording
- contact notification
- photo upload/Admin retrieval
- member authentication
- core product/catalog/cart route
- campaign/product pricing integrity
- Admin authentication/control plane
- severe SEO routing regression

## Final rule

GitHub PASS and production PASS are separate gates. Production is not considered PASS until real staging and production evidence exists.
