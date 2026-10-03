# R48 quote-price button usability

Coordinated with the flow agent: new semantic button uses `.quotePriceButton` and `data-quote-price`; the flow handler owns adding the selected quantity and opening the existing quote/cart page. This patch changes CSS only.

Missing-price action receives full available width, a 44px minimum height, wrapping text, keyboard focus outline and normal touch activation. The price container grows to fit the action instead of clipping it inside the old 32px minimum. Existing priced/discounted products retain their current auto-height pricing. Three phone/four tablet columns and one-row quantity controls remain unchanged.

`tests/quote-price-css.py` verifies the actual inserted declarations, exact source preservation outside the added CSS, and conservative card/price width budgets at 320, 390, 599, 600, 768 and 1024px. All button widths exceed 44px; the 23-character missing-price text fits the 44px target budget with wrapping. Temporary Worker passes `node --check`. These are CSS/source calculations, not browser mobile emulation. Banner close/auto-close is owned by branding and was not changed here.
