# R48 missing-price quote action

R47 price fallback was plain strong text and had no click action. Three active client renderers (homepage, catalog, product detail) now render a semantic type=button .quotePriceButton[data-quote-price] when no positive numeric price exists. Positive prices remain text. No price is invented.

Common header handler uses separate data-quote-price, never data-add. It awaits existing bounded account readiness before adding, preserving cart ownership reconciliation. Prior session error retries the existing reader; persistent failure shows “Tekrar dene” and preserves page/cart. The handler invokes the existing add button with current quantity, retaining canonical cart item values, stock guards and limits. It watches the synchronous successful cart-change event and navigates to /sepet only after that event. No quote is submitted; final membership/quote validation stays in the existing cart flow.

Tests obtain actual patched-worker HTML for homepage/catalog/detail and parse all browser scripts; execute actual card renderers to verify null price creates button and price150 does not. Execute actual header action to prove account readiness blocks add until resolved, exactly one add, success opens cart, and OUT/session/storage failure cannot navigate. Node syntax and scenario tests passed temporary source only. Security agent independently tests actual add handlers and final anonymous API rejection. Mobile CSS owns wrapping and 44px target.

## Composed-worker cross checks

Actual composed R48 homepage and product-detail scripts are exercised end to end in tests/quote-home-detail.mjs. DOM fixture implements real product and detail class relationships; detail renderer emits class="detail". Actual add handlers retain quantity3.5 and price:null, fire one cart change, and common action opens /sepet. Both routes passed. Independent security actual catalog test also proves quantity3.5 exactly one addition and OUT/account timeout/storage quota refusal without navigation; anonymous final APIs remain401. No live backend mutation.
