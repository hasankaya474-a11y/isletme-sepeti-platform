import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {IdentityService} from "../packages/core/src/identity-service.mjs";
import {MembershipService} from "../packages/core/src/membership-service.mjs";
import {SlidingWindowLimiter} from "../packages/core/src/rate-limit.mjs";
import {newTotpSecret,totp,verifyTotp} from "../packages/core/src/mfa-totp.mjs";
import {issueRecoveryChallenge,canConsumeRecovery} from "../packages/core/src/recovery.mjs";

test("register verify login and revoke session",()=>{
  const s=new MemoryStore(),svc=new IdentityService(s);
  const u=svc.register({email:"Owner@Example.com",password:"VeryStrong!123"});
  assert.throws(()=>svc.login({email:u.email,password:"VeryStrong!123"}),/INVALID_CREDENTIALS/);
  svc.verifyEmail(u.id,"2026-09-28T10:00:00.000Z");
  const issued=svc.login({email:u.email,password:"VeryStrong!123",now:Date.parse("2026-09-28T10:01:00.000Z")});
  assert.equal(s.get("sessions",issued.record.id).revokedAt,null);
  svc.revokeSession({sessionId:issued.record.id,actorId:u.id});
  assert.ok(s.get("sessions",issued.record.id).revokedAt);
});

test("membership invite lifecycle is audited",()=>{
  const s=new MemoryStore(),svc=new MembershipService(s);
  const m=svc.invite({actorId:"admin",userId:"u1",organizationType:"BUSINESS",organizationId:"b1"});
  assert.equal(svc.changeStatus({actorId:"admin",membershipId:m.id,to:"ACTIVE"}).status,"ACTIVE");
  assert.equal(s.find("audit",()=>true).length,2);
});

test("rate limiter blocks burst",()=>{
  const l=new SlidingWindowLimiter({limit:2,windowMs:1000});
  assert.equal(l.check("x",0).allowed,true);
  assert.equal(l.check("x",1).allowed,true);
  assert.equal(l.check("x",2).allowed,false);
});

test("totp validates current and adjacent window",()=>{
  const secret=newTotpSecret(),now=1000000;
  const code=totp(secret,{now});
  assert.equal(verifyTotp(secret,code,{now}),true);
  assert.equal(verifyTotp(secret,"000000",{now}),false);
});

test("recovery token is hashed and expires",()=>{
  const {token,record}=issueRecoveryChallenge({userId:"u",now:0,ttlSeconds:60});
  assert.notEqual(record.tokenHash,token);
  assert.equal(canConsumeRecovery(record,token,30000),true);
  assert.equal(canConsumeRecovery(record,token,61000),false);
});
