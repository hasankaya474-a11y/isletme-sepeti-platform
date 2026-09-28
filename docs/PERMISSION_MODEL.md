# Permission Model v1

Authorization = role + permission + scope + resource ownership + policy.

Baseline roles:
- COMMANDER_ADMIN
- PLATFORM_OPERATIONS
- CATALOG_OPERATIONS
- FINANCE_OPERATIONS
- SUPPORT_AGENT
- BUSINESS_ADMIN
- PROCUREMENT
- CHEF
- ACCOUNTING
- BRANCH_MANAGER
- SUPPLIER_ADMIN
- SUPPLIER_SALES
- SUPPLIER_WAREHOUSE

No role bypasses audit. High-risk platform changes may require MFA and four-eyes approval.

Example permissions:
identity.user.read
identity.user.manage
business.profile.manage
business.branch.manage
supplier.profile.manage
catalog.master.read
catalog.master.manage
catalog.offer.manage_own
pricing.manage_own
stock.manage_own
rfq.create
rfq.respond_own
order.read_own
order.transition_own
admin.configuration.manage
admin.content.publish
admin.audit.read
admin.export.execute

Default deny. Cross-tenant access is forbidden unless an explicit platform permission and policy allow it.
