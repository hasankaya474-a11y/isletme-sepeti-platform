import test from "node:test";import assert from "node:assert/strict";
import {PHASE11_EVENTS} from "../packages/core/src/phase11-events.mjs";
import {PHASE11_UI_STATES,PHASE11_RESPONSIVE} from "../apps/admin/src/phase11-ui-contract.mjs";
import {ADMIN_A11Y} from "../apps/admin/src/accessibility-contract.mjs";
test("phase11 event names are explicit",()=>{assert.equal(PHASE11_EVENTS.LEDGER_APPENDED,"ledger.entry.appended");assert.equal(PHASE11_EVENTS.RECONCILIATION_RESOLVED,"reconciliation.resolved");});
test("phase11 UI states and responsive contracts exist",()=>{assert.match(PHASE11_UI_STATES.loading.title,/yükleniyor/i);assert.equal(PHASE11_RESPONSIVE.mobile.actions,"sticky");assert.equal(ADMIN_A11Y.keyboardNavigation,true);assert.equal(ADMIN_A11Y.minTouchTargetPx>=44,true);});