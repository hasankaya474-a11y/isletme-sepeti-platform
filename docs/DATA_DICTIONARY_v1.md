# Data Dictionary v1

Status: ACTIVE BASELINE

## Identity & tenancy
USER: human identity; no commercial ownership implied.
COMPANY: legal/commercial organization.
BUSINESS: buyer organization profile linked to a company.
SUPPLIER: supplier organization profile linked to a company.
BRANCH: business operating branch.
WAREHOUSE: supplier or platform-approved stock location.
MEMBERSHIP: user-to-organization relationship.
ROLE: named authorization role.
PERMISSION: atomic action permission.
SCOPE: boundary such as own company, branch, warehouse, region or platform.
SESSION: authenticated device/session record.
SECURITY_EVENT: immutable security-relevant event.

## Catalog & supply
MASTER_PRODUCT: canonical platform product identity.
PRODUCT_VARIANT: package/measure/variant.
SUPPLIER_OFFER: supplier-specific commercial offer linked to master product.
PRICE_RULE: dated/scoped pricing rule.
STOCK_POSITION: stock state or quantity at warehouse.
STOCK_RESERVATION: temporary quantity hold.
MEDIA_ASSET: managed image/video/document with usage references.

## Commerce
RFQ, QUOTE, CART, CART_LINE, ORDER, ORDER_LINE, ORDER_SNAPSHOT, DELIVERY, RECEIVING, RETURN_RMA, INVOICE_REFERENCE, COMMISSION_ENTRY, LEDGER_ENTRY, DISPUTE.

## Control plane
CONFIGURATION, FEATURE_FLAG, WORKFLOW, APPROVAL, CONTENT_ENTRY, CONTENT_VERSION, HELP_ARTICLE, CONTRACT, CONTRACT_VERSION, AUDIT_EVENT, JOB, OUTBOX_EVENT, NOTIFICATION_TEMPLATE, REPORT_DEFINITION, METRIC_DEFINITION, INTEGRATION_CONNECTION.

## Common invariants
- IDs are opaque stable identifiers.
- Money uses integer minor units plus currency, never binary float.
- Commercial transactions snapshot relevant terms at transaction time.
- Historical financial records use append/contra entries, not silent overwrite.
- Tenant-owned records carry explicit ownership/scope.
- Deletion defaults to lifecycle/archive where legal/business history requires preservation.
- All timestamps are UTC internally; presentation localizes at the edge.
