# R47 startup cross-review

Read R45 DENIZ and R46 ZAMAN; no final Worker edits or live mutations.

Independently applied the flows compact-home patch to a temporary R45 copy and exercised it against real SQLite with selected, unselected and inactive products. Tests pass: home scope includes only selected active rows; prices change from 20 to 25 on the next request after a DB update; ordinary and cookie-bearing responses remain no-store; full catalog scope still returns both active products; private account API remains 401 anonymously. Schema lookups remain request-local, so the proposal adds no shared price/session cache. Existing campaign/price calculation is untouched. Standard storefront prices were already public; customer-specific B2B pricing is separate.

Confirmed baseline startup recovery gap: the shared storefront fetch has no Abort deadline and stores its pending promise globally for the page. An unresolved fetch pins all settings/home consumers until manual force refresh or navigation. Cart also awaits the member startup promise. This is an actual unbounded dependency in source; no external service stall is asserted as observed. Root/startup agent owns recovery.

Additional existing conflict, report only: newsletter route removes X-Frame-Options and allows the administrator origin in CSP frame-ancestors, but the security response wrapper reapplies DENY, preventing that embedded preview. No protections were weakened as part of the startup review.

Public storefront settings currently spread all configured DB setting keys; this is existing behavior, not a compact-scope regression. No secret setting values were observed or claimed. Do not introduce credentials or private customer settings into that public table without an explicit output allowlist.

Verification: `tests/home-scope-security.mjs` on the temporary composed Worker passed. This is local SQL/API correctness verification, not live end-to-end timing or administrator authorization verification.
