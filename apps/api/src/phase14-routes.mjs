import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase14Routes(router,{campaigns,radar}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/campaigns",admin(async req=>ok(campaigns.create({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/campaigns/transition",admin(async req=>ok(campaigns.transition({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/campaigns/placements",admin(async req=>ok(campaigns.addPlacement({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/radar/observations",admin(async req=>ok(radar.record({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}