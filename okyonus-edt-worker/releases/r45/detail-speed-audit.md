R45 detail performance

R44 product detail currently downloads the full 1347-product storefront; runtime settings share same request. Current sampled API 3,700,921 bytes. EDT-0127 projected target+five related+public settings is 4,983 bytes (99.87% less), six products. This is payload projection; unpublished R45 cannot have live timing measured yet.

Patch uses optional product= query view, cheap identifiers-only DB lookup for exact ID/source ID/existing name slug, bounded target+5 category siblings SQL, existing prices/campaign logic, public settings filter, no-store response. Full catalog and authenticated submission unchanged. Missing/inactive products remain not found. Header shared request uses compact view only on /urun/ paths.

Patch applies to R44 and node --check passes. Parent worker harness should check ID/name slug, missing/inactive, current price update and no server cache. Server metadata queries remain for schema compatibility; no DB mutation.
