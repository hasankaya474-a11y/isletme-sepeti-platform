# Okyanus EDT Worker Build V1

Status: implementation candidate
Date: 2026-09-29

This directory contains the real Cloudflare Worker sources prepared from the supplied working Okyanus EDT code.

## Targets

- `src/deniz-worker.js` -> public DENİZ Worker
- `src/zaman-admin-worker.js` -> ZAMAN / Admin Worker
- `baseline/` -> exact supplied working sources, retained for regression comparison
- `migrations/001_sales_mode.sql` -> shared D1 module visibility defaults

## Locked public behavior

Active by default:
- Products
- Ürün Seç • Teklif Al
- Fotoğrafla Teklif
- WhatsApp sales contact
- SEO/index routes
- Membership
- Digital Menu

Hidden by default, never deleted:
- COST
- COST Radar
- Akademi
- ÇEŞNİ
- Kolay Reçete
- Hakkımızda public module

ZAMAN Admin contains **Satış Modu & Modül Kontrolü** and writes module visibility to shared D1.

## Critical preservation rule

The following supplied working DENİZ functions are regression-locked:
- `sendBoundEmail`
- `quoteAPI`
- `photoInquiryAPI`
- `okyContactMessageAPI`

The following ZAMAN functions are regression-locked:
- `messageCenterRoute`
- `photoMessageRouteV2`

Root CI compares the final source against the supplied baselines byte-for-byte for these functions.

## Digital Menu

Digital Menu stays active and now has:
- 30 theme presets
- 30 layout template presets
- persisted `themePreset` and `template`
- preset API
- Studio selectors
- published-menu layout classes and accent presets

Existing member/business scoping and publish/update/delete authorization remain in place.

## Deployment discipline

Do not replace production bindings while copying code.

DENİZ must keep the existing binding names used by the current working code, including its D1, admin DB where configured, photo/media storage and Email binding.

ZAMAN must keep its existing D1, media/photo bindings, session secrets and access configuration.

Apply the D1 migration first in staging. Run all regression tests, then copy the candidate sources to the corresponding Workers. Production routing is changed only after closed verification and rollback is ready.
