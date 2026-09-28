export function membershipRow(m){
  return {id:m.id,userId:m.userId,organization:m.organizationType+":"+m.organizationId,status:m.status};
}
export function sessionRow(s,now=Date.now()){
  return {id:s.id,userId:s.userId,mfaLevel:s.mfaLevel,active:!s.revokedAt&&Date.parse(s.expiresAt)>now,expiresAt:s.expiresAt};
}
export function securityEventRow(e){
  return {id:e.id,time:e.occurredAt,type:e.eventType,severity:e.severity,outcome:e.outcome,userId:e.userId};
}
