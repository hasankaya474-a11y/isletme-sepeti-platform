# Admin edit speed

Before: edit fetched brands again; save fetched entire product catalogue, fetched brands again while rebuilding the list, then fetched summary. Editing and saving after initial setup required five requests and one complete catalogue rebuild, with filter/page reset.

After: cache brands per page; successful product POST returns its authoritative saved row. Merge only that row into existing catalogue and return to a cached list with remembered search/category/page. Existing-product save skips summary; new-product summary runs in background. Fallback full reload remains only for an older response lacking row data. Back/cancel returns to cache. SQL query honors price validity and returns all edit fields.

Tests: generated real admin script parses. VM edit/save baseline five requests versus optimized one, full network catalogue refresh/rebuild one versus zero. With controlled five-ms request delay: 26.1ms versus5.4ms (simulation, not a claim of real network speed). Pending image upload prevents save. Actual SQLite create/edit/null removals/featured/active/invalid/viewer/batch rollback/price-history/publication/expiry/Tocco normalization regression passes.

Upload now has one60s operation timeout and validates returned HTTPS URL; fallback still restricted to explicitly unconfigured GitHub storage. Real generated handler VM verifies success/fallback/invalid URL/timeout, unchanged URL on failures, restored controls and cleared timers.

Limits: initial catalogue still downloads all product data; local cached table renders current50 rows. Initial SQL/network/image latency and GitHub/server response depend on deployment. No live data writes.
