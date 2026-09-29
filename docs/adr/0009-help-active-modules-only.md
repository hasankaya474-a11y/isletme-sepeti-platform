# ADR 0009: Help Guides Follow Active Module Visibility

Status: Accepted
Date: 2026-09-29

## Context
The platform can keep modules in inactive, hidden or future-release states. Showing help content for those modules would confuse users and expose features that are not currently available.

## Decision
- End users see only Help & Site Guide content for modules/features that are active and visible on their authorized surface.
- Guides for inactive, hidden, unpublished or feature-flagged-off modules remain stored in Admin but are not visible, searchable or recommended to end users.
- Help visibility inherits the same role, scope and feature-flag rules as the feature being documented.
- Admin may preview and edit inactive guides without publishing them.
- Reactivating a module may reactivate its guide only after validation.
- Deactivating a module never deletes its guide content, version history or audit trail.

## Impact
### UX
Users see guidance only for functions they can actually use.

### Admin
Help content remains recoverable and can be prepared in advance for future activations.

### Security and authorization
Help cannot reveal privileged or disabled capabilities to unauthorized users.

### Regression
Tests must verify that inactive modules do not surface in public or authenticated help search, recommendations or navigation, while Admin preview remains available.
