import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase16Routes(router,{retention,restoreVerification,loadBudget}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/security/retention",admin(async req=>ok(retention.create({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/security/retention/transition",admin(async req=>ok(retention.transition({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/security/restore-verifications",admin(async req=>ok(restoreVerification.record({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/security/load-results",admin(async req=>ok(loadBudget.evaluate({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}