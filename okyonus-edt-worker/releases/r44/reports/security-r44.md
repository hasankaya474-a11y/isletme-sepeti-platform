# R44 local security review

Reviewed latest R43 DENIZ and R41 ZAMAN. No live mutations or separate administration-host requests occurred.

Fixed three issues with isolated `patch-security-r44.py`:

- The response wrapper replaced stronger administrator CSP, Referrer-Policy and Permissions-Policy. It now retains those existing policies and adds only absent structural CSP directives. Public routes without policies receive the existing baseline. Existing inline administrator scripts remain compatible.
- Studio uploads accepted declared JPEG/PNG/WebP MIME without inspecting their bytes. They now reject missing/mismatched recognizable format headers before storing bytes. Existing roles, CSRF and 8 MB limit remain. This is format-signature validation, not a full image decoder or malicious-content scanner.
- The primary `/api/quote` product guard missed exact `OUT` and related stock codes. It now rejects OUT/INACTIVE/DISABLED/UNAVAILABLE/SOLD_OUT/OUT_OF_STOCK and existing Turkish statuses, and inactive values false/0/"0". Client response shape remains PRODUCT_UNAVAILABLE. Related B2B and repeat checks belong to the flows patch.

Local tests passed: retained stronger CSP including script/form restrictions; retained no-referrer and camera restrictions; admin no-store; viewer upload refusal; fake-image MIME rejection before storage; missing CSRF rejection; cross-site rejection; available/unavailable stock status scenarios. Both patched files passed Node syntax checks on temporary copies.

Scope limits: no real account creation, password changes, writes to live D1/media/GitHub storage or exploitation. Authentication and upload gates were tested locally using isolated functions and controlled doubles. End-to-end D1 session state and live administrator authorization require separate verification. Existing origin fallback behavior and custom domain/Cloudflare Access configuration were not changed.
