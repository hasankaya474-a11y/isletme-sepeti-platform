import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase15Routes(router,{integrations,webhooks,bulkJobs}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/integrations",admin(async req=>ok(integrations.createConnection({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/integrations/transition",admin(async req=>ok(integrations.transition({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/integrations/webhooks",admin(async req=>ok(webhooks.subscribe({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/integrations/webhooks/enqueue",admin(async req=>ok(webhooks.enqueue({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/integrations/bulk-jobs",admin(async req=>ok(bulkJobs.create({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}