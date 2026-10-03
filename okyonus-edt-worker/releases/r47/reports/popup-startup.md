R47 popup startup audit

Confirmed: customer runtime synchronously called campaignPopup.showModal on enabled homepage startup whenever per-session dismiss key was absent. A fresh session/device or changing campaign revision re-opened it. No reopen timer or runtime DOM-replacement loop found; interruption was the explicit startup call.

Scoped patch removes automatic popup opening. Admin-enabled homepage campaign remains available using an explicit Kampanyayı Gör button. Disabled or nonhome campaign control is hidden. Close/backdrop close retain native dialog semantics; repeated button action while open does not invoke showModal again; explicit reopen after closing works. Campaign image/title/description/action settings remain intact. Closed campaign image gets lazy loading and async decoding.

R45 OPENING_CAMPAIGN_IMAGE is a pinned remote GitHub image URL, not embedded base64; the source contains zero data:image/ strings. Admin embedded opening images already use openingImagePublicUrl to serve them through /assets/oky-opening-image, avoiding full embedded HTML payload.

Validation: temporary R45 patch node syntax PASS; actual extracted popup runtime tested enabled-home, disabled-home and enabled-nonhome, verifying zero automatic opens, explicit open, duplicate prevention, close and explicit reopen. No final Worker/live data edits.

Cross-review correction: explicit access button uses independent campaignAccess class and position:static in footer-adjacent normal flow. It does not inherit floating/fixed cookie-settings placement; hidden attribute remains effective.
