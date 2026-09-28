# Admin Control Matrix v1

| Domain | Normal operation without code | Audit | MFA | Four-eyes where high risk |
|---|---|---|---|---|
| Users/Memberships | Yes | Required | Sensitive actions | Yes |
| Roles/Scopes | Yes | Required | Required | Yes |
| Sessions/Devices | Yes | Required | Admin action | Optional by risk |
| Company approval | Yes | Required | Configurable | Configurable |
| Catalog/PIM | Yes | Required | Bulk/high risk | Configurable |
| Storefront/CMS | Yes | Required | Publish | Configurable |
| Pricing/Stock | Yes | Required | Bulk/high risk | Configurable |
| Commission | Yes | Required | Required | Required |
| Exports | Yes | Required | Required | Large/sensitive |
| Feature flags/config | Yes | Required | Required | Production/high risk |
| Help content | Yes | Required | Publish | Configurable |

Rule: if ordinary operation in these domains requires a source-code edit, the module is not complete.
