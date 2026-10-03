# Public customer flow audit

Applied only to temporary `work/public-temp.mjs`; integration patch: `work/patch-public.py`.

- Dairy products tagged “Süt & Şarküteri” were classified as meat because generic şarküteri was matched first. Removed generic match from meat heuristic; explicit meat names remain.
- Enter in catalog search submitted an unconfigured form and refreshed the page, losing filter/search state. Submit now prevents reload and renders current selection.
- Header promised package search but catalog only searched name/category/brand. Added package text and SKU.
- “Yeni Ürünler” displayed the whole catalog in reverse order. Now only currently valid `new_until` products qualify; an empty result offers all products and sales contact.
- Empty campaigns exposed management instructions to customers and had no onward action. Replaced with customer language and catalog link.
- Campaign CTA accepted dangerous or malformed URL schemes. Restricted to same-origin relative paths and HTTPS; invalid targets fall back to catalog.
- Empty brand list now offers catalog navigation.
- Contact submission lacked duplicate protection and could display success when server JSON returned `ok:false`. Added in-flight button lock, explicit success condition, and connection failure recovery while retaining entered fields.

Validation: Node syntax check passed. Worker routes /urunler, /kampanyalar, /markalar, /iletisim returned 200; all seven inline JavaScript blocks per route parsed with vm.Script. Executed classification tests: white cheese stays dairy, sucuk stays meat, potato stays frozen. No design changes, cart/auth edits, fake images, or empty fabricated product cards.

Limits: live database and browser interaction not exercised by this agent. Existing two-person contact links and KVKK routes found; no claim of legal adequacy or live contact delivery.
