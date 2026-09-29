import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase12Routes(router,{metrics,reports,exports}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/reporting/metrics",admin(async req=>ok(metrics.create({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/reporting/reports",admin(async req=>ok(reports.create({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/reporting/exports",admin(async req=>ok(exports.request({...req.body,requestedBy:req.auth.userId}),{requestId:req.requestId})));
}