import test from "node:test";
import assert from "node:assert/strict";
import {PHASE10_EVENTS,phase10Event} from "../packages/core/src/phase10-events.mjs";
import {PHASE10_UI_STATES,PHASE10_RESPONSIVE} from "../apps/buyer/src/phase10-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";

test("phase10 event and UX contracts are explicit",()=>{
 assert.equal(phase10Event({type:PHASE10_EVENTS.INVOICE_MATCHED,resourceType:"invoice",resourceId:"i",actorId:"u"}).type,"invoice.match_completed");
 assert.throws(()=>phase10Event({type:"x",resourceType:"x",resourceId:"1",actorId:"u"}),/PHASE10_EVENT_TYPE_INVALID/);
 assert.match(PHASE10_UI_STATES.matchException.title,/uyuşmazlığı/);
 assert.equal(PHASE10_RESPONSIVE.mobile.match,"issue-cards");assert.equal(PHASE10_RESPONSIVE.desktop.invoice,"split-panel");
 assert.equal(ADMIN_A11Y.keyboardNavigation,true);
});
