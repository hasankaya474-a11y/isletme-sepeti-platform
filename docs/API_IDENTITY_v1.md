# Identity API Contract v1
Status: DRAFT IMPLEMENTATION

Endpoints to expose through the deployment adapter:
- POST /v1/auth/register
- POST /v1/auth/verify-email
- POST /v1/auth/login
- POST /v1/auth/logout
- POST /v1/auth/recovery/request
- POST /v1/auth/recovery/confirm
- POST /v1/auth/mfa/totp/enroll
- POST /v1/auth/mfa/totp/confirm
- GET /v1/admin/memberships
- POST /v1/admin/memberships/invite
- PATCH /v1/admin/memberships/:id/status
- GET /v1/admin/users/:id/sessions
- POST /v1/admin/users/:id/sessions/revoke-all
- GET /v1/admin/security-events

All responses use the shared API envelope. Authentication, permission, scope, MFA and audit middleware execute before protected handlers. Error responses must not leak credential/account-existence detail.
