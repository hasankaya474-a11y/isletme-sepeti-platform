import {randomBytes} from "node:crypto";
import {hashToken} from "./session.mjs";
import {newId} from "./id.mjs";
export function issueEmailVerification({userId,ttlSeconds=24*60*60,now=Date.now()}){
 const token=randomBytes(32).toString("base64url");
 return {token,record:{id:newId("ev"),userId,tokenHash:hashToken(token),createdAt:new Date(now).toISOString(),expiresAt:new Date(now+ttlSeconds*1000).toISOString(),consumedAt:null}};
}
export function canVerifyEmail(record,token,now=Date.now()){return Boolean(record&&!record.consumedAt&&Date.parse(record.expiresAt)>now&&record.tokenHash===hashToken(token));}
