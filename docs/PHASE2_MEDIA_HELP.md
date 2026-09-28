# Phase 2 Media and Help
Status: FOUNDATION IMPLEMENTED

Media now follows stage -> validation -> scan -> CLEAN/QUARANTINED -> promote. Unscanned or unsafe assets cannot become publish-ready. Production scanner/storage remain provider adapters.

Help Center has Admin create/publish/unpublish services, audit events and a management page. Context and role filtering remain part of the public/help delivery contract.

Vitrin Admin now has a CSRF-bearing client for page, block, reorder, schedule and rollback mutations. No source-code editing is exposed.
