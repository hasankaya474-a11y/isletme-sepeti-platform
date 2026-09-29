import fs from 'node:fs';

const files = {
  deniz: new URL('../wrangler.deniz.staging.example.toml', import.meta.url),
  zaman: new URL('../wrangler.zaman.staging.example.toml', import.meta.url)
};

const requiredBindings = {
  deniz: ['binding = "DB"', 'binding = "PHOTO_TEMP"', 'ENVIRONMENT = "staging"'],
  zaman: ['binding = "DB"', 'binding = "PHOTO_TEMP"', 'binding = "MEDIA_STORE"', 'ENVIRONMENT = "staging"', 'REQUIRE_CF_ACCESS = "true"']
};

let failed = false;
for (const [name, url] of Object.entries(files)) {
  const s = fs.readFileSync(url, 'utf8');
  for (const token of requiredBindings[name]) {
    if (!s.includes(token)) {
      console.error('MISSING', name, token);
      failed = true;
    }
  }
  if (!s.includes('REPLACE_WITH_STAGING_D1_NAME') || !s.includes('REPLACE_WITH_STAGING_D1_ID')) {
    console.error('STAGING D1 placeholders missing:', name);
    failed = true;
  }
  if (/database_id\s*=\s*"[0-9a-f-]{20,}"/i.test(s)) {
    console.error('REAL-LOOKING D1 ID MUST NOT BE COMMITTED:', name);
    failed = true;
  }
}
if (failed) process.exit(1);

console.log('STAGING CONFIG PREFLIGHT PASS');
console.log('DENIZ and ZAMAN templates use explicit staging placeholders and expected binding names.');
console.log('No Cloudflare, D1, R2, email or network action was performed.');
