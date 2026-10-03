# R49 independent contact dock review

Confirmed cause from R48: `body .float { position:static!important; right:auto!important; bottom:auto!important }` has higher specificity than the later `.float { position:fixed!important }`. Both contact links were still emitted after the footer, but were in normal document flow. The supplied screenshot is near the first product row, so their absence there follows directly from that CSS.

Reviewed composed R49, without editing its Worker. Dedicated `#okyContactDock.float` declarations beat every older class/body rule, even though the new rules appear earlier in the critical stylesheet. The dock remains fixed, 48px wide, at right 10px and bottom 14px plus safe-area on mobile/tablet. Desktop keeps right 18px/bottom 24px. WhatsApp retains its native phone link, SVG and green background; help is a labelled Y link to `/yardim`.

`tests/contact-dock-cascade.py` reconstructs the stylesheet order emitted by shared head CSS and the later mobile block, resolves media conditions, importance, selector specificity and source order, and passes at 320, 390, 768, 1024 and 1280px. Both 48px circles fit horizontally; cookies remain at z-index 130 above dock 125, and modal dialogs remain in the browser top layer. This is source/cascade verification, not mobile viewport emulation or a claim that a physical device was tested.
