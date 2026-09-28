# ADR-0002: Modular Monolith First

Status: Accepted
Date: 2026-09-28

Start as a modular monolith with explicit bounded modules, contracts, events and data ownership. Do not create a microservice jungle before operational scale justifies it.

Modules may not mutate another module's owned data through ad-hoc access. Cross-module work uses application contracts/events.
