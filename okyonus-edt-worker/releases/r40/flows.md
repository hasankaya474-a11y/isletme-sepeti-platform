# R40 catalog and offer flow audit

Read-only live HTTP probes completed 2026-10-03. Catalog, cart, login, registration and photo offer pages returned HTTP 200. Storefront and products APIs returned 200; anonymous member API correctly returned 401. No forms, messages, registrations or quote requests submitted.

## Confirmed defect repaired in patch-flows.py

The live storefront has 1347 products and 93 repeated name groups covering 260 products. Card URLs used only the product name slug, so variants with the same name opened the first matching product, potentially changing package, brand and cart identity. Home, catalog and related-product links now carry the stable product ID in the existing /urun/ route. Detail retrieval matches exact IDs first, with old name-slug links retained as a compatibility fallback. Newsletter already used stable IDs.

Product detail attribute escaping now encodes quotation marks; malformed localStorage cart values recover to an empty array instead of failing on cart.find.

## Preserved existing protections

Guest users can browse and prepare carts. Quote submission checks membership, preserves draft data through login, uses an idempotency key and requires a server reference before clearing the cart. Photo submission checks membership and preserves the chosen photo in the original tab while login opens separately. These behaviors were source-audited; server writes were deliberately not exercised.

## Data completeness requiring admin action

Storefront snapshot: 1347 products; 621 have images; 26 have prices. All 27 selected homepage products have images but none has a price. The visible offer-price fallback is therefore expected, rather than a hidden price rendering defect. Prices must be supplied through the administration panel; no commercial prices invented.

## Validation

The standalone patch was applied only to /tmp/flows-r40-test.mjs, not the shared R40 worker. Node syntax check passed. flows-test.mjs passed generated product detail script parsing, stable variant identity, encoded attribute values and malformed local cart recovery. Run after parent integration: node flows-test.mjs deniz.mjs.
