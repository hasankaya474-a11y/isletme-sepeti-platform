import test from "node:test";
import assert from "node:assert/strict";
import {PHASE4_EVENTS,phase4Event} from "../packages/core/src/phase4-events.mjs";
import {PHASE4_UI_STATES,PHASE4_RESPONSIVE} from "../apps/admin/src/phase4-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";
import {renderPhase4Operations} from "../apps/admin/src/phase4-operations-page.mjs";

test("phase4 event contracts are explicit and reject unknown event types",()=>{
  const e=phase4Event({type:PHASE4_EVENTS.STOCK_RESERVED,resourceType:"stock_reservation",resourceId:"r1",actorId:"u1",payload:{quantity:2}});
  assert.equal(e.type,"stock.reserved");
  assert.throws(()=>phase4Event({type:"unknown",resourceType:"x",resourceId:"1",actorId:"u"}),/PHASE4_EVENT_TYPE_INVALID/);
});

test("phase4 UI defines loading empty error forbidden states",()=>{
  assert.match(PHASE4_UI_STATES.loading.title,/yükleniyor/i);
  assert.match(PHASE4_UI_STATES.empty.title,/Henüz/);
  assert.match(PHASE4_UI_STATES.error.body,/Değişiklik yapılmadı/);
  assert.match(PHASE4_UI_STATES.forbidden.title,/yetkiniz yok/);
});

test("phase4 inherits responsive and accessibility baselines",()=>{
  assert.equal(PHASE4_RESPONSIVE.mobile.primaryActions,"sticky");
  assert.equal(PHASE4_RESPONSIVE.tablet.tables,"adaptive");
  assert.equal(PHASE4_RESPONSIVE.desktop.layout,"control-grid");
  assert.equal(ADMIN_A11Y.keyboardNavigation,true);
  assert.equal(ADMIN_A11Y.visibleFocus,true);
  assert.equal(ADMIN_A11Y.minTouchTargetPx>=44,true);
});

test("phase4 admin renderer remains semantic and escapes untrusted content",()=>{
  const h=renderPhase4Operations({priceBooks:[{name:"<script>x</script>"}],taxProfiles:[{}]});
  assert.match(h,/aria-labelledby="phase4-title"/);
  assert.match(h,/<h1 id="phase4-title">/);
  assert.doesNotMatch(h,/<script>/);
});
