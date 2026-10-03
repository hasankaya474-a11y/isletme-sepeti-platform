# DENİZ R38 performance and asset review

Prepared patch: `work/patch-performance.py`; source files remain untouched.

## Change

Thirty embedded image/icon entries were decoded and written as independent files in `work/assets/`. Each file uses its full SHA-256 hash as filename; original bytes are preserved without image recompression, resizing or reassignment. `work/assets-manifest.json` records source path, MIME, byte length, hash and destination URL.

The patch replaces rendered local image references with GitHub raw release URLs. The legacy `/pwa-icon.svg` endpoint redirects to the prepared 512px PNG icon to avoid unsupported external images nested within SVG image documents. Existing local image/icon paths retain a compatibility redirect, including GET/HEAD and method guards. The original logo helper returns the external address for the same original logo. No original image is removed from the prepared release.

Default root: `https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/codex/okyanus-r38-20261002/okyonus-edt-worker/releases/r38/assets/`. Pass `--asset-root` to pin the final Git commit. GitHub upload and external URL availability must be verified by the integrating agent before deployment.

## Local evidence

- Source bytes: 4,408,308 → 2,355,301; reduction 2,053,007 bytes (46.6%).
- 30 distinct image/icon files; 30 SHA-256 byte equivalence checks passed.
- 60 GET/HEAD compatibility redirects, 30 method guards and missing asset 404 passed.
- `node --check work/deniz-performance.mjs` passed.
- No large literal data-image base64 images remain in prepared Worker source.

## Other large constants

Largest remaining lines are product catalogue (~292 KB), unbranded catalogue (~102 KB), spice materials (~102 KB) and Lezita catalogue (~60 KB). They are structured business data or browser feature data. Moving these would alter API/runtime availability and could break product continuity; they are deliberately preserved.

The image change eliminates per-isolate base64 asset map storage and first-request `atob` decoding/copying. It does not prove a live Cloudflare CPU quota result. No root-page cache change is included here: dynamic publication data must remain fresh and a cache requires explicit invalidation logic. Existing source's HTML transforms should be assessed separately by the root agent using measured request timings.

## Commands

`python work/patch-performance.py --input work/deniz.mjs --output work/deniz-final.mjs`

`node --check work/deniz-performance.mjs`

`node work/test-performance.mjs`
