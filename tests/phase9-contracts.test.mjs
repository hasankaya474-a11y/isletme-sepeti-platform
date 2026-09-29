import test from "node:test";
import assert from "node:assert/strict";
import {PHASE9_EVENTS,phase9Event} from "../packages/core/src/phase9-events.mjs";
import {PHASE9_UI_STATES,PHASE9_RESPONSIVE} from "../apps/buyer/src/phase9-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";

test("phase9 events and responsive UX contracts are explicit",()=>{
 assert.equal(phase9Event({type:PHASE9_EVENTS.RECEIVING_COMPLETED,resourceType:"receiving",resourceId:"r",actorId:"u"}).type,"receiving.completed");
 assert.throws(()=>phase9Event({type:"x",resourceType:"x",resourceId:"1",actorId:"u"}),/PHASE9_EVENT_TYPE_INVALID/);
 assert.match(PHASE9_UI_STATES.deliveryLoading.title,/yükleniyor/);
 assert.equal(PHASE9_RESPONSIVE.mobile.receiving,"stacked-items");assert.equal(PHASE9_RESPONSIVE.desktop.delivery,"split-panel");
 assert.equal(ADMIN_A11Y.visibleFocus,true);
});
