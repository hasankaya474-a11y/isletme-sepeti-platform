export const USER_STATUS = Object.freeze(["PENDING","ACTIVE","SUSPENDED","DISABLED"]);
export const MEMBERSHIP_STATUS = Object.freeze(["INVITED","ACTIVE","SUSPENDED","REVOKED"]);
export const COMPANY_STATUS = Object.freeze(["DRAFT","PENDING_REVIEW","ACTIVE","SUSPENDED","ARCHIVED"]);
export const SUPPLIER_STATUS = Object.freeze(["DRAFT","PENDING_REVIEW","ACTIVE","PAUSED","SUSPENDED","ARCHIVED"]);

export function publicUser(user) {
  return {id:user.id,email:user.email,status:user.status,emailVerifiedAt:user.emailVerifiedAt};
}
