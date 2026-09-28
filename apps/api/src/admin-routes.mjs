import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerAdminRoutes(router,{membershipService,adminService}){
 router.register("GET","/v1/admin/memberships",protect(async req=>ok(membershipService.store.find("memberships",()=>true),{requestId:req.requestId}),{permission:"admin.audit.read",csrf:false}));
 router.register("POST","/v1/admin/memberships/invite",protect(async req=>ok(membershipService.invite({...req.body,actorId:req.auth.userId}),{requestId:req.requestId}),{permission:"admin.configuration.manage"}));
 router.register("POST","/v1/admin/sessions/revoke-all",protect(async req=>ok({revoked:adminService.revokeAllSessions({...req.body,actorId:req.auth.userId,session:req.auth.session})},{requestId:req.requestId}),{permission:"admin.configuration.manage"}));
}
