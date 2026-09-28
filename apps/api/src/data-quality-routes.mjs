import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerDataQualityRoutes(router,{qualityCenter,duplicateReview}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/catalog/quality/scan",admin(async req=>ok(qualityCenter.scanProduct(req.body.productId),{requestId:req.requestId})));
 router.register("POST","/v1/admin/catalog/quality/resolve",admin(async req=>ok(qualityCenter.resolve({id:req.body.id,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/catalog/duplicates/review",admin(async req=>ok(duplicateReview.review({id:req.body.id,decision:req.body.decision,actorId:req.auth.userId}),{requestId:req.requestId})));
}