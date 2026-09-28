# Phase 1 Identity & Organization Specification

Status: IN PROGRESS

## Goal
Establish identity, organization tenancy, membership, scoped authorization, sessions, MFA policy and immutable audit foundations before commercial modules.

## Security invariants
- Default deny.
- No cross-tenant private-data access.
- Passwords are one-way derived; raw passwords are never stored.
- Session tokens are stored only as hashes.
- MFA is mandatory for selected high-risk operations.
- Commander Admin is powerful but cannot bypass audit.
- Company/business/supplier activation is a workflow, not a boolean shortcut.
- Sensitive company identifiers are designed for protected storage.

## Admin counterpart
Admin must be able to review companies, approve/suspend memberships, inspect role assignments, revoke sessions, enforce MFA policy and view audit/security events without editing source code.

## PASS gates
Schema + migration, domain contracts, password/session primitives, membership/role/scope model, MFA policy, audit, admin management contract, tests, help content and privacy touchpoints.
