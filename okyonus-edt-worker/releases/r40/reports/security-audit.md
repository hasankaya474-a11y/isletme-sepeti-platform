# Technical trust audit — 2026-10-03

Live website checks were read-only. Root HTTPS returned HTTP/2 200 and HTTP redirected 301 to HTTPS. Cloudflare served the site. Anonymous `/api/member/me` returned `UNAUTHENTICATED`. Root markup contained no insecure HTTP resource URLs. `/kvkk`, `/gizlilik`, `/uye`, `/iletisim` returned 200. Published operator details include Orhan Güngör, an Esenler address, telephone and domain email; these are site disclosures, not independently verified commercial identity.

Observed root response lacked HSTS, Content-Security-Policy, X-Content-Type-Options, Referrer-Policy and frame protection headers. R40 adds these through response wrappers, preserves existing cookies, and disables caching for member/session/admin responses and requests carrying credentials. Structural CSP rules are enforced; inline-script migration is tracked through Report-Only CSP to preserve legacy modules. No report collector is claimed or configured. Public security headers do not certify business reliability, payment processing, regulatory compliance or freedom from vulnerabilities.

`/api/health` measures only the availability of the public Worker response. It checks no database, merchant transaction, administrator presence or shipping operation. The indicator must say the site responded and show the check time, never imply a security certification or staffed support.

Local scenario tests cover health GET, HEAD and rejected POST; security headers; member and admin no-store; and Set-Cookie preservation. Both Worker files passed syntax checks after applying the patch to temporary copies.

`/yonetici` publicly redirects to the separate workers.dev commerce administration host. Fetching that separate host was blocked by automatic approval review because the named-site audit did not establish authority for this distinct administration destination. No bypass or follow-up request occurred. Full live administrator authentication, authorization, account isolation and session cookie audit therefore remain unverified. Local code checks are distinct from live admin verification.
