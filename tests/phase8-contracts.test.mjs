import test from "node:test";
import assert from "node:assert/strict";
import {PHASE8_EVENTS,phase8Event} from "../packages/core/src/phase8-events.mjs";
import {PHASE8_UI_STATES,PHASE8_RESPONSIVE} from "../apps/buyer/src/phase8-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";

test("phase8 event and UX contracts are explicit",()=>{
 assert.equal(phase8Event({type:PHASE8_EVENTS.ORDER_CREATED,resourceType:"order",resourceId:"o",actorId:"u"}).type,"order.created");
 assert.throws(()=>phase8Event({type:"x",resourceType:"x",resourceId:"1",actorId:"u"}),/PHASE8_EVENT_TYPE_INVALID/);
 assert.match(PHASE8_UI_STATES.orderLoading.title,/yükleniyor/);
 assert.equal(PHASE8_RESPONSIVE.mobile.timeline,"vertical");
 assert.equal(PHASE8_RESPONSIVE.desktop.orders,"dense-table");
 assert.equal(ADMIN_A11Y.visibleFocus,true);
});
