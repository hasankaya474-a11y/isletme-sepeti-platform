# ADR 0008: Communication Center and Contextual WhatsApp

Status: Accepted
Date: 2026-09-29

## Context
Communication had been represented as separate buttons or channels. The locked product architecture requires customer, supplier and commerce communication to remain traceable to the relevant RFQ, quote, order, case or account context.

## Decision
- Establish Communication Center as a first-class platform domain.
- Correlate web messages, email, WhatsApp, RFQ/order messages, support interactions, photo/list submissions and call-center interactions with platform entities.
- Allow contextual WhatsApp entry points from product, RFQ, quote, order, support and public contact.
- Treat deep-link click/open events only as click/open evidence. Do not infer sent, delivered or read.
- Provider-backed message states require an authorized WhatsApp Business integration and webhook evidence.
- Communication controls, templates, channel availability, consent, security and audit are managed from Admin.
- Communication must not bypass role/scope authorization, privacy rules or anti-abuse controls.

## Consequences
The platform gains a unified, auditable communication timeline and can add deeper WhatsApp Business integration without coupling core commerce flows to a single provider.
