# HTTP Security Contract v1
Protected state-changing web requests require authenticated session, permission/scope, tenant/object authorization, MFA where policy requires it, CSRF verification, audit/security events and stable error envelopes.

Session cookies are Secure, HttpOnly and SameSite. Credential/account-recovery errors must avoid account enumeration. Rate limiting is applied to authentication/recovery and sensitive endpoints. CORS is allowlisted per environment. Production security headers are configured by the deployment adapter.
