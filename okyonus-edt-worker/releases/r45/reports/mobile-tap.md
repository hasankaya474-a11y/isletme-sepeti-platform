# R45 product image tap review

The 14:22:21 screenshot shows the normal compact three-column product grid. It does not show a Google image-search menu, so it cannot establish whether the reported action was a tap, a long press, or a browser setting. The current image is nested inside a native `/urun/PRODUCT_ID` anchor. A browser may offer image search when an image itself is long-pressed; normal link long-press remains an expected browser capability.

`patch-mobile-tap-r45.py` preserves native href navigation and directs hit testing from image/fallback children to their parent product anchor. It sets `draggable=false`, prevents image dragging/selection through scoped CSS, and uses `touch-action:manipulation` on the anchor. It adds no click redirect, global context-menu blocker or long-press suppression. The existing favourite button remains a separate 44px overlay in the upper-right corner; tapping that deliberate region continues to toggle the favourite rather than opening detail.

Validation: temporary patched R44 passes `node --check`; all three final public style blocks contain the child hit-target rule. An extracted real `htmlCard` renderer test verifies ID detail href, non-draggable image, fallback detail link and separate favourite markup. Browser mobile emulation and physical long-press testing were not performed. Main Worker files were not edited.
