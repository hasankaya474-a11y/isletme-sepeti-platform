import test from "node:test";
import assert from "node:assert/strict";
import {securityEvent,privacyHash} from "../packages/core/src/security-events.mjs";
import {shouldReauthenticate} from "../packages/core/src/session-policy.mjs";
import {createChangeRequest,approveChange} from "../packages/core/src/four-eyes.mjs";
import {transitionMembership} from "../packages/core/src/membership-policy.mjs";
import {adminCapabilityExists} from "../apps/admin/src/control-contracts.mjs";

test("security telemetry hashes network/device values",()=>{
  const e=securityEvent({eventType:"LOGIN_FAILURE",outcome:"FAILURE",ip:"1.2.3.4",device:"browser"});
  assert.equal(e.ipHash,privacyHash("1.2.3.4"));
  assert.notEqual(e.ipHash,"1.2.3.4");
});

test("expired or insufficient MFA session reauthenticates",()=>{
  assert.equal(shouldReauthenticate({session:{expiresAt:"2026-09-28T12:00:00.000Z",mfaLevel:1},now:Date.parse("2026-09-28T13:00:00.000Z")}),true);
  assert.equal(shouldReauthenticate({session:{expiresAt:"2026-09-28T14:00:00.000Z",mfaLevel:0},now:Date.parse("2026-09-28T13:00:00.000Z"),requiredMfaLevel:1}),true);
});

test("four-eyes forbids self approval",()=>{
  const r=createChangeRequest({requestedBy:"u1",actionCode:"security.role.change",resourceType:"membership",resourceId:"m1"});
  assert.equal(r.status,"PENDING_APPROVAL");
  assert.throws(()=>approveChange(r,{approverId:"u1"}),/SELF_APPROVAL/);
  assert.equal(approveChange(r,{approverId:"u2"}).status,"APPROVED");
});

test("membership state machine blocks resurrection after revoke",()=>{
  assert.equal(transitionMembership({status:"ACTIVE"},"SUSPENDED").status,"SUSPENDED");
  assert.throws(()=>transitionMembership({status:"REVOKED"},"ACTIVE"),/INVALID_MEMBERSHIP_TRANSITION/);
});

test("admin has codeless identity controls contract",()=>{
  assert.equal(adminCapabilityExists("memberships","assign_role"),true);
  assert.equal(adminCapabilityExists("sessions","revoke_all"),true);
});
