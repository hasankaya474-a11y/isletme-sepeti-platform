# SEO, Redirect and Media Safety
Status: FOUNDATION IMPLEMENTED

Vitrin blocks have explicit field schemas; arbitrary script/code fields are rejected. Live preview supports desktop/mobile rendering and produces publish-readiness validation.

Redirect Center supports controlled internal 301/302/307/308 rules and blocks direct self-loops. Chain/cycle detection is still required.

Media uploads are allowlisted by MIME type and size, begin in PENDING_SCAN and cannot publish until marked CLEAN. Unsafe files enter QUARANTINED. Production scanning requires a malware-scanner provider adapter and storage quarantine boundary.

SEO/redirect/media remain codeless Admin-managed capabilities with permissions, audit and version controls.
