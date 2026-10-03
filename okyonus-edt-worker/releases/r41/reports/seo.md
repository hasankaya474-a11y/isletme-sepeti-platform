SEO audit 3 October 2026

Live source baseline: all 200 unique SEO routes returned HTTP 200, all have canonical markup, all 200 are present in the 221-entry sitemap. robots.txt permits public pages and disallows API. Full route evidence is in live-seo-200.json. Existing homepage has server-rendered four modules; correction to initial observation that they were JS-only.

Confirmed issues: homepage commerce early return omits canonical, robots, OG and schema metadata. Image-only homepage hero has no rendered H1. Homepage module labels are reconstructed from ASCII URL strings, losing Turkish characters, despite correct registry labels. API hydration can replace the four complete modules with incomplete/duplicate/unsupported records.

Patch: authoritative route registry, Turkish labels, four modules of exactly 50 unique routes rendered server-side, preserve modules across API failures, accessible home H1. Adds canonical, robots, Open Graph and homepage WebSite schema to commerce HTML response. Account/cart/admin pages get noindex,nofollow. Makes no unsupported verified-business/trust/ranking claims.

Validation: patch tested against original R40 copy, node --check passes. Parent should exercise worker GET home (four details/200 unique hrefs/canonical/H1/JSON-LD), API failure preserves modules, member/cart noindex, product/category pages and sitemap unchanged. Independent live route audit does not imply unpublished R40 deployment.
