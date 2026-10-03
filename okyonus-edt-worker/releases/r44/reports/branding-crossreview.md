Independent R44 cross review

Visual CSS is optional and does not change card dimensions, grids, quantities or R43 static floating-actions rule. Existing mobile announcement hiding also hides the server availability status; patch exposes a compact status-only strip. Screenshot cards already have white backgrounds and blue actions, so polish is limited to border/focus contrast.

Confirmed interaction defects communicated to owners:
- Performance document-level storefront singleton defeats cart pre-submit refresh. SEO performance patch now supports forceRefresh=true; flows must call it on refresh.
- Cart catalog Map survives subsequent loadCatalog calls, causing removed products to remain resolvable. Flows owns clearing it only after a successful authoritative response.
- currentItem retains old saved image/package values after managed fields are intentionally cleared. Flows owns current managed empty-field handling.
- Admin publication comparison omits valid_until in basePrice query while public storefront honors it; admin owns expiry parity.

Publication client regression test evaluates actual verifyPublication function. Successful verification is green; field mismatch and network failure are red with useful text; button becomes usable again in all cases. Passed against R41 ZAMAN.

Banner/category navigation inspection: R43 managedHero rebuilds slides and carousel controls, restores approved hero when managed banner list is empty, sanitizes CTA/image URL protocols and escapes output. Opening campaign derives revision key from enabled/image/title/description/action data, preserves explicit empty image, and routes embedded image through public asset endpoint. Managed banner filtering and authoritative product publication remain unchanged by optional branding patch.
