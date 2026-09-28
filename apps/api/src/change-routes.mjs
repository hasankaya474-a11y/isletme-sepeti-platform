import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerChangeRoutes(router,{adminIdentity,changes}){
 router.register("POST","/v1/admin/role-changes",protect(async req=>ok(adminIdentity.requestRoleChange({actorId:req.auth.userId,membershipId:req.body.membershipId,payload:req.body.payload}),{requestId:req.requestId}),{permission:"admin.configuration.manage"}));
 router.register("POST","/v1/admin/change-requests/approve",protect(async req=>ok(changes.approve({requestId:req.body.requestId,approverId:req.auth.userId}),{requestId:req.requestId}),{permission:"admin.configuration.manage"}));
 router.register("POST","/v1/admin/change-requests/reject",protect(async req=>ok(changes.reject({requestId:req.body.requestId,approverId:req.auth.userId,reason:req.body.reason}),{requestId:req.requestId}),{permission:"admin.configuration.manage"}));
}