import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase18Routes(router,{releaseReadiness,pilotDefects}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/release/gates",admin(async req=>ok(releaseReadiness.setGate({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/release/decision",admin(async req=>ok(releaseReadiness.decide({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/release/defects",admin(async req=>ok(pilotDefects.create({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/release/defects/transition",admin(async req=>ok(pilotDefects.transition({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}