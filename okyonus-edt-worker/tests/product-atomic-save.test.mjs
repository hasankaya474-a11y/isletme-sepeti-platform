import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('atomic product save, failure handling and binding isolation pass seven scenarios',()=>{const r=spawnSync(process.execPath,[fileURLToPath(new URL('./product-atomic-save-runner.mjs',import.meta.url))],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stdout,/PASS 7 scenarios/)});
