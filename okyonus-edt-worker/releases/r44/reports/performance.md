R44 performance audit, R43 baseline

Live single diagnostic sample: GET home HTTP200 100,299 bytes, 6.49s TTFB / 6.49s total. GET storefront-v2 HTTP200 3,700,921 bytes, 13.05s TTFB / 13.15s total. These are tool-network observations, not browser Lighthouse/Core Web Vitals.

Payload: 1,347 products; 106 contain embedded data image URLs. Product array dominates JSON size (3,733,122 characters when reserialized). Product descriptions/prices/authored images preserved; no destructive data compression applied.

Concrete duplicate work: catalog/cart/product fetch storefront-v2 and legacy products unconditionally, then runtime settings may fetch storefront-v2 again. Help/brand/campaign/delivery also fetch store separately from settings. Homepage already shares its fetch with settings.

Patch-performance-r44.py exports apply(source). Header installs one public per-document storefront Promise before page scripts. Seven public consumers reuse it. Three catalog/detail/cart code paths skip legacy API when managed catalog is authoritative; fallback preserved on non-authoritative data/failure. No cross-page cache; failed promises clear for retry; no member/auth response caching.

Hero first image eager/high priority; hidden slides lazy/low; decoding async. Product lazy loading already exists and remains unchanged.

Measured structural reduction: catalog/cart/detail/help/brand/campaign/delivery use one storefront request instead of two, preventing another roughly 3.7MB raw response per navigation with current payload. Three authoritative catalog flows also eliminate legacy products request. First image priority no longer competes equally with hidden slides.

Validation: patch applies to original R43 copy; node --check passes. Shared runtime mock: two concurrent consumers => one fetch and same parsed object. Parent should verify managed catalog plus non-authoritative fallback, network counts, settings, image carousel and mobile screenshots. Do not claim exact speed gain before browser measurement.

Cross-review correction: optional okyStorefrontRead(true) forces a new no-store network response. Flow agent owns mandatory force refresh before quote submission and clearing old Map rows. Mock validates dedupe followed by forced second fetch. This prevents public page deduplication from masking price/stock/product-removal changes before submission.
