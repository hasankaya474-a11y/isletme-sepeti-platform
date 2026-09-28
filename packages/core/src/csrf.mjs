import {randomBytes,timingSafeEqual} from "node:crypto";
export function issueCsrfToken(){return randomBytes(32).toString("base64url");}
export function verifyCsrfToken(cookieToken,headerToken){if(!cookieToken||!headerToken)return false;const a=Buffer.from(cookieToken),b=Buffer.from(headerToken);return a.length===b.length&&timingSafeEqual(a,b);}
