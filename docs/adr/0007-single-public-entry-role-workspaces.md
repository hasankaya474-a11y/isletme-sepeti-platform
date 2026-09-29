# ADR 0007: Single Public Entry and Role-Routed Workspaces

Status: Accepted
Date: 2026-09-29

## Context
The live demo exposed Public, Buyer, Supplier and Admin as parallel top-level tabs. That was useful for demonstration, but it is not the intended product architecture. The desired product has one visible public homepage. Authenticated users enter through the same application and are routed to a workspace based on membership role and scope.

## Decision
- Keep exactly one public homepage.
- Do not expose İşletmeci, Tedarikçi or Admin as public sibling tabs.
- Rename the product-facing Buyer/Alıcı workspace to İşletmeci Paneli.
- On authenticated entry, resolve membership role and scope before rendering the application shell.
- BUSINESS opens İşletmeci Paneli.
- SUPPLIER opens Tedarikçi Paneli.
- PLATFORM_ADMIN opens Admin Command Center.
- Direct workspace URLs require authentication plus role/scope authorization.
- A user with multiple authorized memberships may use an explicit account/workspace switcher after authentication; this switcher is not part of the public homepage.
- Unauthorized workspace access returns an authorization failure or safe redirect, never another role's workspace.

## Impact
### UX
The homepage becomes the single front door. Internal workspaces are hidden until login and feel like private operating environments rather than public site sections.

### Identity and authorization
Session bootstrap must resolve user identity, membership, role and scope before application navigation is constructed.

### Routing
Public routes and authenticated app routes are separated. Navigation is generated from the active authorized workspace, not from a universal cross-role menu.

### Naming
All user-facing references to Buyer/Alıcı Paneli are migrated to İşletmeci Paneli. Internal code identifiers may be migrated separately where doing so is safe and non-breaking.

### Security
Role guards become mandatory at both UI routing and API authorization layers. Hiding a menu is not considered access control.

### Regression
Tests must verify that public UI does not expose role tabs, authenticated BUSINESS users cannot open Supplier/Admin workspaces, SUPPLIER users cannot open Business/Admin workspaces, and ADMIN access remains privileged.

## Consequences
This architecture removes the misleading side-by-side role presentation, improves product clarity, and aligns the UI with real membership semantics. Demo tooling may still support developer-only role simulation outside production, but it must not appear as normal public navigation.
