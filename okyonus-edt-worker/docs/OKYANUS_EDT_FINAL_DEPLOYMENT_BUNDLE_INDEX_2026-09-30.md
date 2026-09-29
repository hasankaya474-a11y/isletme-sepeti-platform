# Okyanus EDT Final Deployment Bundle Index

Status: CODE COMPLETE / PRE-PRODUCTION
Date: 2026-09-30
Source main commit: `34df01b836b17e0184f576f6439fb18ccc2f956c`

## Main quality status

- quality: PASS
- Okyonus Worker Quality: PASS

## Canonical bundle files

### DENİZ public Worker
Path:
`okyonus-edt-worker/src/deniz-worker.js`

Git blob SHA:
`2cb276c926f6e924131e9e4aff36671d25f9fa34`

### ZAMAN / ADMIN Worker
Path:
`okyonus-edt-worker/src/zaman-admin-worker.js`

Git blob SHA:
`ed3ebdf1b8172fa2660b714fe9e4346d73e6b26e`

### Commerce V2 public module
Path:
`okyonus-edt-worker/src/commerce-v2.js`

Git blob SHA:
`fbb1a6d6b509461e3c2d9a7cdd9bf7351a6da34e`

### Commerce V2 admin module
Path:
`okyonus-edt-worker/src/commerce-admin-v2.js`

Git blob SHA:
`840299e20a056fa512146bf3c3b38d11c4d657c6`

## Required migration order

1. `okyonus-edt-worker/migrations/001_sales_mode.sql`
   Blob: `6c8fc6a4461470381a3e9d491bfc119248d209be`
2. `okyonus-edt-worker/migrations/003_commerce_v2.sql`
   Blob: `aa527935ddf52c6ca08a741c167505a87b4b9316`
3. `okyonus-edt-worker/migrations/004_commerce_extended.sql`
4. `okyonus-edt-worker/migrations/005_product_meta.sql`
   Blob: `c2e02f7076e4ef77d0c3dbc33795f6b88e053945`

Do not insert migration 002 into the required production sequence.

## Release control files

- `okyonus-edt-worker/docs/WORKER_COPY_RUNBOOK.md`
  Blob: `364158bfd3e7596ece2e4349e6f2f629260f49b7`

- `okyonus-edt-worker/DEPLOYMENT_CHECKLIST.md`
  Blob: `b201fae3dddbd491926f9985ca12b9e6b41243de`

- `okyonus-edt-worker/docs/OKYANUS_EDT_COMMERCE_V2_FINAL_RELEASE_MANIFEST_2026-09-30.md`
  Blob: `5f615fb25955bffeb589c5806268b406df14aeee`

## Binding rule

Do not replace or invent production binding names or secret values.

DENİZ must preserve the existing production bindings for:
- DB
- PHOTO_TEMP
- EMAIL
- MAIL_FROM
- MAIL_TO / ADMIN_MAIL_TO
- existing quote/contact/photo webhook variables
- existing membership/session secrets

ZAMAN must preserve the existing production bindings for:
- DB
- MEDIA_STORE where used
- PHOTO_TEMP
- SESSION_PEPPER
- BOOTSTRAP_TOKEN only where intentionally configured
- existing Cloudflare Access configuration

## Deployment gate

This index is not proof of live production PASS.

Production remains blocked until:
1. current Workers are exported
2. D1 backup exists
3. staging uses isolated bindings
4. migrations 001, 003, 004, 005 pass in staging
5. quote, email, contact and photo evidence passes
6. member login and Digital Menu pass
7. rollback source/version is confirmed
8. only then production copy/deploy occurs

## Production state at index creation

- DENİZ production deployment: NOT PERFORMED
- ZAMAN production deployment: NOT PERFORMED
- Production D1 migrations: NOT PERFORMED
- Production bindings/secrets: NOT MODIFIED
