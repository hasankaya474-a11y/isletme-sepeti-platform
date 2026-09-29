# Okyanus EDT DENİZ / ZAMAN Release Checklist

## Before copy
- [ ] Export current DENİZ Worker source
- [ ] Export current ZAMAN Worker source
- [ ] Record current Worker versions
- [ ] Record all binding names without exposing secret values
- [ ] Back up shared D1
- [ ] Confirm rollback source is available

## D1
- [ ] Run `migrations/001_sales_mode.sql`
- [ ] Run additive Commerce V2 migrations `migrations/003_commerce_v2.sql` and `migrations/004_commerce_extended.sql`
- [ ] Verify `oky_module_flags_v1`
- [ ] Confirm DIGITAL_MENU = ACTIVE
- [ ] Confirm COST / COST_RADAR / ACADEMY / CESNI / EASY_RECIPE / ABOUT = HIDDEN

## DENİZ regression
- [ ] Homepage renders new sales-first face
- [ ] Product catalog loads
- [ ] Product search works
- [ ] Quote list works
- [ ] POST /api/quote creates request
- [ ] Quote notification email still arrives
- [ ] POST /api/contact stores message before notification
- [ ] Contact email still arrives
- [ ] Photo upload creates request number
- [ ] Photo notification still works
- [ ] WhatsApp public module remains HIDDEN until separately verified and intentionally enabled
- [ ] Member login works
- [ ] Digital Menu Studio opens
- [ ] 30 themes are selectable
- [ ] 30 templates are selectable
- [ ] Digital Menu publish/update/delete works
- [ ] Published QR menu renders selected preset
- [ ] Hidden modules return unavailable/noindex
- [ ] Help lists active modules only
- [ ] SEO product/category/index routes return expected status
- [ ] sitemap/robots contain no hidden public tool routes

## ZAMAN regression
- [ ] Admin login
- [ ] CSRF protections
- [ ] Message Center
- [ ] Photo request controlled transfer/delete
- [ ] Product/quote B2B admin
- [ ] Studio/media
- [ ] Satış Modu view
- [ ] Module toggle persists in D1
- [ ] Audit entry created for module change

## Responsive
- [ ] 1440 desktop
- [ ] 1280 desktop
- [ ] 1024 tablet
- [ ] 768 tablet
- [ ] 430 mobile
- [ ] 390 mobile
- [ ] 360 mobile

## Production gate
- [ ] Closed real test complete
- [ ] Email evidence captured
- [ ] Contact/message evidence captured
- [ ] Photo evidence captured
- [ ] Quote evidence captured
- [ ] SEO redirect sample verified
- [ ] Rollback rehearsed
- [ ] Only then replace production route/code

## Code completion status
- [x] Commerce V2 public storefront code complete
- [x] Admin-managed banner/category/section/brand/campaign/delivery/help flows wired
- [x] Product create/edit/soft-delete and price history controls wired
- [x] Cart/quote responsive integrity checks present
- [x] Mobile/tablet regression locks present
- [ ] Production deployment performed
- [ ] Production D1 migrations performed
