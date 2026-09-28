import test from "node:test";import assert from "node:assert/strict";
import {issueEmailVerification,canVerifyEmail} from "../packages/core/src/email-verification.mjs";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {MfaService} from "../packages/core/src/mfa-service.mjs";
import {totp} from "../packages/core/src/mfa-totp.mjs";
test("email verification token is hashed and expires",()=>{const {token,record}=issueEmailVerification({userId:"u",now:0,ttlSeconds:60});assert.notEqual(record.tokenHash,token);assert.equal(canVerifyEmail(record,token,30000),true);assert.equal(canVerifyEmail(record,token,61000),false);});
test("TOTP enrollment requires valid challenge",()=>{const s=new MemoryStore(),m=new MfaService(s);const e=m.beginTotp({userId:"u"});assert.throws(()=>m.confirmTotp({userId:"u",secret:e.secret,code:"000000",now:1000000}),/INVALID/);const code=totp(e.secret,{now:1000000});m.confirmTotp({userId:"u",secret:e.secret,code,now:1000000});assert.equal(m.hasActiveMfa("u"),true);});
