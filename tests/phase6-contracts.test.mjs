import test from "node:test";
import assert from "node:assert/strict";
import {PHASE6_EVENTS,phase6Event} from "../packages/core/src/phase6-events.mjs";
import {PHASE6_UI_STATES,PHASE6_RESPONSIVE} from "../apps/buyer/src/phase6-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";

test("phase6 contracts define events UI states and responsive behavior",()=>{
 assert.equal(phase6Event({type:PHASE6_EVENTS.QUOTE_SUBMITTED,resourceType:"quote",resourceId:"q",actorId:"u"}).type,"quote.submitted");
 assert.throws(()=>phase6Event({type:"x",resourceType:"x",resourceId:"1",actorId:"u"}),/PHASE6_EVENT_TYPE_INVALID/);
 assert.match(PHASE6_UI_STATES.rfqLoading.title,/yükleniyor/);
 assert.equal(PHASE6_RESPONSIVE.mobile.comparison,"stacked-cards");
 assert.equal(PHASE6_RESPONSIVE.desktop.comparison,"comparison-grid");
 assert.equal(ADMIN_A11Y.visibleFocus,true);
});
