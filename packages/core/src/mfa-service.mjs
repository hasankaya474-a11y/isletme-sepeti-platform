import {newTotpSecret,verifyTotp} from "./mfa-totp.mjs";
import {newId} from "./id.mjs";
export class MfaService{
 constructor(store){this.store=store;}
 beginTotp({userId}){const secret=newTotpSecret();return {enrollmentId:newId("mfaen"),userId,secret};}
 confirmTotp({userId,secret,code,now=Date.now()}){
  if(!verifyTotp(secret,code,{now}))throw new Error("MFA_CODE_INVALID");
  const row={id:newId("mfa"),userId,methodType:"TOTP",secret,enabledAt:new Date(now).toISOString(),revokedAt:null};
  this.store.insert("mfa",row);return {...row,secret:undefined};
 }
 hasActiveMfa(userId){return this.store.find("mfa",x=>x.userId===userId&&!x.revokedAt).length>0;}
}
