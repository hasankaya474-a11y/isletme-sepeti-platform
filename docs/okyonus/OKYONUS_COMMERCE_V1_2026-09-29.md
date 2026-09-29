# OKYANUS EDT COMMERCE V1 — BONServis-type B2B Commerce Architecture
Date: 2026-09-29
Status: DESIGN LOCK CANDIDATE
Branch: okyonus-commerce-v1

## 1. Goal
Turn the public Okyanus EDT face into a product-first HORECA commerce experience:
search -> category -> product -> quantity -> cart/quote -> account -> delivery/offer/order.

Secondary tools are grouped under **İçerik Stüdyo** and are not part of the primary sales navigation.

## 2. Public information architecture
### Header
- Logo
- Search: product / category / brand / pack
- Delivery region
- Account
- Cart / Quote List
- Primary nav: Kategoriler, Kampanyalar, İndirimli Ürünler, Yeni Ürünler, Markalar, Tekliflerim
- Small secondary entry: İçerik Stüdyo

### Home
1. Announcement strip
2. Search + delivery selector
3. Moving hero banner carousel
4. Category mega-navigation
5. Discounted products
6. Best sellers
7. New arrivals
8. Category rails
9. Brand rail
10. HORECA ready-lists / bundles
11. SEO landing link graph
12. Newsletter / contact
13. Footer

## 3. Moving banner engine
Admin-managed:
- image
- mobile_image
- title
- subtitle
- cta_text
- cta_url
- start_at
- end_at
- audience
- sort_order
- active
- desktop/mobile crop
- tracking_key
Behavior:
- auto-rotate
- swipe mobile
- pause on interaction
- keyboard accessible
- preloaded first image only
- lazy-load subsequent slides

## 4. Product card
Fields:
- image
- product_name
- brand
- product_code
- package_text
- unit
- list_price
- sale_price
- discount_percent
- customer_price
- campaign_badge
- stock_status
- quantity stepper
- Add to Cart / Add to Quote
- Favorite
- Price alert
- quick-view
States:
- IN_STOCK
- LOW_STOCK
- ORDER_ONLY
- COMING_SOON
- HIDDEN

## 5. Product detail
- image gallery
- pack and unit data
- list price / sale price / customer-specific price
- quantity
- cart/quote action
- bank transfer price optional
- stock state
- campaign eligibility
- brand link
- category link
- related products
- complementary products
- description
- technical specs
- storage / cold-chain notes
- SEO metadata
- structured data

## 6. Categories
Top-level:
- Deniz Ürünleri
- Donuk Ürünler
- Et & Kanatlı
- Süt & Şarküteri
- Yağlar
- Soslar
- Bakliyat & Kuru Gıda
- Baharat
- İthal Ürünler
- Gıda Dışı
Each category supports:
- nested subcategories
- category image
- SEO intro
- filter schema
- merchandising order
- category-specific banners

## 7. Search
Search across:
- product name
- SKU
- brand
- category
- tags
- pack text
- synonyms
Results grouped into:
- Products
- Categories
- Brands
- Ready Lists / Bundles

## 8. Filters / sorting
- category
- brand
- package/model
- price
- stock
- discount
- new
- special price
- unit
Sort:
- relevance
- newest
- price low-high
- price high-low
- discount
- best seller

## 9. Campaign engine
Campaign types:
- threshold gift
- threshold special-price item
- product discount
- category discount
- bundle discount
- customer-specific campaign
- coupon
Rules:
- start/end
- minimum basket
- repeatable threshold
- combinable yes/no
- stock limit
- audience
- delivery region
- priority
Admin must support activate/deactivate and preview.

## 10. Pricing engine
Price levels:
1. list_price
2. sale_price
3. customer_price
4. campaign_price
5. bank_transfer_price optional
Every price change:
- timestamp
- actor
- old/new
- reason
- start/end
- audit entry

Competitor prices are never auto-published as Okyanus prices. External prices may be kept as research/reference only.

## 11. Cart / Quote hybrid
Public action label can be **Sepete Ekle**.
Checkout mode depends on product/customer:
- direct order
- request quote
- mixed basket
Flow:
cart -> company/account -> delivery -> pricing/quote confirmation -> order.
Existing Okyanus quote engine remains available behind this UX.

## 12. Membership / account
Account:
- company
- contact
- tax office / tax no
- phone / email
- addresses
- delivery region
- account type
- price group
- credit / terms metadata optional
Pages:
- orders
- quotes
- favorites
- repeat order
- addresses
- company info
- customer prices
- alerts

## 13. Delivery
Admin-configurable:
- region
- district
- minimum order
- fee
- free-shipping threshold
- cut-off time
- delivery days
- cold-chain eligibility
- blackout dates

## 14. İçerik Stüdyo
Secondary tools hidden from primary commerce navigation:
- Dijital Menü
- Fotoğrafla Teklif
- ÇEŞNİ
- COST / COST Radar
- Akademi
- Kolay Reçete
- other legacy/experimental tools
Entry is intentionally secondary.
Each module keeps its own route/auth rules.

## 15. Contact / support
Visible real module:
- contact page
- contact form
- phone
- email
- support categories
- order/delivery help
- FAQ
- message center integration
WhatsApp:
- small support action only if verified working
- not a primary module
- if disabled, hidden entirely

## 16. Media library
Admin-managed Okyanus media:
- product images
- banner images
- category images
- brand logos
- campaign images
- mobile variants
Features:
- upload
- replace
- crop
- alt text
- tags
- usage references
- orphan detection
- WebP/AVIF derivatives
- original preserved
Only licensed, supplier-provided, manufacturer-authorized, or user-owned media should be stored.

## 17. Admin panel: mandatory control plane
### Dashboard
- revenue/quote/order KPIs
- low stock
- campaign status
- failed media
- pending contact/photo/quote
### Products
- CRUD
- image
- price
- pack
- stock
- category
- brand
- SEO
- visibility
### Categories
- tree editor
- ordering
- image
- SEO
### Brands
- CRUD
- logo
- landing content
### Prices
- global
- customer specific
- price history
### Campaigns
- rule builder
- banner association
- activation
### Banners
- desktop/mobile media
- scheduling
- order
### Orders / Quotes
- lifecycle
- notes
- pricing
- conversion
### Customers
- company
- price group
- addresses
- order history
### Delivery
- zones
- fees
- cutoffs
### Media
- library
### Content Studio
- module visibility and links
### SEO
- route inventory
- canonical
- sitemap
- redirects
### Audit
- who changed what and when

## 18. Data model
Core tables/collections:
- products
- product_variants
- product_media
- categories
- category_tree
- brands
- price_lists
- customer_prices
- price_history
- inventory_status
- campaigns
- campaign_rules
- campaign_products
- banners
- carts
- cart_items
- quotes
- quote_items
- orders
- order_items
- customers
- customer_addresses
- delivery_zones
- favorites
- price_alerts
- media_assets
- content_modules
- audit_log

## 19. Responsive
Desktop:
- mega menu
- multi-column product grids
Tablet:
- compact category drawer
- 3/2-column grids
Mobile:
- sticky search
- swipe banners
- 2-column or compact 1-column cards
- bottom nav: Ana Sayfa / Kategoriler / Ara / Sepet-Teklif / Hesabım

## 20. Performance
- lazy images
- responsive image sizes
- edge caching for catalog
- API caching where safe
- no cache for customer pricing/account
- skeleton loading
- image CDN derivatives
- no large blocking homepage bundles

## 21. SEO
- category landing pages
- product pages
- brand pages
- campaign index policy
- canonical URLs
- product structured data
- breadcrumbs
- sitemap
- existing Okyanus EDT index routes preserved and remapped into commerce destinations

## 22. Safety / regression rules
Must not break:
- email
- contact/message
- photo inquiry
- quote creation
- membership
- existing D1 data
- admin auth
- SEO routes
- rollback path

## 23. Build order
Phase 1: commerce shell + admin data model
Phase 2: catalog/category/search
Phase 3: product cards/detail/media
Phase 4: banners/campaigns
Phase 5: cart/quote/account
Phase 6: delivery
Phase 7: İçerik Stüdyo migration
Phase 8: SEO migration
Phase 9: mobile/tablet hardening
Phase 10: staging and production smoke tests
