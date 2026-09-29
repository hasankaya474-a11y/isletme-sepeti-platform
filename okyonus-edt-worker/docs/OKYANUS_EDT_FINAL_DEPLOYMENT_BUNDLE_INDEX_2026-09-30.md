# Okyanus EDT Final Deployment Bundle Index

Status: CODE COMPLETE / PRE-PRODUCTION
Date: 2026-09-30
Canonical code source commit: `23c27fb7a07a9327184171631867c9ee296625ba`

## Quality status

- quality: PASS
- Okyonus Worker Quality: PASS

## Canonical bundle files

| Purpose | Path | Git blob SHA |
|---|---|---|
| DENİZ public Worker | `okyonus-edt-worker/src/deniz-worker.js` | `2cb276c926f6e924131e9e4aff36671d25f9fa34` |
| ZAMAN / ADMIN Worker | `okyonus-edt-worker/src/zaman-admin-worker.js` | `ed3ebdf1b8172fa2660b714fe9e4346d73e6b26e` |
| Commerce public | `okyonus-edt-worker/src/commerce-v2.js` | `2a06751a21252552e63986450d28066c94bdead2` |
| Commerce admin | `okyonus-edt-worker/src/commerce-admin-v2.js` | `1c30be2a38e80b74bf57fa9af6ef7871ef0dfbd4` |
| Migration 001 | `okyonus-edt-worker/migrations/001_sales_mode.sql` | `6c8fc6a4461470381a3e9d491bfc119248d209be` |
| Migration 003 | `okyonus-edt-worker/migrations/003_commerce_v2.sql` | `aa527935ddf52c6ca08a741c167505a87b4b9316` |
| Migration 004 | `okyonus-edt-worker/migrations/004_commerce_extended.sql` | `c2e02f7076e4ef77d0c3dbc33795f6b88e053945` |
| Migration 005 | `okyonus-edt-worker/migrations/005_product_meta.sql` | `38e574a7ae0d16c4766f546afc38887c8e00f903` |
| Release dry-run | `okyonus-edt-worker/scripts/release-dry-run.mjs` | `0a99760c6865049aba9dd149059676475f40bb25` |
| Staging preflight | `okyonus-edt-worker/scripts/staging-preflight.mjs` | `963aa080b10cf6535abfbdce09f6466a2e9a6f99` |
| Staging config check | `okyonus-edt-worker/scripts/staging-config-check.mjs` | `68fad606d8e84d2fb93223967c0588ba6761bd7f` |
| Binding consistency check | `okyonus-edt-worker/scripts/binding-consistency-check.mjs` | `44d5130eb329ba0f47e08b06e6b88f641232f52e` |
| DENİZ staging template | `okyonus-edt-worker/wrangler.deniz.staging.example.toml` | `518ec5d8fa0fc5175ad47efceebcd2d76d42435e` |
| ZAMAN staging template | `okyonus-edt-worker/wrangler.zaman.staging.example.toml` | `b71f3501fd526184cf37743732d4695531c2a8c5` |

## Required migration order

`001 → 003 → 004 → 005`

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
1. current Workers are exported
2. production D1 backup exists
3. staging uses isolated bindings
4. migrations 001, 003, 004, 005 pass in staging
5. DENİZ and ZAMAN staging smoke tests pass
6. quote, email, contact and photo evidence passes
7. member login and Digital Menu pass
8. rollback source/version is confirmed
9. only then production copy/deploy occurs

## Production state at bundle finalization

- DENİZ production deployment: NOT PERFORMED
- ZAMAN production deployment: NOT PERFORMED
- Production D1 migrations: NOT PERFORMED
- Production bindings/secrets: NOT MODIFIED
