export const SESSION_COOKIE_POLICY=Object.freeze({httpOnly:true,secure:true,sameSite:"Lax",path:"/",maxAgeSeconds:8*60*60});
export function sessionCookie(name,value){return {name,value,...SESSION_COOKIE_POLICY};}
