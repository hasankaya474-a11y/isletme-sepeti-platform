import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";

export function registerPhase5Routes(router,{search,productCards,buyerLists,matching,searchAdmin}){
 const buyer=(permission,h)=>protect(h,{permission});
 const admin=h=>protect(h,{permission:"admin.search.manage"});

 router.register("POST","/v1/buyer/search",buyer("buyer.catalog.search",async req=>{
   const results=search.search({query:req.body.query,limit:req.body.limit});
   return ok(results.map(x=>productCards.build(x.product.id)),{requestId:req.requestId});
 }));

 router.register("POST","/v1/buyer/lists",buyer("buyer.list.manage",async req=>ok(buyerLists.create({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/lists/items",buyer("buyer.list.manage",async req=>ok(buyerLists.addItem({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/buyer/matching/text",buyer("buyer.list.manage",async req=>ok(matching.createTextRequest({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/matching/photo",buyer("buyer.list.manage",async req=>ok(matching.createPhotoRequest({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/matching/review",buyer("buyer.list.manage",async req=>ok(matching.reviewCandidate({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/search/synonyms",admin(async req=>ok(searchAdmin.createSynonym({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/search/synonyms/transition",admin(async req=>ok(searchAdmin.transition({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}
