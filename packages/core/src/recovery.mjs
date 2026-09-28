import {randomBytes} from "node:crypto";
import {hashToken} from "./session.mjs";
import {newId} from "./id.mjs";

export function issueRecoveryChallenge({userId,ttlSeconds=15*60,now=Date.now()}){
  const token=randomBytes(32).toString("base64url");
  return {token,record:{id:newId("rec"),userId,tokenHash:hashToken(token),createdAt:new Date(now).toISOString(),expiresAt:new Date(now+ttlSeconds*1000).toISOString(),consumedAt:null}};
}
export function canConsumeRecovery(record,token,now=Date.now()){
  return Boolean(record&&!record.consumedAt&&Date.parse(record.expiresAt)>now&&record.tokenHash===hashToken(token));
}
