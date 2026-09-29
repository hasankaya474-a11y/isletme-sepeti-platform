import test from "node:test";
import assert from "node:assert/strict";
import {PHASE7_EVENTS,phase7Event} from "../packages/core/src/phase7-events.mjs";
import {PHASE7_UI_STATES,PHASE7_RESPONSIVE} from "../apps/buyer/src/phase7-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";

test("phase7 events and UX contracts are explicit",()=>{
 assert.equal(phase7Event({type:PHASE7_EVENTS.REQUISITION_PO_READY,resourceType:"requisition",resourceId:"r",actorId:"u"}).type,"requisition.po_ready");
 assert.throws(()=>phase7Event({type:"x",resourceType:"x",resourceId:"1",actorId:"u"}),/PHASE7_EVENT_TYPE_INVALID/);
 assert.match(PHASE7_UI_STATES.cartLoading.title,/yükleniyor/);
 assert.equal(PHASE7_RESPONSIVE.mobile.cart,"stacked-lines");
 assert.equal(PHASE7_RESPONSIVE.desktop.summary,"side-panel");
 assert.equal(ADMIN_A11Y.keyboardNavigation,true);
});
