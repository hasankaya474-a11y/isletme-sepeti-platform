import {newTotpSecret,verifyTotp} from "./mfa-totp.mjs";import {newId} from "./id.mjs";
export class SecureMfaService{
 constructor(store,secretBox){this.store=store;this.secretBox=secretBox;}
 begin({userId}){return {userId,secret:newTotpSecret()};}
 confirm({userId,secret,code,now=Date.now()}){if(!verifyTotp(secret,code,{now}))throw new Error("MFA_CODE_INVALID");const row={id:newId("mfa"),userId,methodType:"TOTP",secretCiphertext:this.secretBox.encrypt(secret.toString("base64url")),enabledAt:new Date(now).toISOString(),revokedAt:null};this.store.insert("mfa",row);return {id:row.id,userId,methodType:row.methodType,enabledAt:row.enabledAt};}
 verify({userId,code,now=Date.now()}){for(const m of this.store.find("mfa",x=>x.userId===userId&&!x.revokedAt)){const secret=Buffer.from(this.secretBox.decrypt(m.secretCiphertext),"base64url");if(verifyTotp(secret,code,{now}))return true;}return false;}
}
