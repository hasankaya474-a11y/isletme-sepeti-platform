export function evaluateLeadWindow({now,requestedAt,minLeadMinutes,maxLeadMinutes=null}){
  const nowMs=new Date(now).getTime(), reqMs=new Date(requestedAt).getTime();
  if(!Number.isFinite(nowMs)||!Number.isFinite(reqMs)) throw new TypeError("INVALID_DELIVERY_DATETIME");
  const lead=Math.floor((reqMs-nowMs)/60000);
  if(lead<minLeadMinutes) return {allowed:false,reason:"BELOW_MIN_LEAD",leadMinutes:lead};
  if(maxLeadMinutes!==null&&lead>maxLeadMinutes) return {allowed:false,reason:"ABOVE_MAX_LEAD",leadMinutes:lead};
  return {allowed:true,reason:null,leadMinutes:lead};
}
