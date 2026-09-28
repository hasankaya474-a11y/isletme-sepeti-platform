import { newId } from "./id.mjs";

export function createCompany({legalName,tradeName=null,now=new Date().toISOString()}) {
  if (!legalName?.trim()) throw new TypeError("LEGAL_NAME_REQUIRED");
  return {id:newId("co"),legalName:legalName.trim(),tradeName:tradeName?.trim()||null,status:"DRAFT",createdAt:now,updatedAt:now};
}

export function createBusiness({companyId,businessType=null,now=new Date().toISOString()}) {
  if (!companyId) throw new TypeError("COMPANY_REQUIRED");
  return {id:newId("biz"),companyId,businessType,status:"DRAFT",createdAt:now,updatedAt:now};
}

export function createSupplier({companyId,supplierType=null,now=new Date().toISOString()}) {
  if (!companyId) throw new TypeError("COMPANY_REQUIRED");
  return {id:newId("sup"),companyId,supplierType,verificationStatus:"UNVERIFIED",status:"DRAFT",createdAt:now,updatedAt:now};
}

export function createMembership({userId,organizationType,organizationId,now=new Date().toISOString()}) {
  if (!["BUSINESS","SUPPLIER","PLATFORM"].includes(organizationType)) throw new TypeError("ORG_TYPE_INVALID");
  if (!userId || !organizationId) throw new TypeError("MEMBERSHIP_FIELDS_REQUIRED");
  return {id:newId("mem"),userId,organizationType,organizationId,status:"INVITED",createdAt:now,updatedAt:now};
}
