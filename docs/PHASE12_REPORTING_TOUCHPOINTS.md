# Phase 12 Reporting Touchpoints
Status: ACTIVE FOUNDATION
Date: 2026-09-29

This is an engineering control map.

- Every metric has a stable key, description, unit, source and lifecycle.
- Report definitions declare exactly which metrics and filters they support.
- PDF/XLSX exports are explicit asynchronous job records with owner, filters and audit history.
- Export artifacts must inherit source-data access controls and retention rules.
- Sensitive personal or commercial data must not be exposed through a report merely because an export format supports it.
- Metric definition changes are versioned and auditable; silent semantic changes are prohibited.
- Help content must explain metric meaning, filter scope, export status and failure recovery.
- Production remains locked.
