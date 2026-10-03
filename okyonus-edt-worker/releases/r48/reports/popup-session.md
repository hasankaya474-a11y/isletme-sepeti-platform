R48 restores the user's automatic opening banner behavior.

Enabled homepage campaign opens after DOM readiness on the next animation frame. It does not wait for account, storefront API or image downloads. Session storage records the campaign key on successful opening and dismissal; repeated reloads in the same browser session are suppressed, while a changed campaign key allows the new content to open. Explicit normal-flow campaign access remains available after automatic display/dismissal. Escape, close button and backdrop record dismissal. No timer repeatedly reopens the overlay.

Blocked session storage falls back to a per-document window memory map, preventing duplicate runtime initialization from reopening the popup. With browser storage completely disabled, a full reload destroys JavaScript memory; suppression across full reload cannot be guaranteed without another storage mechanism.

Validated actual extracted runtime: DOM-ready plus RAF scheduling, initial opening, same-key session reload suppression, new campaign opening, Escape/backdrop dismissal, explicit reopen, disabled/nonhome control, blocked-storage memory. Temporary R47 patch passes syntax. Final Workers untouched.

R48 uses a new oky-campaign-seen:r48: namespace. Old R45 dismissal keys cannot suppress the newly restored banner. Session regression seeds an old dismissal and verifies initial R48 opening.
Full generated customerCommerceRuntime tested with member API pending, failing and anonymous: automatic RAF opening and manual open binding work independently of API completion. Source finds no campaign button/dialog cloning or replacement; markup is emitted before its runtime script. Browser DOM property introspection of onclick alone cannot prove a missing listener. Observed live R47 manual failure remains unclassified pending browser-specific event evidence.
