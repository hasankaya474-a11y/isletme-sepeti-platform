import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const required=[
 "docs/PRIVATE_PILOT_PLAN.md",
 "docs/DEFECT_CLOSURE_PROTOCOL.md",
 "docs/EXTERNAL_REVIEW_EVIDENCE_TEMPLATE.md",
 "docs/STAGING_PREFLIGHT_CHECKLIST.md",
 "docs/PRODUCTION_RELEASE_CHECKLIST.md",
 "docs/RELEASE_READINESS_RUNBOOK.md",
 "docs/ENGINEERING_COMPLETION.md"
];

test("final operational readiness pack exists and keeps production locked",async()=>{
 for(const path of required){
  const body=await readFile(path,"utf8");
  assert.ok(body.length>100,path+" should contain operational guidance");
 }
 const release=await readFile("docs/PRODUCTION_RELEASE_CHECKLIST.md","utf8");
 assert.match(release,/Production remains locked/i);
 assert.match(release,/PRIVATE_PILOT/);
 assert.match(release,/SECURITY_REVIEW/);
 assert.match(release,/LEGAL_REVIEW/);
 assert.match(release,/ACCOUNTING_REVIEW/);
 assert.match(release,/PRIVACY_REVIEW/);
});
