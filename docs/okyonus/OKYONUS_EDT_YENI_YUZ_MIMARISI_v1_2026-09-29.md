# OKYANUS EDT Yeni Yüz Mimarisi v1

Status: LOCKED REFERENCE
Date: 2026-09-29
Live production: www.okyonusedt.com
Implementation rule: Architecture/design work does not change the live production site. Production implementation begins only after the user's explicit execution/live-release command.

## 1. Locked design direction
The new Okyanus EDT face uses the İşletme Sepeti design language as its UI shell:
- clean white workspace
- blue/turquoise Okyanus brand accents
- fixed top bar
- left navigation
- large central sales workspace
- rounded cards and controlled spacing
- strong search
- product-first visual hierarchy
- responsive desktop/mobile behavior

The locked visual reference is stored as:
`OKYONUS_EDT_YENI_YUZ_VISUAL_REFERENCE_v1_2026-09-29.png`

## 2. Public objective
Okyanus becomes a sales-first B2B product site.

Primary public journey:
PRODUCT -> QUANTITY -> QUOTE LIST -> PHOTO/LIST -> WHATSAPP/CONTACT -> SALES

Anything that does not directly support product discovery, quote generation, contact or active customer value is hidden from the public surface.

## 3. Public modules that stay active
- Ana Sayfa
- Tüm Ürünler
- Ürün Seç • Teklif Al
- Fotoğrafla Çek / Liste Gönder
- Deniz Ürünleri visual + price/quote information
- other active product categories
- product search and filters
- Teklif Listem
- contextual WhatsApp sales communication
- membership/login
- Dijital Menü
- active SEO/index/landing/link infrastructure
- Help & Site Guide only for active web modules

## 4. Modules hidden but not deleted
These remain in the code/data/admin control plane but are hidden from the public website until reactivated:
- COST Maliyet
- COST Radar
- Akademi
- ÇEŞNİ
- other non-sales legacy tools/blocks

Visibility states:
ACTIVE / HIDDEN / INTERNAL / SCHEDULED / ARCHIVED

## 5. Help visibility rule
End users see guides only for modules currently active and visible on the web surface.
Inactive guides:
- remain stored in Admin
- do not appear in Help navigation
- do not appear in Help search
- are not suggested
- can be reactivated with the related module after validation

## 6. Homepage structure
1. Header
2. Left product/category navigation
3. Sales hero
4. Fast product shortcuts
5. Four sales action cards
6. Öne Çıkan Ürünler
7. Deniz Ürünleri
8. Donuk Ürünler
9. Yağlar
10. Süt & Şarküteri
11. other active category shelves
12. Fotoğrafla Liste Gönder
13. Dijital Menü entry
14. Footer

## 7. Header
- Okyanus EDT logo
- large product/category/brand search
- Teklif Listem
- WhatsApp
- Giriş Yap
- Üye Ol

## 8. Hero
Primary heading example:
`Profesyonel Mutfağınız İçin Güvenilir Gıda Tedariki`

Primary CTA:
`Ürün Seç • Teklif Al`

Secondary CTA:
`Listeni Fotoğrafla Gönder`

No legacy tool promotion inside the hero.

## 9. Left navigation
- Ana Sayfa
- Tüm Ürünler
- Deniz Ürünleri
- Donuk Ürünler
- Et Ürünleri
- Tavuk Ürünleri
- Süt & Şarküteri
- Yağlar
- Bakliyat
- Baharat & Çeşni Ürünleri
- Sos & Konserve
- İthal Ürünler
- Yeni Ürünler
- Çok Talep Edilenler
- Teklif Listem
- Dijital Menü
- Yardım

## 10. Product card
Each product card supports where applicable:
- realistic product image
- product name
- category/status badge
- case/pack quantity
- kg / unit
- visible price or `Fiyat için teklif alın`
- stock signal
- quantity decrement/increment
- favorite
- `Teklif Listeme Ekle`

## 11. Product detail
- SKU
- brand
- category/subcategory
- origin
- packaging
- case quantity
- net quantity
- minimum order
- price mode
- stock
- delivery information
- description
- usage
- allergens/documents where available
- gallery
- quote action
- WhatsApp product question
- related products

## 12. Quote List
Desktop: drawer/right panel.
Mobile: dedicated bottom/panel flow.

Supports:
- selected products
- quantity changes
- removal
- note
- delivery information
- quote preparation
- WhatsApp transfer
- unique request number after submission

## 13. Photo/List intake
PHOTO / FILE -> PREVIEW -> PRODUCT MATCH CANDIDATES -> HUMAN REVIEW -> CONFIRM -> QUOTE LIST.

No AI/automation silently selects or submits products.

## 14. WhatsApp
Contextual entry points:
- product question
- quote list
- photo/list request
- support

Deep-link mode records only click/open evidence.
SENT/DELIVERED/READ claims require authorized WhatsApp Business API/provider webhook evidence.

## 15. Membership
Guest users can browse catalog and create quote requests.
Members gain:
- quote history
- repeat purchase
- favorites
- saved lists
- addresses
- branches
- customer-specific pricing
- notifications

Membership is an accelerator, not a sales gate.

## 16. Dijital Menü remains ACTIVE
Dijital Menü is not hidden. It is upgraded into a professional product.

Minimum:
- 30+ themes
- 30+ layout templates

Theme controls visual language.
Template controls layout/navigation/content structure.

## 17. Dijital Menü controlled customization
Business users may change:
- logo
- cover image
- theme
- template
- category order
- product order
- block visibility
- controlled accent colors
- price visibility
- QR settings
- contact/social fields

The system protects:
- grid
- spacing
- responsive behavior
- typography system
- button sizes
- card geometry

## 18. Dijital Menü Studio
- Menu Dashboard
- Theme Library
- Template Library
- Menu Builder
- Menu Content
- Categories
- Products
- Media
- QR Management
- Branch Menus
- Multilingual Menu
- Preview
- Publish/Version
- Analytics
- AI Visual Tools

## 19. Dijital Menü advanced capabilities
- category reordering
- product reordering
- product hide/show
- branch-specific price/product override
- desktop/mobile preview
- table QR
- branch QR
- campaign QR
- seasonal menu
- daily menu
- multilingual menu
- badges such as new, bestseller, chef choice, vegan, spicy

## 20. Locked visual dimensions
Product master: 1600x1200, 4:3
Product web: 800x600
Product mobile: 600x450
Category: 1200x900, 4:3
Desktop hero: 1600x600
Mobile hero: 900x1200
Promo wide: 1200x600
QR promo: 1000x1000
Digital Menu cover desktop: 1600x900
Digital Menu cover mobile: 1080x1440
Digital Menu category hero: 1200x700
Digital Menu item: 1200x900

Desktop and mobile hero assets may be separate.

## 21. Visual/media rules
- AI visuals do not contain baked-in marketing text
- text remains HTML/CSS
- safe zones are defined
- masters are preserved
- focal point is stored
- crop preview is mandatory
- desktop and mobile previews are mandatory
- invalid aspect ratio blocks publication
- WebP/AVIF derivatives may be generated
- assets are versioned

## 22. Media / AI Visual Studio
Asset metadata includes:
- Asset ID
- source
- prompt when AI-generated
- creation date
- generation model
- original dimensions
- aspect ratio
- product/category relation
- desktop/mobile variant
- approval
- publication status
- version

Workflow:
GENERATE/UPLOAD -> PREVIEW -> DIMENSION CHECK -> CROP CHECK -> DESKTOP CHECK -> MOBILE CHECK -> APPROVE -> MEDIA LIBRARY -> PUBLISH.

## 23. SEO/index preservation
- preserve valuable existing URLs where possible
- use 301 for necessary changes
- preserve/grow sitemap
- canonical
- schema
- product/category indexing
- SEO landings point to real product collections
- do not reset existing Google discovery unnecessarily

## 24. Product-not-found recovery
Zero-result searches offer:
- Bu ürünü Okyanus'tan iste
- Fotoğrafını gönder
- WhatsApp'tan sor

Admin reports unmatched search demand.

## 25. Admin Command Center
- Genel Bakış
- Ürünler
- Kategoriler
- Markalar
- Fiyat Merkezi
- Stok Merkezi
- Teklif Talepleri
- Fotoğraflı Talepler
- WhatsApp / İletişim Merkezi
- Müşteriler
- Üyeler
- Dijital Menü Center
- Vitrin Studio
- Media / AI Studio
- SEO Merkezi
- Raporlama
- Yardım & Site Kılavuzu
- Güvenlik & KVKK
- Audit
- Entegrasyonlar
- Feature Control / Sales Mode
- Engine Room
- Release Center

## 26. Storefront Studio
Code-free controls:
- homepage blocks
- copy
- CTAs
- category/product shelves
- banners
- photo-list block
- Digital Menu entry
- footer
- ordering
- visibility
- scheduled publishing
- preview
- publish/unpublish
- versions
- rollback

## 27. Sales Mode
Recommended current public state:

ON:
PRODUCTS
QUOTE
PHOTO
WHATSAPP
SEO
MEMBERSHIP
DIGITAL_MENU

OFF/HIDDEN:
COST
COST_RADAR
ACADEMY
ÇEŞNİ

## 28. Reporting
- visitors
- product views
- search
- add-to-quote
- submitted quotes
- photo requests
- WhatsApp clicks
- new members
- returning members
- product/category performance
- quote funnel
- customer type/region
- channel mix
- zero-result search demand
- Digital Menu QR scans
- Digital Menu item/category views
- theme/template usage

## 29. Security
- authentication
- role/scope
- privileged Admin MFA
- session controls
- rate limits
- CSRF where relevant
- upload security
- MIME/size validation
- secret storage
- audit
- KVKK/retention
- backup
- restore verification
- least privilege
- optional four-eyes for critical actions

## 30. Publishing lifecycle
DRAFT -> REVIEW -> SCHEDULED -> PUBLISHED -> UNPUBLISHED -> ARCHIVED

Edit -> Validate -> Preview -> Approval where required -> Publish -> Audit -> Version -> Rollback.

## 31. Worker migration strategy
Lowest-risk path:
1. lock the current working Worker/API/D1/email/photo/quote baseline
2. take a full source/config backup
3. place source under Git-based version control
4. create a staging Worker
5. use staging D1/R2 separated from production
6. redesign frontend to this new face first
7. preserve compatibility with existing quote/photo/contact APIs
8. complete Admin, Membership, Media, Reporting and Security layers
9. desktop/mobile/SEO/API/regression testing
10. closed real test
11. verify rollback
12. switch production route/domain only after explicit live command

## 32. Production rule
The live www.okyonusedt.com production site is untouched during architecture/design definition.
Live implementation begins only after explicit execution/live-release instruction.
The old working Worker remains available for rollback during migration.

## Locked summary
New Okyanus EDT is simple and sales-first on the outside, but operated by a full Admin/commerce engine inside.

PUBLIC:
PRODUCT -> QUANTITY -> QUOTE -> PHOTO -> WHATSAPP -> SALE

DIGITAL MENU:
ACTIVE -> 30+ THEMES -> 30+ TEMPLATES -> CONTROLLED CUSTOMIZATION -> QR -> BRANCHES -> ANALYTICS
