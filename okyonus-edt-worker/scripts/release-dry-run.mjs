import fs from 'node:fs';

const required = [
  'src/deniz-worker.js',
  'src/zaman-admin-worker.js',
  'src/commerce-v2.js',
  'src/commerce-admin-v2.js',
  'migrations/001_sales_mode.sql',
  'migrations/003_commerce_v2.sql',
  'migrations/004_commerce_extended.sql',
  'migrations/005_product_meta.sql',
  'migrations/006_commerce_control_plane.sql',
  'DEPLOYMENT_CHECKLIST.md',
  'docs/WORKER_COPY_RUNBOOK.md',
  'docs/OKYANUS_EDT_COMMERCE_V2_FINAL_RELEASE_MANIFEST_2026-09-30.md',
  'docs/OKYANUS_EDT_FINAL_DEPLOYMENT_BUNDLE_INDEX_2026-09-30.md'
];

for (const file of required) {
  if (!fs.existsSync(new URL('../' + file, import.meta.url))) {
    console.error('MISSING:', file);
    process.exitCode = 1;
  }
}
if (process.exitCode) process.exit();

console.log('OKYANUS EDT COMMERCE V2 RELEASE DRY RUN');
console.log('No Cloudflare or D1 changes are performed by this script.');
console.log('');
console.log('1) Verify package');
console.log('   npm run verify');
console.log('');
console.log('2) Create environment-specific Wrangler files from examples');
console.log('   cp wrangler.deniz.toml.example wrangler.deniz.staging.toml');
console.log('   cp wrangler.zaman.toml.example wrangler.zaman.staging.toml');
console.log('   # Fill staging-only DB/R2/email bindings. Do not use production IDs.');
console.log('');
console.log('3) Required staging migration order');
console.log('   npx wrangler d1 execute <STAGING_DB_NAME> --file=migrations/001_sales_mode.sql');
console.log('   npx wrangler d1 execute <STAGING_DB_NAME> --file=migrations/003_commerce_v2.sql');
console.log('   npx wrangler d1 execute <STAGING_DB_NAME> --file=migrations/004_commerce_extended.sql');
console.log('   npx wrangler d1 execute <STAGING_DB_NAME> --file=migrations/005_product_meta.sql');
console.log('   npx wrangler d1 execute <STAGING_DB_NAME> --file=migrations/006_commerce_control_plane.sql');
console.log('');
console.log('4) Staging deploy commands');
console.log('   npx wrangler deploy --config wrangler.deniz.staging.toml');
console.log('   npx wrangler deploy --config wrangler.zaman.staging.toml');
console.log('');
console.log('5) Production remains blocked until staging smoke-test evidence and backup/rollback gates pass.');
console.log('   Use docs/WORKER_COPY_RUNBOOK.md and DEPLOYMENT_CHECKLIST.md.');
