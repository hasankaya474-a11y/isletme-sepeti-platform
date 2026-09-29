# İşletme Sepeti Consolidated Architecture v4

Status: LOCKED
Date: 2026-09-29
Authority: `docs/ARCHITECTURE_LOCK.md`

## 1. Product model

İşletme Sepeti is one controlled B2B procurement platform with one visible public homepage and private role-routed workspaces.

```text
PUBLIC HOMEPAGE
      |
AUTH / MEMBERSHIP
      |
+-----+---------+
|               |
BUSINESS      SUPPLIER      PLATFORM_ADMIN
|               |               |
İşletmeci     Tedarikçi      Admin Command
Paneli         Paneli          Center
```

Public navigation never exposes these workspaces as sibling demo tabs.

## 2. Single public homepage

The only real homepage is `/`.

Primary public capabilities:
- Product and category discovery
- Supplier discovery
- Search
- How it works
- List/photo upload entry
- Business membership CTA
- Supplier membership CTA
- Login
- Help/contact
- Legal/footer surfaces

The public homepage is a front door, not a workspace.

## 3. Identity, membership and routing

Authenticated entry is `/app`.

Session bootstrap resolves:
1. identity
2. organization membership
3. role
4. scope
5. authorized workspace

Routing contract:
- BUSINESS -> İşletmeci Paneli
- SUPPLIER -> Tedarikçi Paneli
- PLATFORM_ADMIN -> Admin Command Center

A user with more than one authorized membership may switch workspaces only after authentication. Direct routes require API-side authorization as well as UI guards.

## 4. İşletmeci Paneli

The former Buyer/Alıcı workspace is permanently named İşletmeci Paneli.

Modules:
1. Genel Bakış
2. Ürün Ara / Katalog
3. Kategoriler
4. Toptancılar
5. Liste Yükle
6. Teklifler
7. Sepetim
8. Siparişlerim
9. Teslimatlarım
10. Tekrar Sipariş
11. Satın Alma Listelerim
12. Tedarikçilerim
13. Favorilerim
14. Faturalarım
15. Raporlarım
16. Şubelerim
17. Kullanıcı & Yetki
18. Bildirimler
19. İşletme Ayarları
20. Yardım

General Overview is the workspace landing page and must not be labeled as the platform homepage.

## 5. Tedarikçi Paneli

Modules:
1. Genel Bakış
2. Siparişler
3. Teklif Talepleri
4. Ürünlerim
5. Fiyat Merkezi
6. Stok Merkezi
7. Toplu İşlemler
8. Teslimat
9. Müşterilerim
10. Özel Fiyatlar
11. Kampanyalar
12. Faturalar
13. Cari Bilgileri
14. Komisyon
15. Raporlar
16. Personel & Yetki
17. Hareket Geçmişi
18. Firma Ayarları
19. Yardım

## 6. Catalog/PIM

The canonical product model supports:
- product id and SKU
- product name
- category and subcategory
- brand
- variants
- unit
- case/pack quantity
- net weight
- media
- descriptions
- technical/allergen documents
- supplier
- price
- stock
- delivery data
- visibility
- SEO metadata

Lifecycle:
DRAFT -> REVIEW -> SCHEDULED -> PUBLISHED -> UNPUBLISHED -> ARCHIVED

## 7. RFQ and quote engine

Core flow:

```text
PRODUCT / LIST
      |
QUANTITY
      |
RFQ
      |
ELIGIBLE SUPPLIERS
      |
SUPPLIER QUOTES
      |
FACTUAL COMPARISON
      |
BUSINESS DECISION
      |
ORDER
```

The platform may assist, filter and compare factual terms. AI or automation must never silently select a supplier, substitute a product, accept a quote, place an order, change price/credit or execute payment.

## 8. List and photo intake

Accepted intake can include photo, PDF, spreadsheet or structured list.

Flow:
upload -> analysis -> candidate matches -> human review -> confirmation -> RFQ/cart.

Low-confidence or ambiguous matches are explicitly marked for review.

## 9. Communication Center

Communication Center is a first-class domain, not a floating contact button.

Supported sources:
- web message
- WhatsApp
- email
- RFQ message
- quote message
- order message
- support case
- photo/list submission
- call-center interaction
- system notification

Messages are correlated with one or more entities:
- customer/business
- supplier
- RFQ
- quote
- order
- invoice
- support case

Thread states:
NEW -> OPEN -> WAITING_CUSTOMER / WAITING_SUPPLIER -> RESOLVED -> CLOSED

Admin filters include source, customer, supplier, order/RFQ, date, owner, status, priority and SLA.

## 10. WhatsApp architecture

WhatsApp is contextual.

Entry points may exist from:
- product
- RFQ
- quote
- order
- support/help
- public contact

Each message template may include a stable reference such as RFQ, order or case id.

Phase 1 may use approved WhatsApp deep links with prefilled text. The platform may record a click/open event, but may not claim SENT, DELIVERED or READ without provider evidence.

Advanced mode uses an authorized WhatsApp Business provider/API:
platform -> communication service -> provider -> webhook -> message status.

Possible provider-backed statuses:
QUEUED, SENT, DELIVERED, READ, FAILED.

Controls:
- enable/disable
- template management
- channel visibility by module
- target business number
- provider/webhook health
- consent/opt-in
- audit trail
- rate and abuse protections

No uncontrolled bulk messaging.

## 11. Notification engine

Notifications are distinct from conversations.

Events may generate IN_APP, EMAIL, PUSH or WHATSAPP notifications according to channel policy and consent.

Examples:
RFQ_CREATED, QUOTE_SUBMITTED, QUOTE_REVISED, ORDER_CREATED, ORDER_DISPATCHED, DELIVERY_DUE, INVOICE_RECEIVED, CASE_UPDATED.

## 12. Order and snapshot

Accepted quote creates an order.

Order snapshots preserve commercial facts at creation:
- product identity/name
- unit/quantity
- price/tax
- delivery terms
- address
- supplier/customer parties
- accepted quote reference

Later catalog changes must not mutate historical order snapshots.

## 13. Delivery, receiving and RMA

Delivery states can include:
PREPARING, READY, DISPATCHED, IN_TRANSIT, DELIVERED, PARTIAL, FAILED.

Receiving supports:
- full delivery
- shortage
- damaged
- wrong item
- notes
- evidence/photo

Exceptions may create RMA/return flows.

## 14. Invoice and three-way match

Three-way match compares:
ORDER + RECEIVING + INVOICE.

Variance categories include quantity, item, price, tax and delivery mismatches.

## 15. Reporting

### İşletmeci
- spend by category/supplier/branch
- price movement
- order/delivery performance
- invoice variance
- repeat purchasing
- approved savings metrics where definition exists

### Tedarikçi
- RFQ/quote conversion
- order/product/customer performance
- stock and delivery performance
- regional views
- commission/reconciliation
- pricing history where authorized

### Platform Admin
- GMV and transaction metrics
- RFQ, quote and order funnels
- active businesses and suppliers
- catalog/search behavior
- support/case metrics
- campaign/advertising metrics
- platform health
- dispute/variance metrics

Reports require a metric dictionary so definitions are reproducible.

## 16. Market Radar

Market Radar is observational and aggregated. It may surface category, demand, region and product signals. It does not choose suppliers or make purchasing decisions for users.

## 17. Admin Command Center

Main groups:
- Genel Bakış
- Ticaret
- Katalog
- Fiyat & Stok
- Teslimat
- İşletmeciler
- Tedarikçiler
- Üyelik & Yetki
- Vitrin Studio
- Kampanya & Reklam
- Raporlama
- Pazar Radarı
- İletişim Merkezi
- Destek / Çağrı Merkezi
- Yardım & Site Kılavuzu
- Sözleşmeler
- Entegrasyonlar
- Güvenlik & KVKK
- Audit / Hareketler
- Engine Room

Every normally manageable user-facing capability must have an authorized Admin/control counterpart.

## 18. Storefront Studio and CMS

Public surfaces are managed without code where normal operations require it.

Supported controls include:
- title/subtitle/body copy
- buttons/CTA
- homepage sections
- product/category/supplier shelves
- banners
- help content
- footer/legal links where appropriate
- campaign placement
- scheduling
- visibility

Lifecycle:
DRAFT -> REVIEW -> SCHEDULED -> PUBLISHED -> UNPUBLISHED -> ARCHIVED.

Controls:
edit, validate, preview, approval where required, publish, schedule, unpublish, archive, version history and rollback.

## 19. Membership and organizational roles

Business organizations may have roles such as owner, purchasing, branch manager, accounting and read-only.

Supplier organizations may have roles such as owner, sales, product, price/stock, accounting and delivery.

Privileges are scoped to organization and role. Hiding navigation does not grant or revoke access.

## 20. Security

Mandatory security concerns:
- authentication
- RBAC and organization scope
- MFA for privileged/critical access
- session controls
- rate limiting
- CSRF protections where relevant
- secure secret storage
- upload type/size/content validation
- audit logs
- privacy and retention controls
- backup
- restore verification
- security review
- webhook verification
- least privilege

High-risk operations may require four-eyes approval.

## 21. Financial integrity

Financial/commission/reconciliation ledgers are append-oriented and auditable. Corrections create compensating or correction entries rather than silently rewriting historical financial records.

## 22. Audit

Critical actions record:
- actor
- action
- timestamp
- entity
- old/new values when applicable
- reason/context
- scope/source

## 23. Integration Hub

Central integrations may include:
- ERP
- accounting
- payment
- logistics
- email
- WhatsApp
- webhooks
- file import/export
- external APIs

Each integration exposes status, last sync, errors, retry controls, credential reference, webhook state and logs according to authorization.

## 24. Help & Site Guide

Help is a first-class contextual system in Public, İşletmeci, Tedarikçi and Admin surfaces. It explains the active task and links users to appropriate support without exposing unrelated privileged surfaces.

Visibility rule:
- Only guides for modules/features that are currently active and visible on the relevant web surface may be shown to end users.
- Guides belonging to inactive, hidden, unpublished or feature-flagged-off modules remain stored in Admin but are not visible, searchable or suggested to end users.
- When a module is reactivated, its guide may be reactivated together with it after validation.
- Help visibility follows the same role/scope and feature-flag rules as the feature it documents.
- Admin may preview inactive guides without publishing them.
- Deactivating a module must never delete its guide content or history.

## 25. Technical architecture

Initial architecture is a modular monolith, API-first and event-aware.

```text
PUBLIC WEB / AUTHENTICATED APP
            |
           API
            |
      MODULAR MONOLITH
      /      |       \
   DATA    FILES     JOBS
            |
        EVENT/OUTBOX
```

Domain boundaries and data ownership are explicit.

## 26. Event/outbox model

Representative events:
RFQ_CREATED
QUOTE_SUBMITTED
QUOTE_ACCEPTED
ORDER_CREATED
ORDER_DISPATCHED
ORDER_DELIVERED
INVOICE_RECEIVED
CASE_OPENED
MESSAGE_RECEIVED

Notifications, reporting and integrations may consume these events without rewriting core transactional truth.

## 27. Feature flags

Release states can include OFF, INTERNAL, PILOT, PERCENTAGE and ON where supported. Flags do not bypass authorization or evidence gates.

## 28. Engine Room

Admin system health includes at least:
WEB, API, DATABASE, FILES, JOBS, EMAIL, WHATSAPP, WEBHOOKS, SEARCH, QUEUE/OUTBOX and BACKUP health as applicable.

## 29. Release path

LOCAL -> DEV -> PRIVATE_STAGING -> CLOSED_REAL_TEST -> PRODUCTION.

Production is locked until evidence-backed gates pass.

Required external gates:
- PRIVATE_PILOT
- DEFECT_CLOSURE
- SECURITY_REVIEW
- RESTORE_VERIFICATION
- LOAD_VERIFICATION
- LEGAL_REVIEW
- ACCOUNTING_REVIEW
- PRIVACY_REVIEW

A gate is never marked PASS without real evidence.

## 30. Implementation discipline

During architecture-definition mode:
- user decisions are captured and refined
- architecture/docs may be updated
- the live production system is not changed

When the user asks to bring the architecture, return:
- consolidated architecture
- latest additions
- unresolved gaps
- remaining implementation work

Implementation and live release begin only after the user's explicit execution/live-release command. After that command, routine intermediate approvals are not required, but safety gates, regression tests and rollback capability remain mandatory.

## 31. Current implementation gap

The current GitHub demo still visually exposes Public / Buyer / Supplier / Admin tabs and therefore does not yet match this locked architecture.

Required implementation change after execution command:
- remove public sibling role tabs
- keep one public homepage
- rename Buyer/Alıcı to İşletmeci
- add real auth/membership bootstrap
- route by role and scope
- enforce guards in UI and API
- build Communication Center and contextual WhatsApp integration
- complete notification policies
- connect Admin lifecycle controls
- regression-test all role isolation and commerce flows

This section describes an implementation gap, not permission to deploy production.
