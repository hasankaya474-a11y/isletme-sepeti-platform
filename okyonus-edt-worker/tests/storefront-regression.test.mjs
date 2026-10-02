import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('SQLite storefront reads and actual homepage render retain exact selections, prices and DB ownership',()=>{
 const output=execFileSync(process.execPath,[fileURLToPath(new URL('./storefront-regression-runner.cjs',import.meta.url))],{encoding:'utf8'});
 assert.doesNotMatch(output,/FAIL/);
 assert.equal(output.split('\n').filter(x=>x.startsWith('PASS')).length,11);
});
