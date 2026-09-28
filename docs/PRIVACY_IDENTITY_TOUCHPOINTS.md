# Identity Privacy Touchpoints

This is an engineering control map, not legal advice.

Identity data is purpose-limited and access-controlled. Admin views should minimize exposure by default.

## Data classes
- Authentication: email, password derivative, MFA credentials, sessions.
- Organization membership: company relation, role, scope.
- Security telemetry: hashed IP/device identifiers, login/security events.
- Commercial identity: company and verification records.

## Engineering controls
- Never log raw passwords, session tokens, MFA secrets or recovery tokens.
- Store session/recovery tokens as hashes.
- Protect sensitive identifiers and secrets with encryption/secret storage adapters.
- Scope exports and record who exported what, when and with which filters.
- Support retention/anonymization workflows without destroying legally required commercial/audit history.
- Separate operational notices from marketing preferences.
- Access to identity/security data is itself audited.
