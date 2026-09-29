# Okyanus EDT Binding Matrix

Status: RELEASE REFERENCE
Date: 2026-09-29

Secret values and production IDs are deliberately not stored in GitHub.

## DENİZ Worker

Canonical source:
`okyonus-edt-worker/src/deniz-worker.js`

Expected runtime bindings / variables:

| Name | Type | Required for | Rule |
|---|---|---|---|
| `DB` | D1 | products, quote, contact, membership, Digital Menu, SEO state | keep existing production D1 binding |
| `PHOTO_TEMP` | R2 | photo inquiry upload | keep existing production bucket/binding |
| `EMAIL` | Email send binding | quote/contact/photo notifications | preserve existing binding |
| `MAIL_FROM` | var/secret | email sender | preserve existing value |
| `MAIL_TO` / `ADMIN_MAIL_TO` | var/secret | notification destination | preserve existing value |
| `QUOTE_WEBHOOK_URL` | secret/var | optional fallback | preserve if currently configured |
| contact/photo webhook vars | secret/var | optional fallback | preserve current names/values |
| member/session secrets | secret | membership/login | copy existing secret configuration, never source-control |

The preserved DENİZ functions `sendBoundEmail`, `quoteAPI`, `photoInquiryAPI` and `okyContactMessageAPI` are regression locked against the supplied baseline.

## ZAMAN / ADMIN Worker

Canonical source:
`okyonus-edt-worker/src/zaman-admin-worker.js`

Expected runtime bindings / variables:

| Name | Type | Required for | Rule |
|---|---|---|---|
| `DB` | D1 | admin, messages, product/quote management, module flags | same environment D1 as matching DENİZ |
| `MEDIA_STORE` | R2 | Studio/media | preserve existing binding if used |
| `PHOTO_TEMP` | R2 | controlled photo request workflow | preserve existing binding |
| `SESSION_PEPPER` | secret | admin sessions | required |
| `BOOTSTRAP_TOKEN` | secret | bootstrap only if intentionally used | never commit |
| Cloudflare Access settings | env/config | optional outer access gate | preserve existing production policy |

## Environment isolation

Staging must use staging D1/R2/secret values.
Production bindings are never copied into GitHub or exposed in test fixtures.


## Legacy compatibility aliases

The canonical deployment names above remain the preferred names. The preserved Workers also accept legacy aliases so an existing environment is not broken during controlled migration.

ZAMAN compatibility aliases currently present in source:
- `DB` may fall back to `Veritabanı` or `Veritabani`
- `PHOTO_TEMP` may fall back to `FOTOĞRAF_TEMP`
- `MEDIA_STORE` may fall back to `MEDYA_MAĞAZASI` or `MEDYA_DEPO`

Do not remove these aliases during the Commerce V2 release unless the production bindings have first been audited and intentionally migrated.
