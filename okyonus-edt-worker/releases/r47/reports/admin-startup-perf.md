# R47 admin startup and edit latency

R46 already avoids full catalogue refresh after existing product saves. Two remaining blockers are demonstrated by real rendered admin code:

1. Every fresh product/bulk visit posts all catalogue hydration batches before showing existing products. Complete 1,348-source catalogue still repeats 9 sequential write requests plus a blocking summary request.
2. bindProductForm waits for brand suggestions before attaching its submit handler. A slow brands request makes a visible editor temporarily unable to save; table rendering also waits behind this optional request.

Standalone patch adds GET catalogue-status: SELECT only product ID/source ID; compares exact required seed coverage. Existing custom rows cannot hide missing seeded products; inactive rows count as intentionally existing. No data write occurs in status. Complete catalogue skips redundant hydration. Missing catalogue and forced manual legacy sync retain the original batch importer. Brand suggestions load asynchronously with cache and form identity guard; failed suggestions do not block save, and superseded forms are not populated.

Actual SQLite scenario verifies incomplete→9 real hydration batches→complete, then removes one seed row and adds a custom row; missing 1 is still detected. Generated real admin script VM confirms complete-product setup request count 10→1 and simulated 5 ms latency52.0ms→5.3ms. Delayed brand promise test proves submit handler attaches while request stays unresolved. Rendered browser script parses. Existing upload success/fallback/invalid URL/timeout/control reset regression passes.

Limits: this does not measure live network latency, API bindings or Cloudflare isolate behavior. Initial product JSON and image requests remain deployment-dependent. This patch does not touch string/File optimization guards, image upload validation, price fields, publication normalization or access checks. No live data writes performed.
