# İşletme Sepeti Architecture Lock v3

Status: LOCKED
Date: 2026-09-28

## Constitutional rules
1. İşletme Sepeti is an independent B2B procurement marketplace.
2. Public, business-operator (İşletmeci), supplier, admin and API surfaces share one controlled platform architecture.
3. Normal daily operation must be manageable without code from authorized Admin surfaces.
4. Every user-facing manageable capability must have an Admin/control counterpart.
5. Critical operations require authorization, audit and version/history; high-risk operations may require MFA and four-eyes approval.
6. Help & Site Guide is a first-class module.
7. Initial architecture is a modular monolith, API-first and event-aware. Module boundaries and data ownership are explicit.
8. Production stays locked until private pilot, security, restore, legal/accounting and regression gates pass.
9. AI may assist but never silently selects suppliers, substitutes products, places orders, changes prices/credit or executes payments.
10. Architecture changes require impact analysis and an ADR.
11. The platform exposes a single public homepage. Business-operator, supplier and admin workspaces are not presented as parallel public tabs or public navigation choices.
12. After authentication, session role and scope determine the workspace: BUSINESS -> İşletmeci Paneli, SUPPLIER -> Tedarikçi Paneli, PLATFORM_ADMIN -> Admin Command Center.
13. The former product/demo label "Buyer/Alıcı Paneli" is renamed to "İşletmeci Paneli" in the product UI and documentation.

## Surfaces
- `/`: the single public homepage and public discovery surface.
- `/app`: authenticated application entry. Role/scope routing opens only the authorized workspace.
- BUSINESS role -> İşletmeci Paneli.
- SUPPLIER role -> Tedarikçi Paneli.
- PLATFORM_ADMIN role -> Admin Command Center.
- `/api/*`: API boundary.

Public navigation must not expose BUSINESS, SUPPLIER or ADMIN workspaces as sibling tabs. Direct workspace routes remain protected by authentication, role and scope guards.

These are contracts, not proof of live deployment.

## Management lifecycle
DRAFT -> REVIEW -> SCHEDULED -> PUBLISHED -> UNPUBLISHED -> ARCHIVED

Edit -> Validate -> Preview -> Approval when required -> Publish -> Audit -> Version -> Rollback.

## Core domains
Identity, Authorization, Business, Supplier, Catalog/PIM, Search, Pricing, Money/Tax, Stock, Reservation, Delivery, RFQ/Quote, Cart, Order, Snapshot, Receiving, Returns/RMA, Invoice/Three-way Match, Commission Ledger, Visibility, Rules, Configuration, Feature Flags, Workflow, Events/Outbox, Jobs, Notifications, Reports, Files/Media, Contracts, Trust/Risk, Privacy, Audit, Support/Case, Advertising, Analytics, Help/CMS/SEO, Integration Hub.

## Architecture intake and execution rule
- During architecture-definition mode, user ideas, rules and requested capabilities are captured, developed and incorporated into the architecture without changing the live system.
- When the user asks to "bring the architecture", return the consolidated current architecture together with the latest additions, unresolved gaps and remaining work.
- Implementation begins only after an explicit execution command from the user.
- After that command, carry the approved architecture through implementation, regression testing, release checks and live publication without requesting routine intermediate approvals.
- Production publication still requires the explicit execution/live-release command and must preserve rollback capability.

## PASS rule
A module is not PASS until purpose, roles, fields, actions, states, responsive behavior, permissions, Admin counterpart, API, events, audit, help, privacy/legal touchpoints, error/empty/loading states, tests and regression are defined and normal operations are code-free.
