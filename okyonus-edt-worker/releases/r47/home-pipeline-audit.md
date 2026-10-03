# R47 homepage startup pipeline

R45 homepage fetched the entire catalog while its renderer keeps only selected featured products. This required full joins, price hydration, campaign processing, JSON transfer and parsing for unseen catalog rows. Each read also performed repeated serial sqlite_master probes for individual table names.

Standalone patch-home-pipeline-r47.py adds optional scope=home filtering in the SQL read itself. Only active selected rows hydrate, with no arbitrary card cap. Header uses this scope solely on /. Full catalog/cart endpoints and compact detail ?product query are preserved. No cross-request cache; response no-store and price/campaign rules unchanged.

Schema discovery now performs one table inventory read per request in the existing error-handled block. Independent product/meta/commerce PRAGMA reads and brand/price PRAGMA reads run concurrently. Ten independent configuration data reads also run concurrently and settle before response creation, so one failed optional module cannot leave still-running reads changing the response. No schema mutation or live write is added.

Actual SQLite D1 test: 324 full products vs 35 selected home products. JSON character count 215100 → 48825 (77.3% smaller) in this fixture. This is a measured payload reduction, not a promise of equal wall-time reduction. Updated price 100 → 175 appears on next scoped read; detail still returns selected product with at most six related rows. One sqlite_master inventory query, no individual table-name probes. All 35 selected products survive (no 12-card cap). Node worker syntax check and scenario test passed against temporary patched R45 only.

Residual cost: storefront configuration/SEO data still accompanies home response; product images depend on external origins and their latency. Other agents address image/visual startup. Current live speed was not measured by these local fixtures.

## HTML critical path proof

html-critical-path.mjs instruments actual worker DB calls: homepage HTML performs exactly one openingCampaign settings query; product and catalog HTML perform zero DB queries. The observed live product HTML latency cannot be attributed to full catalog SQL on this code path. Home popup settings can delay home HTML by one DB round-trip; remaining origin/proxy/runtime/network latency needs separate measurement.
