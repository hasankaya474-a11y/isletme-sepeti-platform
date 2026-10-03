R48 independent live baseline / popup crossreview

Read-only live www.okyonusedt.com currently returns commerce-v2-2026-10-03-r47-startup-performance. Homepage dialog enabled=true, campaign key opening-v26-b743a80. Current runtime does not auto-open on startup. Home compact payload has eight selected products, five without positive price. Current price display is plain text/strong; no actionable price-quote control. No production quote submission performed.

Popup patch applied independently to scratch copy of R47: node --check passes. Existing popup-session test passes DOM-ready requestAnimationFrame startup, first session/new campaign key opens, reload suppressed, Escape/backdrop/manual reopen, disabled/nonhome checks and blocked-storage same-document memory. Popup controls remain keyboard dialog/close based.

SEO routes/canonical unaffected by popup timing. Fullworker files unchanged by this reviewer. Quote action review pending flow patch.

Quote action completed independent review: patch applies scratch R47, node --check passes. Separate data-quote-price event reuses original card/detail add controls and quantities, does not post quote API, redirects to cart only after actual cart-change event. Independent VM tests pass card/detail action, overlapping double click single add, no stock/cart-change no redirect, account-read failure safe retry, event watcher cleanup. tests/independent-quote-action.cjs runs against combined source. Auth/submission policy retained in existing cart flow. Mobile visual integration remains mobile owner's check.
