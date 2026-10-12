# EDT İstanbul catalog replacement R50

789 EDT products and current44 seafood preserved. Old nonseafood catalog payloads and legacy automatic hydration retired. Database replacement executes once in an atomic D1.batch on first catalog request after deploying DENIZ. A failed SQL CHECK rolls back all catalog deletes and imports. Admin edits are preserved on subsequent requests. Imported products start active and unfeatured. Source prices are KDV included; old20% boost is retired.

Mobile2/tablet3/desktop4 cards,59 leaf categories, source descriptions/image URLs. Two source descriptions disagree with product name (cut/weight); they are preserved as source metadata. Images remain original remote images, not duplicated generated imagery.

Validated offline:13 SQLite/D1 migration scenarios, API pagination833,789 exact source images/names/prices,44 seafood endpoint,13 selected seafood homepage, main/leaf categories, details beyond200, old detail404,18 inline scripts parse. Real-device/browser layout and Cloudflare deployment not verified.

Deployment order: DENIZ first; successful first catalog request creates generation marker. ZAMAN admin refuses catalog management until marker exists. Existing Cloudflare bindings must remain. No Cloudflare write connector or signed-in deployment session is available in this task. GitHub branch upload alone does not deploy.
