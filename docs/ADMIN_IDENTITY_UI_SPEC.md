# Admin Identity UI Spec

Desktop: left navigation, filterable membership table, user detail drawer, session/device panel, security-event panel, role/scope editor. High-risk changes show impact summary and approval state.

Tablet: adaptive table/card hybrid and drawer navigation.

Mobile: card lists, bottom/drawer navigation, sticky primary action. No critical control may disappear on mobile.

Required states: loading, empty, validation error, forbidden, network error, success confirmation, pending approval.

Every interactive control requires visible label or accessible name, keyboard operation, visible focus, associated validation errors and status announcements. Normal membership/session/role operations are codeless Admin actions and audited.
