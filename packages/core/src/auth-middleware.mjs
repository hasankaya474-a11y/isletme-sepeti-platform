import {requirePermission} from "./authorization.mjs";import {assertTenantAccess} from "./tenant-guard.mjs";import {assertMfa} from "./mfa-policy.mjs";
export function authorizeRequest({grants,permission,requiredScope,membership,tenantType,tenantId,session}){
 requirePermission({grants,permission,requiredScope});
 if(tenantType&&tenantId)assertTenantAccess({membership,requiredType:tenantType,requiredId:tenantId});
 assertMfa({permission,session});
 return true;
}
