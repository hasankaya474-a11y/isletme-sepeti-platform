import test from 'node:test';
import assert from 'node:assert/strict';
import { commerceAdminPage } from '../src/commerce-admin-v2.js';

test('commerce admin rendered browser script parses', async () => {
  const response = commerceAdminPage({});
  const html = await response.text();
  const start = html.indexOf('<script>');
  const end = html.indexOf('</script>', start);
  assert.ok(start >= 0 && end > start, 'admin page script block missing');
  const script = html.slice(start + 8, end);
  assert.doesNotThrow(() => new Function(script));
  assert.match(script, /const stats=document\.getElementById\('stats'\)/);
  assert.match(script, /const content=document\.getElementById\('content'\)/);
  assert.match(script, /boot\(\)/);
});
