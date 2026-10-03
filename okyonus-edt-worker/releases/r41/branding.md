Branding audit and patch

Existing pinned favicon PNG32, ICO and Apple180 assets returned HTTP200; manifest returned HTTP200 with Okyanus identity. Retained without replacement.

Patch replaces customer-facing implementation wording, routes /hakkimizda and /about through current commerce shell with active features, and adds server-verified online indicator using /api/health. Green support-presence claims and reliability certification are not introduced. It shows only successful server check time and explicitly explains that sales team presence is not implied. Offline/failure states remain honest. Checks repeat every 60 seconds while visible and on return to page.

Company identity/address cannot be invented. Live contact contains only Istanbul, two named contacts, phone numbers and email. HTTPS alone does not prove business reliability.

Validation: patch applied to temporary source copy; node syntax and generated embedded-script syntax checked. SEO module copy is untouched.

Hydration regression correction: API announcement hydration previously assigned textContent to the parent, removing the nested online indicator. Initial announcement now has its own siteAnnouncementText span; settings updates target only this child. test-branding-hydration.mjs evaluates the actual emitted runtime script with descendant-removal DOM semantics and verifies text update plus status identity preservation. Existing faulty source fails; temporary corrected source passes and node syntax passes.
