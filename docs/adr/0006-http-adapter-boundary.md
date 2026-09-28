# ADR-0006 HTTP Adapter Boundary
Status: Accepted
Date: 2026-09-28

Domain/application code stays independent from a specific cloud framework. HTTP, CORS, security headers, cookies and deployment request translation live at adapter boundaries. This preserves portability and keeps infrastructure choices out of commercial domain logic.
