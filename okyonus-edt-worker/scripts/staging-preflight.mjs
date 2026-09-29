import fs from 'node:fs';

const checklist = fs.readFileSync(new URL('../DEPLOYMENT_CHECKLIST.md', import.meta.url), 'utf8');
const runbook = fs.readFileSync(new URL('../docs/WORKER_COPY_RUNBOOK.md', import.meta.url), 'utf8');

const mustContain = [
  'Homepage renders new sales-first face',
  'Product catalog loads',
  'Product search works',
  'Managed banner carousel',
  '200 EDT links render as 4 x 50 modules',
  'KVKK + cookie preference UI persists choice',
  'Newsletter explicit-consent signup'
  'POST /api/quote creates request',
  'Quote notification email still arrives',
  'POST /api/contact stores message before notification',
  'Photo upload creates request number',
  'Member login works',
  'Digital Menu Studio opens',
  'Admin login',
  'CSRF protections',
  'Message Center',
  'Product/quote B2B admin',
  'price history',
  '1440 desktop',
  '1024 tablet',
  '430 mobile',
  '390 mobile',
  '360 mobile',
  'Only then replace production route/code'
];

const missing = mustContain.filter(x => !checklist.includes(x) && !runbook.includes(x));
if (missing.length) {
  console.error('PRE-FLIGHT FAIL. Missing smoke-test locks:');
  for (const x of missing) console.error('-', x);
  process.exit(1);
}

const steps = [
  ['DENIZ_HOME', 'GET /', '200 + Commerce V2 sales-first homepage'],
  ['DENIZ_CATALOG', 'GET /urunler', '200 + catalog renders'],
  ['DENIZ_SEARCH', 'GET /urunler?q=patates', 'filtered catalog result'],
  ['DENIZ_BANNER', 'managed banner carousel', 'auto + prev/next + swipe + keyboard PASS'],
  ['DENIZ_CATEGORY_MEDIA', 'category media', 'managed images + fallback icons PASS'],
  ['DENIZ_CAMPAIGN_PRICE', 'campaign pricing', 'target + discount rule PASS'],
  ['DENIZ_QTY_RULES', 'product/cart quantity', 'min order + quantity step PASS'],
  ['DENIZ_CONTACT_OWNER', 'contact settings', 'name + phone + WhatsApp + email PASS'],
  ['DENIZ_COOKIE', 'KVKK/cookie preferences', 'choice persists locally'],
  ['DENIZ_SEO_200', 'homepage SEO guide', '4 modules x 50 active links'],
  ['DENIZ_NEWSLETTER', 'POST /api/newsletter', 'explicit consent + Admin visibility'],
  ['DENIZ_QUOTE_PAGE', 'GET /sepet', '200 + quote form renders'],
  ['DENIZ_QUOTE_API', 'POST /api/quote', 'request number + preserved email flow'],
  ['DENIZ_CONTACT', 'POST /api/contact', 'message stored before notification'],
  ['DENIZ_PHOTO', 'photo inquiry flow', 'request number + notification'],
  ['DENIZ_MEMBER', 'member login', 'session established'],
  ['DENIZ_MENU', 'Digital Menu', 'open/publish/update/delete + public QR'],
  ['DENIZ_SEO', 'representative SEO routes', 'expected route/noindex behavior'],
  ['ZAMAN_AUTH', 'admin login', 'session + CSRF PASS'],
  ['ZAMAN_MESSAGES', 'Message Center', 'read/update workflow PASS'],
  ['ZAMAN_PHOTO', 'Photo request workflow', 'controlled transfer/delete PASS'],
  ['ZAMAN_B2B', 'B2B quote/admin', 'list/detail/status/pricing/order PASS'],
  ['ZAMAN_PRODUCTS', 'product admin', 'create/edit/toggle/price-history PASS'],
  ['ZAMAN_STUDIO', 'Studio/media', 'management PASS'],
  ['ZAMAN_FLAGS', 'Sales Mode', 'flags persist + audit entry'],
  ['RESPONSIVE_1440', '1440px', 'no overflow/regression'],
  ['RESPONSIVE_1280', '1280px', 'no overflow/regression'],
  ['RESPONSIVE_1024', '1024px', 'tablet PASS'],
  ['RESPONSIVE_768', '768px', 'tablet PASS'],
  ['RESPONSIVE_430', '430px', 'mobile PASS'],
  ['RESPONSIVE_390', '390px', 'mobile PASS'],
  ['RESPONSIVE_360', '360px', 'mobile PASS']
];

console.log('OKYANUS EDT STAGING PREFLIGHT MATRIX');
console.log('No network, Cloudflare, D1, email, R2 or production action is performed.');
console.log('');
for (const [id, action, expected] of steps) {
  console.log('[ ]', id.padEnd(18), action, '=>', expected);
}
console.log('');
console.log('PASS RULE: every row above requires real staging evidence before production.');
console.log('PRODUCTION RULE: backup + rollback + staging evidence must all exist first.');
