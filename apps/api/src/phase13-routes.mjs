import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase13Routes(router,{supportCases,disputes}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/support/cases",admin(async req=>ok(supportCases.create({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/support/cases/transition",admin(async req=>ok(supportCases.transition({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/support/cases/assign",admin(async req=>ok(supportCases.assign({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/support/cases/events",admin(async req=>ok(supportCases.addEvent({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/support/disputes",admin(async req=>ok(disputes.open({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}