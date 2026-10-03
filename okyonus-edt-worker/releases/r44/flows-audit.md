# R44 storefront flow audit

Audited latest R43 DENIZ and ZAMAN. Patch is isolated, importable apply(source); fullWorker and live data untouched.

## Confirmed repaired defects

1. Administration writes stock status OUT, but all three product add handlers accepted OUT because their regex only recognized prose “out of stock”. OUT is now blocked on homepage, catalog and detail add handlers.
2. An existing cart containing an item later changed to OUT could still submit. Reconciliation now blocks submit and explains which action is required. Submit refreshes the catalog before preparing its payload, preserving the cart on failure.
3. Clearing a product price in administration left the old price in the cart because currentItem fell back to x.price. A verified product with no current price now shows offer-price fallback rather than an obsolete number.

## Meaningful scenarios

flows-scenarios.cjs extracts the actual generated cart script and checks syntax. It exercises currentItem with an old 200 price and a current null price, asserts null replaces 200; verifies OUT blocks, ORDER and LIMITED remain allowed; verifies all three product add paths use OUT guarding; verifies refresh before quote submission and disabled submit on unavailable items.

Test command: node flows-scenarios.cjs /tmp/flows-r44.mjs. Passed alongside node --check. Patch applied only to temporary copy.

## Admin propagation

R43 homepage uses authoritative featured flags and active status. Managed banners are now invoked through managedHero(j.banners). Product detail stable-ID resolution retained. No membership, draft preservation or idempotency logic removed. Server-side /api/quote must independently enforce stock status; frontend checks alone cannot enforce it.

## Cross-review follow-up

Cleared catalog Map on verified fresh reads, so deleted products cannot survive in the original map. Cleared saved image/package data when administrators intentionally clear current values. loadCatalog(force=false) and submit loadCatalog(true) support the performance patch forceRefresh reader; apply performance before flows.

Backend B2B creation rejects canonical OUT/inactive products. Historical quote repetition rejects empty lists, missing/inactive/OUT current products and invalid quantities before any batch write, and uses current canonical names and units. /api/quote enforcement is owned by the security patch. flows-backend-scenarios.cjs executes actual repeat route with removed/inactive/OUT products and proves zero batch writes; all scenarios passed.
