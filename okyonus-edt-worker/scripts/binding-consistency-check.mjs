import fs from 'node:fs';

const matrix = fs.readFileSync(new URL('../docs/BINDINGS_MATRIX.md', import.meta.url), 'utf8');
const zaman = fs.readFileSync(new URL('../src/zaman-admin-worker.js', import.meta.url), 'utf8');
const denizStaging = fs.readFileSync(new URL('../wrangler.deniz.staging.example.toml', import.meta.url), 'utf8');
const zamanStaging = fs.readFileSync(new URL('../wrangler.zaman.staging.example.toml', import.meta.url), 'utf8');

const requiredMatrix = [
  '`DB`',
  '`PHOTO_TEMP`',
  '`EMAIL`',
  '`MAIL_FROM`',
  '`MAIL_TO` / `ADMIN_MAIL_TO`',
  '`MEDIA_STORE`',
  '`SESSION_PEPPER`',
  '`BOOTSTRAP_TOKEN`',
  '`Veritabanı`',
  '`Veritabani`',
  '`FOTOĞRAF_TEMP`',
  '`MEDYA_MAĞAZASI`',
  '`MEDYA_DEPO`'
];

const requiredZamanSource = [
  "env.DB||env['Veritabanı']||env['Veritabani']",
  "env['FOTOĞRAF_TEMP']||env.PHOTO_TEMP",
  "env.MEDIA_STORE||env['MEDYA_MAĞAZASI']||env['MEDYA_DEPO']"
];

const requiredDenizTemplate = [
  'binding = "DB"',
  'binding = "PHOTO_TEMP"',
  'MAIL_FROM = "REPLACE_WITH_STAGING_MAIL_FROM"',
  'MAIL_TO = "REPLACE_WITH_STAGING_MAIL_TO"',
  'ADMIN_MAIL_TO = "REPLACE_WITH_STAGING_ADMIN_MAIL_TO"'
];

const requiredZamanTemplate = [
  'binding = "DB"',
  'binding = "PHOTO_TEMP"',
  'binding = "MEDIA_STORE"',
  'REQUIRE_CF_ACCESS = "true"'
];

const checks = [
  ['binding matrix', matrix, requiredMatrix],
  ['ZAMAN source aliases', zaman, requiredZamanSource],
  ['DENIZ staging template', denizStaging, requiredDenizTemplate],
  ['ZAMAN staging template', zamanStaging, requiredZamanTemplate]
];

let failed = false;
for (const [name, haystack, needles] of checks) {
  for (const needle of needles) {
    if (!haystack.includes(needle)) {
      console.error('BINDING CONSISTENCY FAIL:', name, 'missing', needle);
      failed = true;
    }
  }
}

for (const [name, toml] of [['DENIZ', denizStaging], ['ZAMAN', zamanStaging]]) {
  if (/database_id\s*=\s*"[0-9a-f-]{20,}"/i.test(toml)) {
    console.error('BINDING CONSISTENCY FAIL:', name, 'contains real-looking D1 id');
    failed = true;
  }
}

if (failed) process.exit(1);

console.log('BINDING CONSISTENCY PASS');
console.log('Canonical names, staging placeholders and ZAMAN legacy aliases are aligned.');
console.log('No Cloudflare, D1, R2, email or network action was performed.');
