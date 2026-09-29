# Phase 12 Gate
Status: IN PROGRESS
Started: 2026-09-29

Scope: Reporting, export jobs, PDF/XLSX delivery contracts and metric dictionary.

Foundation rules:
- metrics have explicit definitions, units and sources
- reports are reproducible from declared filters
- exports are explicit jobs with auditable ownership
- PDF/XLSX generation is a delivery concern, not hidden business logic
- sensitive data requires scoped access
- no metric may silently redefine itself
- production remains locked

PASS requires the full module PASS rule in docs/ARCHITECTURE_LOCK.md.
