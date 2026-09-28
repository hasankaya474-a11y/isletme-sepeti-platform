export const MEMBERSHIP_TRANSITIONS = Object.freeze({
  INVITED:["ACTIVE","REVOKED"],
  ACTIVE:["SUSPENDED","REVOKED"],
  SUSPENDED:["ACTIVE","REVOKED"],
  REVOKED:[]
});

export function transitionMembership(membership,to,now=new Date().toISOString()) {
  if (!MEMBERSHIP_TRANSITIONS[membership?.status]?.includes(to)) throw new Error("INVALID_MEMBERSHIP_TRANSITION");
  return {...membership,status:to,updatedAt:now};
}
