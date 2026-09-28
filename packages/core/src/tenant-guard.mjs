export function tenantScope(type,id){if(!type||!id)throw new TypeError("TENANT_SCOPE_REQUIRED");return type+":"+id;}
export function assertTenantAccess({membership,requiredType,requiredId}){
  if(!membership||membership.status!=="ACTIVE")throw new Error("TENANT_ACCESS_DENIED");
  if(membership.organizationType==="PLATFORM")return true;
  if(membership.organizationType!==requiredType||membership.organizationId!==requiredId)throw new Error("TENANT_ACCESS_DENIED");
  return true;
}
