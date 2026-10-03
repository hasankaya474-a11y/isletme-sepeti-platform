# Admin banner integration

Live API audited: 1,347 products, 27 selected active products, all with images; no positive effectivePrice on those products. 200 SEO links in four groups of 50. Admin route requires login. No live data changed.

Defect: homepage intentionally ignores banners supplied by panel API.

Standalone patch `patch-admin.py`, importable `apply(source)`, activates authoritative API banners, filters inactive entries defensively, rebinds carousel, retains approved initial four slides when list is empty or managed image fails, rejects unsafe media/CTA URLs, removes the arbitrary ten-banner limit in rendering and the banner-specific API query. No SEO/mobile blocks changed. It has not been applied to release source.

Validation: node --check passed on patched temporary Worker; rendered homepage tested with Node VM for present/empty/inactive banners, 15-banner rendering, unsafe image rejection and carousel rebinding. SQLite query test confirmed 15 active banners retained and inactive/future/expired rows excluded. Live operations remain read-only.
