# Email, Message and Photo Compatibility Contract

Status: LOCKED
Date: 2026-09-29

## Non-regression rule

The redesign must not change the known-working notification and communication engines.

DENİZ baseline-preserved functions:
- `sendBoundEmail`
- `quoteAPI`
- `photoInquiryAPI`
- `okyContactMessageAPI`

ZAMAN baseline-preserved functions:
- `messageCenterRoute`
- `photoMessageRouteV2`

The CI tests compare these functions byte-for-byte against the user-supplied baseline files.

## Ordering rule

For quote/contact/photo intake, durable D1 state is created before notification attempts where the baseline implements that contract. A mail/webhook failure must not erase an accepted customer request.

## Email rule

- Prefer the existing `EMAIL.send` binding behavior.
- Preserve existing sender/destination variables.
- Preserve configured webhook fallback behavior.
- Do not place provider credentials in source code.
- Production PASS requires receipt evidence after deployment.

## Message rule

The existing ZAMAN Message Center remains the operational message surface.
Do not replace its tables or silently migrate message history.

## Photo rule

The existing photo workflow, storage binding and controlled transfer/delete behavior remain protected.
Production PASS requires a real upload, Admin retrieval and notification check.
