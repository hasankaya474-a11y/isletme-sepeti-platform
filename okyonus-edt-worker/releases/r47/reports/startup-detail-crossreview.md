R47 independent startup/detail audit

/: TTFB median 9.895s range 8.410–11.415s; version ['commerce-v2-2026-10-03-r45-commerce-flow']
/urun/EDT-0127: TTFB median 9.716s range 8.230–11.258s; version ['commerce-v2-2026-10-03-r45-commerce-flow']

Five sequential pairs via curl with two concurrent requests. Home 104998 bytes; product HTML 72476 bytes; all HTTP200. These are external tool network measurements, not end-user browser Lighthouse or Core Web Vitals.

R45 product HTML initial title is generic and content is JS loaded; exact title/H1 is assigned after compact API hydration. This is a pre-existing rendering/SEO limitation, not introduced by scope changes. All200 landing SEO SSR routes remain separate and unaffected; canonical metadata wrapper continues pathname normalization. API scope query addresses are robots disallowed. No extra crawl URLs exposed.

Crossreview home pipeline found two blockers: original header replacement omitted R45 compact product-query handling; new table inventory was outside catch. Both corrected by flow owner. Reviewed updated patch applies to R45, node--check passes, and actual SQLite detail suite passes target/source/Turkish slug, max6, missing/inactive authoritative empty, fresh base/sale/list price edits, campaign math parity, exact-ID/source-collision priority and public settings. Fullworker untouched.

Actual current live detail API HTTP200, 4945 bytes, 11.993s TTFB/tool network, detailView=true, six products, first source EDT-0127. Live version is commerce-v2-2026-10-03-r45-commerce-flow. Compact R45 functionality is deployed; R47 remains local.
