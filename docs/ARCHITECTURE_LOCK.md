# İşletme Sepeti Architecture Lock v3

Status: LOCKED
Date: 2026-09-28

## Constitutional rules
1. İşletme Sepeti is an independent B2B procurement marketplace.
2. Public, buyer, supplier, admin and API surfaces share one controlled platform architecture.
3. Normal daily operation must be manageable without code from authorized Admin surfaces.
4. Every user-facing manageable capability must have an Admin/control counterpart.
5. Critical operations require authorization, audit and version/history; high-risk operations may require MFA and four-eyes approval.
6. Help & Site Guide is a first-class module.
7. Initial architecture is a modular monolith, API-first and event-aware. Module boundaries and data ownership are explicit.
8. Production stays locked until private pilot, security, restore, legal/accounting and regression gates pass.
9. AI may assist but never silently selects suppliers, substitutes products, places orders, changes prices/credit or executes payments.
10. Architecture changes require impact analysis and an ADR.

## Surfaces
- isletmesepeti.com: public + buyer
- tedarikci.isletmesepeti.com: supplier
- admin.isletmesepeti.com: command admin
- api.isletmesepeti.com: API

These are contracts, not proof of live deployment.

## Management lifecycle
DRAFT -> REVIEW -> SCHEDULED -> PUBLISHED -> UNPUBLISHED -> ARCHIVED

Edit -> Validate -> Preview -> Approval when required -> Publish -> Audit -> Version -> Rollback.

## Core domains
Identity, Authorization, Business, Supplier, Catalog/PIM, Search, Pricing, Money/Tax, Stock, Reservation, Delivery, RFQ/Quote, Cart, Order, Snapshot, Receiving, Returns/RMA, Invoice/Three-way Match, Commission Ledger, Visibility, Rules, Configuration, Feature Flags, Workflow, Events/Outbox, Jobs, Notifications, Reports, Files/Media, Contracts, Trust/Risk, Privacy, Audit, Support/Case, Advertising, Analytics, Help/CMS/SEO, Integration Hub.

## PASS rule
A module is not PASS until purpose, roles, fields, actions, states, responsive behavior, permissions, Admin counterpart, API, events, audit, help, privacy/legal touchpoints, error/empty/loading states, tests and regression are defined and normal operations are code-free.
