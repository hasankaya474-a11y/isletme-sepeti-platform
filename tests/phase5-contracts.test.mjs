import test from "node:test";
import assert from "node:assert/strict";
import {PHASE5_EVENTS,phase5Event} from "../packages/core/src/phase5-events.mjs";
import {PHASE5_UI_STATES,PHASE5_RESPONSIVE} from "../apps/buyer/src/phase5-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";

test("phase5 event contract rejects unknown type",()=>{
 assert.equal(phase5Event({type:PHASE5_EVENTS.MATCH_CANDIDATE_REVIEWED,resourceType:"candidate",resourceId:"c",actorId:"u"}).type,"matching.candidate.reviewed");
 assert.throws(()=>phase5Event({type:"x",resourceType:"x",resourceId:"1",actorId:"u"}),/PHASE5_EVENT_TYPE_INVALID/);
});
test("phase5 defines buyer loading empty error states and responsive behavior",()=>{
 assert.match(PHASE5_UI_STATES.searchLoading.title,/yükleniyor/);
 assert.match(PHASE5_UI_STATES.matchEmpty.title,/aday ürün/);
 assert.equal(PHASE5_RESPONSIVE.mobile.productGridColumns,1);
 assert.equal(PHASE5_RESPONSIVE.desktop.productGridColumns,4);
 assert.equal(ADMIN_A11Y.keyboardNavigation,true);
 assert.equal(ADMIN_A11Y.minTouchTargetPx>=44,true);
});
