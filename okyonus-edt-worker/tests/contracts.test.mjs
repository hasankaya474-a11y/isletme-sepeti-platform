import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

for(const [name,file] of [
 ['catalog migration preserves seafood, exact EDT data, admin edits and transaction rollback','verify-catalog-migration.mjs'],
 ['integrated worker serves exact paginated catalog, categories, detail, seafood and selected home products','verify-integrated-worker.mjs']
])test(name,()=>{
 const result=spawnSync(process.execPath,[new URL(file,import.meta.url).pathname],{cwd:new URL('..',import.meta.url),encoding:'utf8',timeout:30000});
 assert.ifError(result.error);
 assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
});
