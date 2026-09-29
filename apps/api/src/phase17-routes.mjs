import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase17Routes(router,{pilots,traceability,locationPilot}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/pilots/enroll",admin(async req=>ok(pilots.enroll({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/pilots/withdraw",admin(async req=>ok(pilots.withdraw({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/traceability/events",admin(async req=>ok(traceability.append({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/pilots/location-samples",admin(async req=>ok(locationPilot.record({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}