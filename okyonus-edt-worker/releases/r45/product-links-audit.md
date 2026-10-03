# R45 product image link audit

No main worker edited and no live writes. Standalone apply(source) patch only.

Potential legacy defect: unused server-rendered card template image was a div and had no native navigation; no active route calls it, so this is not proved as the live no-open cause. Client home and catalog cards had an image anchor but titles were plain text. Stable links favored source_product_id, so two managed variants sharing a source ID could resolve to the first row.

Patch: server image now native internal anchor. All image and title links use canonical managed row ID with source-ID fallback. Detail lookup prioritizes row ID, then source ID, then legacy name slug. Existing external image URLs remain img src; they are never used as navigation href. Mobile native image gesture handling is separate.

Actual route scenario test obtains home/catalog/detail HTML from the patched worker, parses browser scripts, executes actual card functions and detail script with actual SQLite D1 data for two same-name variants sharing one source ID. Both card image/title href point to /urun/ROW-2; detail resolves the correct Large variant. Test passed and worker node --check passed. No invented source-external Google href was found.
