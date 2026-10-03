# ZAMAN → DENIZ local SQLite scenario audit

Inputs: DENIZ r43 and ZAMAN r41. Live data untouched.

Real Node SQLite-backed D1 adapter executes actual commerceAdminApi CRUD queries and actual DENIZ `/api/storefront-v2`, sharing the same test database. Controlled owner context is injected only into the local exported function; no credentials or live sign-in used.

Passed: create product with image, description, base/list/sale prices and homepage selection; edit values; explicitly clear image/description/prices; preserve omitted fields; select/unselect; deactivate/reactivate; invalid price/image writes rejected without changes; viewer role denied; atomic batch failure rolls back image/description/price; price history contains changes. Cleared image remains empty without hidden fallback. Sale price 100 overrides base 125, clearing sale then base 175 gives 175.

Detected and reproduced: publication-check hardcodes old r36 build. Correct matching data on r43 returns false with zero mismatched IDs. `patch-admin-r44.py` removes that obsolete exact-version requirement while keeping authoritative API checks, errors, selected counts and complete per-product compared values. Patched matching data passes; controlled stale description fails and identifies product ID.

Run after applying patch: `EXPECT_PATCHED=1 node releases/r44/tests/admin-products-sqlite.mjs releases/r44/deniz.mjs releases/r44/zaman.mjs` from worker folder.

Limits: this proves shared-database logic and transactional behavior under SQLite. It does not prove deployed binding identities, GitHub upload token permissions, real sign-in cookies, or network image availability. Product schema/metadata save logic has no newly found defect in these scenarios. The patch has NOT been applied to any release source or live site by this audit agent.

## Upload storage audit

`patch-media-r44.py` exports `apply_deniz(source)` and `apply_zaman(source)`. Existing studio code assumes KV-style getWithMetadata/metadata; configured R2-style stores use get/body/httpMetadata/customMetadata. Adapter supports both. DENIZ gets a direct public GET/HEAD route for fixed UUID.png/jpg/webp IDs in `studio/` only, with no admin-host proxy. Assets written through an admin-origin route continue to work there; same-origin saved URLs now work when the public worker shares MEDIA_STORE. Missing binding returns 503 explicitly.

`tests/media-full-sqlite.mjs` uploads a genuine one-pixel PNG through actual studioMediaRoute; SQL media/audit records are stored; byte-for-byte public/admin GET and empty HEAD are verified; returned URL is saved onto a selected product and active banner and appears in actual storefront API. Both KV and R2 scenarios pass. Malformed/traversal IDs and POST produce no storage reads. Existing upload UI handler tests pass, including GitHub missing-token fallback and re-enabling controls after failures.

Publication and panel price queries now both ignore future/expired active price rows. SQLite newer-expired999 versus older-valid95 proves panel, public and publication values all remain95.

Limits: no actual GitHub network upload, no live bucket/D1 writes or origin binding assumptions. Sriracha screenshot asset identity is not replaced or fabricated by this audit.
