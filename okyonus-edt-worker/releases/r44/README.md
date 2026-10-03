# Okyanus DENIZ / ZAMAN R44

Full separate Cloudflare Workers. Deploy DENIZ_R44_TAM_KOD.txt to DENIZ and ZAMAN_R44_TAM_KOD.txt to ZAMAN. These are complete files, not patches. No production deployment or writes performed during this audit.

Changes: phone3/tablet4 compact aligned product cards; single row quantity; full product names accessible on detail; visible truthful mobile server status; shared per-page storefront reads and fresh pre-submit prices/stock; unavailable product guards; publication comparison/current price expiry parity; KV/R2 studio media adapters and image signature checks; preservation of administrator security policies. Exact historical wrong TOCCO 2200g image is corrected using manufacturer packaging while respecting later custom admin image choices.

Verification: actual SQLite product create/edit/image/description/price/featured/active scenarios, rollback and price history; PNG upload/read/product/banner KV and R2 scenarios; publication UI success/mismatch/error; cart force refresh and removed product; stock/role/CSRF/origin/media tests; mobile CSS cascade at320,390,599,600,768,1024; SEO200 GET/HEAD titles/canonical. See reports and tests.

Limits: CSS cascade is verified, not physical-device rendered QA. Authenticated production administrator writes were not performed. Production D1/MEDIA_STORE bindings and permissions must match the deployment. No universal zero-error or speed guarantee: storefront payload still approximately3.7MB and server/network latency varies. Repeated catalog transfers removed; no cross-page stale cache added.

Rebuild: python okyonus-edt-worker/releases/r44/build.py
