import {createHmac,randomBytes,timingSafeEqual} from "node:crypto";

export function newTotpSecret(){return randomBytes(20);}
function hotp(secret,counter,digits=6){
  const b=Buffer.alloc(8); b.writeBigUInt64BE(BigInt(counter));
  const h=createHmac("sha1",secret).update(b).digest();
  const o=h[h.length-1]&15;
  const n=(h.readUInt32BE(o)&0x7fffffff)%(10**digits);
  return String(n).padStart(digits,"0");
}
export function totp(secret,{now=Date.now(),stepSeconds=30,digits=6}={}){
  return hotp(secret,Math.floor(now/1000/stepSeconds),digits);
}
export function verifyTotp(secret,code,{now=Date.now(),window=1,stepSeconds=30,digits=6}={}){
  const supplied=Buffer.from(String(code));
  for(let w=-window;w<=window;w++){
    const expected=Buffer.from(hotp(secret,Math.floor(now/1000/stepSeconds)+w,digits));
    if(expected.length===supplied.length&&timingSafeEqual(expected,supplied)) return true;
  }
  return false;
}
