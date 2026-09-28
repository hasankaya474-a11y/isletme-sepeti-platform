import test from "node:test";
import assert from "node:assert/strict";
import { assertMoney, PRODUCTION_LOCKED } from "../packages/contracts/src/domain-contracts.mjs";
import { can, requirePermission } from "../packages/core/src/authorization.mjs";
import { canTransition, transitionOrder } from "../packages/core/src/order-state-machine.mjs";
import { canChangeContentState } from "../packages/core/src/content-lifecycle.mjs";

test("production starts locked", () => assert.equal(PRODUCTION_LOCKED, true));

test("money rejects float", () => assert.throws(() => assertMoney({amountMinor: 10.5, currency:"TRY"})));
test("money accepts integer minor units", () => assert.deepEqual(assertMoney({amountMinor:1050,currency:"TRY"}), {amountMinor:1050,currency:"TRY"}));

test("authorization is default deny", () => {
  assert.equal(can({grants:[], permission:"order.read_own", requiredScope:"BUSINESS:a"}), false);
  assert.throws(() => requirePermission({grants:[], permission:"order.read_own", requiredScope:"BUSINESS:a"}), /FORBIDDEN/);
});

test("scoped grant works and cross scope fails", () => {
  const grants=[{permission:"order.read_own",scope:"BUSINESS:a"}];
  assert.equal(can({grants,permission:"order.read_own",requiredScope:"BUSINESS:a"}),true);
  assert.equal(can({grants,permission:"order.read_own",requiredScope:"BUSINESS:b"}),false);
});

test("order state machine blocks invalid jump", () => {
  assert.equal(canTransition("NEW","COMPLETED"),false);
  assert.throws(()=>transitionOrder({state:"NEW"},"COMPLETED"),/INVALID_ORDER_TRANSITION/);
  assert.equal(transitionOrder({state:"WAITING"},"ACCEPTED","2026-09-28T00:00:00.000Z").state,"ACCEPTED");
});

test("content lifecycle supports controlled publishing", () => {
  assert.equal(canChangeContentState("DRAFT","PUBLISHED"),false);
  assert.equal(canChangeContentState("REVIEW","PUBLISHED"),true);
});
