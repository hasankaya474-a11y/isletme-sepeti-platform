import {authorizeRequest} from "./auth-middleware.mjs";import {verifyCsrfToken} from "./csrf.mjs";
export function protect(handler,{permission,tenantFromRequest=null,csrf=true}={}){
 return async req=>{
  if(!req.auth?.session)throw Object.assign(new Error("UNAUTHENTICATED"),{code:"UNAUTHENTICATED"});
  if(csrf&&["POST","PUT","PATCH","DELETE"].includes(req.method?.toUpperCase())&&!verifyCsrfToken(req.cookies?.csrf,req.headers?.["x-csrf-token"]))throw Object.assign(new Error("CSRF_INVALID"),{code:"CSRF_INVALID"});
  const tenant=tenantFromRequest?tenantFromRequest(req):null;
  authorizeRequest({grants:req.auth.grants,permission,requiredScope:req.auth.requiredScope,membership:req.auth.membership,tenantType:tenant?.type,tenantId:tenant?.id,session:req.auth.session});
  return handler(req);
 };
}
