# İşletme Sepeti Platform

Phase 0 foundation.

## Locked principles
- Independent B2B platform.
- Modular monolith first.
- API-first contracts.
- Codeless normal operations through authorized Admin controls.
- Audit and version history for critical changes.
- Help & Site Guide is part of the product.
- Production remains locked until formal gates pass.

## Repository map
- apps/: public, buyer, supplier, admin
- packages/: core, contracts, design-system
- docs/: architecture lock, ADRs, work plan
- infra/: infrastructure contracts
- tests/: architecture and regression gates
- scripts/: repository quality gates

Run:
npm run check
npm test
