# OKYANUS EDT COMMERCE V2 — TAM B2B TICARET MIMARISI
Date: 2026-09-29
Branch: okyonus-commerce-v1
Status: FULL ARCHITECTURE CANDIDATE

## A. HEDEF
Okyanus EDT public yüzü ürün odaklı gerçek HORECA ticaret platformu olacaktır.
Birincil kullanıcı yolculuğu:
Arama/Kategori -> Ürün -> Miktar -> Sepet/Teklif -> Hesap -> Teslimat -> Ödeme/Teklif -> Sipariş -> Takip.

İkincil araçlar ana satış navigasyonundan kaldırılır ve "İçerik Stüdyo" altında tutulur.

## B. PUBLIC HEADER / NAVIGATION
Katman 1: duyuru şeridi.
Katman 2: logo + büyük arama + teslimat bölgesi + hesap + sepet/teklif.
Katman 3: Kategoriler mega menü + Kampanyalar + İndirimli Ürünler + Yeni Ürünler + Markalar + Tekliflerim.
Katman 4: yalnız küçük ikincil giriş olarak İçerik Stüdyo.

Arama kaynakları:
- ürün adı
- SKU
- marka
- kategori
- alt kategori
- paket/gramaj
- etiket
- eşanlamlı
- hazır liste / kombin

## C. ANA SAYFA MERCHANDISING
1. Hareketli hero banner carousel
2. Ana kategori kartları
3. Çok Satan Ürünler rail
4. Fırsat Ürünleri rail + geri sayım
5. İndirimli Ürünler rail
6. Yeni Ürünler rail
7. Deniz Ürünleri rail
8. Donuk Ürünler rail
9. Yağlar rail
10. Süt & Şarküteri rail
11. Soslar rail
12. Kuru Gıda/Bakliyat rail
13. Marka logoları rail
14. HORECA hazır listeler/kombinler
15. Kampanya banner alanı
16. SEO kategori/landing alanı
17. E-bülten
18. İletişim/footer

Her rail admin panelinde:
- görünür/gizli
- sıralama
- ürün kaynağı
- manuel seçki / otomatik kural
- maksimum ürün
- masaüstü/mobil davranış
ile yönetilir.

## D. HERO BANNER ENGINE
Alanlar:
id, title, subtitle, desktop_asset_id, mobile_asset_id, cta_text, cta_url,
start_at, end_at, priority, sort_order, audience_segment, delivery_zone,
device_target, active, tracking_key.

Davranış:
- otomatik akış
- swipe
- nokta navigasyonu
- ileri/geri
- kullanıcı etkileşiminde geçici duraklama
- klavye erişimi
- ilk slide eager, diğerleri lazy
- mobil görsel ayrı kırpım
- tarih dolunca otomatik kapanma
- admin preview

## E. KATEGORI TAXONOMY
Ana kategori:
Deniz Ürünleri
Donuk Ürünler
Et & Kanatlı
Süt & Şarküteri
Temel Gıda
Yağlar
Soslar
Bakliyat & Kuru Gıda
Baharat
İçecekler
İthal Ürünler
Sağlıklı Yaşam
Gıda Dışı

Her kategori:
id, parent_id, name, slug, image, mobile_image, icon, description,
seo_title, seo_description, indexable, sort_order, active, filter_schema.

Sınırsız alt kategori ağacı desteklenir.

## F. PRODUCT MASTER
Temel alanlar:
id
sku
barcode
name
short_name
brand_id
category_id
subcategory_id
description
ingredients
storage_conditions
cold_chain_required
origin
unit
unit_size
pack_count
package_text
min_order_qty
qty_step
tax_rate
list_price
sale_price
customer_price_enabled
bank_transfer_discount
stock_status
stock_qty optional
new_until
active
featured
best_seller
seo_slug
seo_title
seo_description
created_at
updated_at

## G. PRODUCT MEDIA
Bir ürün birden fazla görsel destekler.
Alanlar:
asset_id, product_id, role, sort_order, alt_text, focal_point,
desktop_variant, mobile_variant, thumbnail_variant.

Medya yalnız Okyanus'un kullanım hakkına sahip olduğu kaynaklardan gelir.
Üçüncü taraf site görselleri otomatik olarak Okyanus kütüphanesine kopyalanmaz.

## H. PRODUCT CARD CONTRACT
Kartta:
ürün görseli
kampanya/fırsat/yeni rozeti
ürün adı
paket/gramaj
marka
normal fiyat
indirim yüzdesi
indirimli fiyat
müşteriye özel fiyat etiketi
stok durumu
miktar input/stepper
Sepete Ekle veya Teklif Listesine Ekle
favori
hızlı görünüm

Durumlar:
IN_STOCK
LOW_STOCK
ORDER_ONLY
COMING_SOON
OUT_OF_STOCK
HIDDEN

COMING_SOON / OUT_OF_STOCK:
Gelince Haber Ver.

## I. PRODUCT DETAIL
Galeri
ürün adı
marka
SKU
paket bilgisi
normal fiyat
indirimli fiyat
müşteriye özel fiyat
havale fiyatı opsiyonel
miktar
sepete/teklife ekle
favori
fiyat alarmı
gelince haber ver
kampanya uygunluğu
ürün açıklaması
saklama
soğuk zincir
teknik özellikler
bu markanın tüm ürünleri
bu kategorinin tüm ürünleri
benzer ürünler
tamamlayıcı ürünler
SEO schema.

## J. PRICE ENGINE
Öncelik sırası:
1. contract/customer price
2. campaign price
3. sale price
4. list price

Opsiyonel:
bank transfer price.

Her fiyat kaydı:
product_id, customer/group, price, currency, valid_from, valid_until,
actor, reason, old_price, new_price.

Fiyat geçmişi silinmez, audit tutulur.

Rakip fiyatları yalnız araştırma/radar referansıdır; Okyanus satış fiyatı olarak otomatik yayımlanmaz.

## K. DISCOUNT / OPPORTUNITY ENGINE
Fırsat ürünü:
start_at/end_at
discount_type
discount_value
countdown_enabled
badge
stock_limit
customer_segment
category/brand/product rules.

Ana sayfadaki geri sayım gerçek campaign end_at üzerinden hesaplanır.

## L. CAMPAIGN ENGINE
Tipler:
threshold_gift
threshold_discount
product_discount
category_discount
bundle_discount
coupon
customer_specific
free_delivery
special_price_unlock

Kural:
min_cart
threshold_repeat
gift_product
max_usage
stock_limit
combinable
customer_segment
delivery_zone
start/end
priority.

Admin kampanyayı preview, activate, pause, end yapabilir.

## M. B2B CUSTOMER / PRICE GROUP
Customer:
company_name
company_type
contact_name
phone
email
tax_office
tax_number
address
delivery_zone
sales_rep
price_group
payment_terms
status
notes

Kayıt tipi:
şahıs şirketi / kurumsal şirket.

Admin müşteriyi fiyat grubuna atar.

## N. AUTH / ACCOUNT
Login:
e-posta
telefon ile giriş opsiyonu
şifre
şifremi unuttum
beni hatırla

Account pages:
profil
firma bilgileri
adresler
siparişlerim
tekliflerim
favoriler
fiyat alarmlarım
gelince haber ver
müşteriye özel fiyatlarım
tekrar sipariş
bildirim tercihleri
sözleşmeler
puan/sadakat cüzdanı opsiyonel.

## O. CART / QUOTE HYBRID
Sepet satırları:
product_id
variant
qty
unit_price
price_source
campaign_adjustment
tax
line_total.

Sepet durumları:
DRAFT
READY
QUOTE_REQUIRED
CHECKOUT_READY
CONVERTED
ABANDONED.

Ürün/müşteri politikasına göre:
- doğrudan sipariş
- teklif zorunlu
- karma sepet.

Mevcut Okyanus quote motoru korunur.

## P. CHECKOUT
Adım 1 hesap/firma
Adım 2 teslimat adresi
Adım 3 teslimat seçeneği
Adım 4 fiyat/kampanya doğrulama
Adım 5 ödeme veya teklif onayı
Adım 6 sipariş/teklif numarası
Adım 7 e-posta/SMS bildirim.

Minimum sepet ve teslimat kuralları checkout'ta tekrar doğrulanır.

## Q. PAYMENT
Mimari destek:
card
bank_transfer
account_terms
quote_only.

Ödeme gateway ilk fazda opsiyoneldir.
Havale indirimi ürün veya genel politika olarak tanımlanabilir.
Ödeme sonucunda idempotent order creation gerekir.

## R. DELIVERY ENGINE
Tablolar:
delivery_zones
delivery_districts
delivery_schedules
delivery_fees
delivery_blackout_dates
product_delivery_restrictions.

Kural:
minimum basket
free delivery threshold
fixed fee
variable fee
cutoff
delivery weekdays
lead time
cold-chain allowed
carrier allowed.

Donuk/soğuk ürün için bölge bazlı satış kısıtı desteklenir.

## S. ORDER ENGINE
Order:
NEW
CONFIRMED
PREPARING
READY
DISPATCHED
DELIVERED
CANCELLED
RETURN_REQUESTED
RETURNED.

Her state change audit + customer notification event üretir.

Sipariş sonrası:
confirmation email
hazırlık
sevkiyat
SMS/e-mail
teslim edildi.

## T. RETURNS
Return request:
order_item
reason
photo/evidence optional
request_at
eligibility
status
refund_method
refund_amount.

Soğuk zincir / iadesi mümkün olmayan kategori kuralları admin tarafından policy olarak tanımlanır.

## U. LOYALTY
Opsiyonel Okyanus sadakat:
wallet balance
annual spend
tier
earn rules
redeem rules
excluded categories
expiration.

Tier ve puan oranları tamamen Okyanus admininden tanımlanır.

## V. FAVORITES / ALERTS
Favori ürün
Fiyat alarmı
Stok gelince haber ver
Tekrar sipariş.

Notification channels:
email
SMS connector when available
browser push optional.

## W. SEARCH ENGINE
Index:
name
sku
brand
category
tags
synonyms
pack.

Autocomplete groups:
Products
Categories
Brands
Ready Lists.

No-result event admin analytics'e yazılır.

## X. FILTER ENGINE
Category-specific schema.
Örnek:
brand
price
stock
discount
new
unit
pack
dietary
cold_chain.

URL query-state SEO kontrollü olur.

## Y. BRAND SYSTEM
Brand:
name
slug
logo
hero
description
seo
active.

Brand landing:
banner
description
products
categories
campaigns.

## Z. READY LIST / COMBINATIONS
Restoran tipi listeler:
Burger
Pizza
Cafe
Kahvaltı
Deniz Ürünleri
Pastane vb.

Liste:
ürünler
önerilen miktarlar
tek tıkla sepete ekleme
müşteri segmenti
admin sıralama.

## AA. CONTACT / SUPPORT
Public:
İletişim
SSS
Sipariş/Kargo
İade
Güvenlik
Bize Ulaşın.

Contact form:
name
surname
email
phone
subject/category
message
consent
status.

Mesaj mevcut ZAMAN Message Center'a akar.

## AB. WHATSAPP
Ana modül değildir.
Sadece çalışan ve doğrulanmışsa küçük destek aksiyonu.
Admin config:
enabled
number
prefill
hours.
Kapalıysa DOM'a render edilmez.

## AC. NEWSLETTER / MARKETING CONSENT
E-bülten:
email + KVKK/ileti consent.
Consent history timestamp/ip hash/policy_version ile tutulur.

Marketing preferences:
email
sms
call
browser push.

## AD. WEB PUSH
Opsiyonel:
kampanya bildirimi
stok bildirimi
fiyat alarmı.
Explicit opt-in.
Admin send preview/test.

## AE. İÇERİK STÜDYO
Ana satış navigasyonunda görünmez.
İçerik:
Dijital Menü
Fotoğrafla Teklif
ÇEŞNİ
COST
COST Radar
Akademi
Kolay Reçete
legacy/experimental modules.

Studio dashboard:
module card
status
permission
open route
help.

## AF. MEDIA LIBRARY
Upload
replace
archive
crop
focal point
alt text
tag
search
usage references
orphan detection
duplicate hash
WebP/AVIF derivative
original preserve.

Asset types:
product
banner
category
brand
campaign
content.

## AG. ADMIN CONTROL PLANE
Dashboard:
sales/quote/order KPI
pending quotes
messages
photo inquiries
low stock
campaign health
media errors.

Products:
full CRUD + bulk import/export.

Categories:
tree editor + drag sort.

Brands:
CRUD.

Prices:
list/sale/customer/group/history.

Inventory:
status/qty/import.

Banners:
schedule/desktop/mobile/preview.

Campaigns:
rules/eligibility/test.

Orders:
state lifecycle.

Quotes:
existing B2B quote lifecycle.

Customers:
company/profile/price group/addresses.

Delivery:
zones/districts/fees/schedules.

Media:
library.

Content Studio:
module visibility.

SEO:
route/canonical/index/sitemap/redirect.

Support:
messages/returns.

Audit:
immutable action log.

## AH. ADMIN ROLES
owner
admin
catalog_editor
pricing_manager
campaign_manager
order_operator
support
seo_editor
viewer.

RBAC endpoint/action levelinde uygulanır.

## AI. CORE DATA TABLES
products
product_variants
product_media
categories
brands
price_lists
customer_prices
price_history
inventory
banners
campaigns
campaign_rules
campaign_products
campaign_redemptions
customers
customer_addresses
customer_segments
carts
cart_items
quotes
quote_items
orders
order_items
order_events
delivery_zones
delivery_districts
delivery_rules
returns
favorites
stock_alerts
price_alerts
loyalty_wallets
loyalty_events
media_assets
support_messages
newsletter_subscriptions
consent_log
content_modules
audit_log.

## AJ. API SURFACE
Public read:
GET /api/catalog
GET /api/categories
GET /api/products/:slug
GET /api/brands
GET /api/search
GET /api/campaigns
GET /api/delivery/availability

Customer:
POST /api/cart
PATCH /api/cart/items
POST /api/checkout
GET /api/account/orders
GET /api/account/quotes
POST /api/favorites
POST /api/alerts/stock
POST /api/alerts/price

Preserved:
POST /api/quote
POST /api/contact
POST /api/photo-inquiries

Admin:
CRUD /api/admin/products
/api/admin/categories
/api/admin/prices
/api/admin/banners
/api/admin/campaigns
/api/admin/customers
/api/admin/orders
/api/admin/delivery
/api/admin/media
/api/admin/content-modules
/api/admin/seo.

## AK. EVENT / OUTBOX
Critical writes create outbox events:
QUOTE_CREATED
ORDER_CREATED
ORDER_STATUS_CHANGED
CONTACT_CREATED
PHOTO_INQUIRY_CREATED
PRICE_CHANGED
STOCK_CHANGED
CAMPAIGN_ACTIVATED
RETURN_CREATED.

Email/SMS/webhook delivery is retriable and does not roll back the business record.

## AL. SEO
Product pages
Category pages
Subcategory pages
Brand pages
Campaign index policy
Breadcrumb schema
Product schema
Organization/local evidence only when verified
canonical
sitemap
robots
redirect graph
existing 200 EDT SEO routes remapped to commerce destinations.

## AM. ANALYTICS
Events:
search
no_result_search
category_view
product_view
add_to_cart
add_to_quote
cart_view
checkout_start
quote_submit
order_complete
campaign_view
campaign_activate
banner_click
contact_submit
stock_alert
price_alert.

No PII in analytics payload.

## AN. RESPONSIVE
Desktop:
mega menu
4/5-column dense card grid
sticky cart summary optional.

Tablet:
drawer categories
2/3-column grid.

Mobile:
sticky search
horizontal category chips
swipe hero
2-column compact products
bottom nav:
Ana Sayfa / Kategoriler / Ara / Sepet-Teklif / Hesabım.

No horizontal overflow.
Touch target minimum 44px.

## AO. PERFORMANCE
first banner optimized
lazy media
responsive srcset
WebP/AVIF
edge cache catalog
cache invalidation on publish
customer prices no shared cache
search debounce
pagination/infinite-load with canonical pagination support
skeleton states
image error fallback.

## AP. ACCESSIBILITY
semantic headings
keyboard menus
aria carousel controls
visible focus
alt text
form labels/errors
color contrast
reduced-motion support.

## AQ. SECURITY
CSRF
origin enforcement
session security
rate limits
input validation
RBAC
upload MIME/signature checks
XSS escaping
CSP
security headers
audit log
secret isolation
D1 parameter binding
idempotency for checkout/order.

## AR. LEGAL / CONSENT
KVKK
membership terms
sales terms
privacy/security
delivery terms
return policy
marketing consent
consent version history.

Text is Okyanus-specific and legally reviewed before production.

## AS. OBSERVABILITY
/health
structured logs
request id
error rate
email delivery failures
quote/order conversion
search no-result
image failures
campaign rule errors.

## AT. BACKUP / ROLLBACK
Before production:
DENIZ source backup
ZAMAN source backup
D1 backup
binding inventory
deployment version record.

Rollback triggers:
quote failure
email failure
contact/message failure
photo failure
auth failure
catalog severe regression
checkout/order data corruption
SEO severe regression.

## AU. TEST MATRIX
Desktop 1440/1280
Tablet 1024/768
Mobile 430/390/360

Functional:
search
category
product
price
campaign
cart
quote
checkout
account
delivery
contact
alerts
admin CRUD
media
SEO.

Real production evidence required before PASS.

## AV. DELIVERY PHASES
Phase 0: schema + feature flags + branch isolation.
Phase 1: commerce shell/header/search/navigation.
Phase 2: category/catalog/product cards.
Phase 3: product detail/media.
Phase 4: homepage rails/banner/fırsat countdown.
Phase 5: campaign/price/customer price.
Phase 6: cart/quote hybrid.
Phase 7: account/customer.
Phase 8: delivery.
Phase 9: order/return/notification.
Phase 10: Content Studio migration.
Phase 11: SEO mapping.
Phase 12: mobile/tablet.
Phase 13: staging.
Phase 14: controlled production.

## AW. NON-NEGOTIABLE REGRESSION LOCKS
Current working:
email
message center
photo inquiry
quote
membership
Digital Menu route
D1 data
ZAMAN auth
SEO inventory
remain protected until equivalent smoke evidence passes.

## AX. COPYRIGHT / EXTERNAL DATA RULE
Bonservis is used only as UX/feature research.
Do not copy their source code, branding, proprietary text, or unlicensed media.
Product media must be owned/licensed/authorized.
Competitor prices may be captured for internal research where lawful, but are not automatically republished as Okyanus sale prices.
