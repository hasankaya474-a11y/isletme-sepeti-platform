# R47 first-paint layout audit

The 14:51:20 screenshot proves a large opening campaign overlay; its opening/closing behavior is owned by the branding agent. It does not independently prove a CSS flash.

Source evidence: three identical final product/mobile styles are emitted at body end after cart, favourite, catalogue and settings scripts. Until those styles are parsed, the head CSS uses older quantity and card rules, creating a potential first-paint layout change. Existing card renderers start public fetching before the final style block appears in the HTML.

`patch-startup-css-r47.py` moves the exact existing final CSS into a single helper appended to the shared head CSS return and removes the three body copies. It changes no declarations, popup logic, backend, fetches or event handlers. Phones retain three columns and one-row quantity controls; tablets retain four columns. Product image tap rules are available at first paint.

Validation: `tests/startup-css.py` checks exact preservation of all final declarations, removal of the three late blocks, and executes the actual shared CSS helper to prove critical rules exist in a head string without initialization or API responses. The temporary Worker passes `node --check`. No mobile viewport or physical-device emulation was performed. No final Worker files were edited.
