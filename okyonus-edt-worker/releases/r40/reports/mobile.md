# Mobile audit and r40 patch

Live homepage: eight categories directly below the hero; final CSS uses four category columns and three product columns on mobile, removes the sidebar through 1024px, and contains the four loaded 1000×333 hero images at 3:1. No layout redesign required.

Confirmed issues: seafood and new-product headings remained visible with empty card containers. Mobile quantity +/- buttons were only 30px wide, and add buttons were 36px tall. Detail URL collisions and absent H1 were handed to the flow and SEO agents.

`patch-mobile.py` is prepared but NOT applied to the release worker. It hides seafood/new sections until their existing renderer has cards, hides them again if empty, and uses the existing category/new-date filtering without adding unselected products. Quantity input sits above two 44px-minimum buttons; on screens through 360px these controls stack vertically so three product columns remain feasible. Add buttons get 44px minimum height.

Validation: applied in memory to a temporary worker and passed `node --check`. Extracted real renderer snippets passed Node scenarios for empty data, selected seafood/new data, and expired/empty subsequent data. Expected anchors each occur exactly once and the patch fails on unexpected source changes.

Limit: the browser control surface does not provide viewport resizing; mobile layout audit is based on the live final CSS cascade. Parent should visually check 320, 390, 768 and 1024px widths in its available runtime before delivery.
