import test from "node:test";
import assert from "node:assert/strict";
import {createUser,normalizeEmail} from "../packages/core/src/identity.mjs";
import {verifyPassword} from "../packages/core/src/password.mjs";
import {issueSession,isSessionActive,hashToken} from "../packages/core/src/session.mjs";
import {createCompany,createBusiness,createSupplier,createMembership} from "../packages/core/src/tenancy.mjs";
import {assertMfa,requiresMfa} from "../packages/core/src/mfa-policy.mjs";

test("email normalizes",()=>assert.equal(normalizeEmail("  USER@Example.COM "),"user@example.com"));
test("invalid email rejected",()=>assert.throws(()=>normalizeEmail("bad"),/EMAIL_INVALID/));

test("password is hashed and verified",()=>{
  const u=createUser({email:"a@example.com",password:"VeryStrong!123"});
  assert.notEqual(u.passwordHash,"VeryStrong!123");
  assert.equal(verifyPassword("VeryStrong!123",u.passwordHash),true);
  assert.equal(verifyPassword("wrong-password",u.passwordHash),false);
});

test("session stores hash, not raw token",()=>{
  const {token,record}=issueSession({userId:"usr_test",now:0,ttlSeconds:60});
  assert.notEqual(record.tokenHash,token);
  assert.equal(record.tokenHash,hashToken(token));
  assert.equal(isSessionActive(record,30000),true);
  assert.equal(isSessionActive(record,61000),false);
});

test("tenancy objects begin safely",()=>{
  const co=createCompany({legalName:"Test Ltd",now:"2026-09-28T00:00:00.000Z"});
  assert.equal(co.status,"DRAFT");
  assert.equal(createBusiness({companyId:co.id}).status,"DRAFT");
  assert.equal(createSupplier({companyId:co.id}).verificationStatus,"UNVERIFIED");
  assert.equal(createMembership({userId:"u",organizationType:"BUSINESS",organizationId:"b"}).status,"INVITED");
});

test("sensitive admin actions require MFA",()=>{
  assert.equal(requiresMfa("admin.configuration.manage"),true);
  assert.throws(()=>assertMfa({permission:"admin.configuration.manage",session:{mfaLevel:0}}),/MFA_REQUIRED/);
  assert.doesNotThrow(()=>assertMfa({permission:"admin.configuration.manage",session:{mfaLevel:1}}));
});
