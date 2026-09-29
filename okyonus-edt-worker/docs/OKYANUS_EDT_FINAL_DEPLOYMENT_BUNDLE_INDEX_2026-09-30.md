# Okyanus EDT Final Deployment Bundle Index

Status: CODE COMPLETE / PRE-PRODUCTION
Date: 2026-09-30
Canonical code source commit: `96406528a399b66f986d155af4a8544f93bc46a0`
Architecture build: `commerce-v2-2026-09-30-architecture-v15`

## Quality status

- quality: PASS
- Okyonus Worker Quality: PASS
- protected engine regression locks: PASS
- single-file bundle parity: PASS

## Canonical bundle files

| Purpose | Path | Git blob SHA |
|---|---|---|
| DENİZ canonical Worker | `okyonus-edt-worker/src/deniz-worker.js` | `2cb276c926f6e924131e9e4aff36671d25f9fa34` |
| ZAMAN / ADMIN canonical Worker | `okyonus-edt-worker/src/zaman-admin-worker.js` | `ed3ebdf1b8172fa2660b714fe9e4346d73e6b26e` |
| Commerce public | `okyonus-edt-worker/src/commerce-v2.js` | `7b8ff552ce0fa7fb0ee64ad7ace34eac5838ea60` |
| Commerce admin | `okyonus-edt-worker/src/commerce-admin-v2.js` | `599e47cb19dbf114c547ebf2d2205d591ce3d054` |
| DENİZ single-file bundle | `okyonus-edt-worker/dist/deniz-worker.single.js` | `3d4220e55a4b4d480d715e49316859f2acf2e86a` |
| ZAMAN single-file bundle | `okyonus-edt-worker/dist/zaman-admin-worker.single.js` | `c893e0e7574970c8b1e094065f7adcd29b3b7644` |
| Migration 001 | `okyonus-edt-worker/migrations/001_sales_mode.sql` | `6c8fc6a4461470381a3e9d491bfc119248d209be` |
| Migration 003 | `okyonus-edt-worker/migrations/003_commerce_v2.sql` | `aa527935ddf52c6ca08a741c167505a87b4b9316` |
| Migration 004 | `okyonus-edt-worker/migrations/004_commerce_extended.sql` | `c2e02f7076e4ef77d0c3dbc33795f6b88e053945` |
| Migration 005 | `okyonus-edt-worker/migrations/005_product_meta.sql` | `38e574a7ae0d16c4766f546afc38887c8e00f903` |
| Migration 006 | `okyonus-edt-worker/migrations/006_commerce_control_plane.sql` | `1dd008cd6a3dc23d6fecbaf4f5cc285d584ec653` |
| Release dry-run | `okyonus-edt-worker/scripts/release-dry-run.mjs` | `399a8e5809a349fd7a59b0944b2388e9ba3c9029` |
| Staging preflight | `okyonus-edt-worker/scripts/staging-preflight.mjs` | `9a4f4a635e874b2a56034c87437cf20f0b5c419c` |

## Required migration order

`001 → 003 → 004 → 005 → 006`

Do not insert migration 002 into the required production sequence.

## Binding rule

Never replace or invent production binding names or secret values.

DENİZ must preserve:
- DB
- PHOTO_TEMP
- EMAIL
- MAIL_FROM
- MAIL_TO / ADMIN_MAIL_TO
- quote/contact/photo webhook variables
- membership/session secrets

ZAMAN must preserve:
- DB
- MEDIA_STORE
- PHOTO_TEMP
- SESSION_PEPPER
- BOOTSTRAP_TOKEN only when intentionally configured
- existing Cloudflare Access configuration
- legacy aliases documented in `docs/BINDINGS_MATRIX.md`

## Production gate

Production remains blocked until:
1. existing Workers are exported
2. production D1 backup exists
3. isolated staging bindings are verified
4. migrations 001, 003, 004, 005 and 006 pass in staging
5. DENİZ and ZAMAN staging smoke tests pass
6. product/category/banner media coverage is reviewed
7. product/list/sale/campaign pricing passes
8. minimum-order and quantity-step behavior passes
9. cart/quote + real email evidence passes
10. contact/photo/message evidence passes
11. membership and Digital Menu pass
12. cookie/KVKK and newsletter consent pass
13. 4 x 50 SEO modules and representative routes pass
14. Admin control plane and ZAMAN operations pass
15. rollback is confirmed
16. only then production copy/migrate/deploy occurs

## Production state at bundle finalization

- DENİZ production deployment: NOT PERFORMED
- ZAMAN production deployment: NOT PERFORMED
- Production D1 migrations: NOT PERFORMED
- Production bindings/secrets: NOT MODIFIED
