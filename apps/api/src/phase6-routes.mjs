import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";

export function registerPhase6Routes(router,{rfqs,quotes,comparison,messages,rfqAdmin}){
 const buyer=h=>protect(h,{permission:"rfq.create"});
 const supplier=h=>protect(h,{permission:"rfq.respond_own"});
 const admin=h=>protect(h,{permission:"admin.rfq.manage"});

 router.register("POST","/v1/buyer/rfqs",buyer(async req=>ok(rfqs.create({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/rfqs/lines",buyer(async req=>ok(rfqs.addLine({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/rfqs/invitations",buyer(async req=>ok(rfqs.inviteSupplier({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/rfqs/open",buyer(async req=>ok(rfqs.open({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/rfqs/compare",buyer(async req=>ok(comparison.compare({rfqId:req.body.rfqId,businessId:req.auth.membership.organizationId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/rfqs/messages",buyer(async req=>ok(messages.post({...req.body,organizationType:"BUSINESS",organizationId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/supplier/quotes",supplier(async req=>ok(quotes.createDraft({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/quotes/lines",supplier(async req=>ok(quotes.addLine({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/quotes/submit",supplier(async req=>ok(quotes.submit({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/rfqs/messages",supplier(async req=>ok(messages.post({...req.body,organizationType:"SUPPLIER",organizationId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/rfqs/transition",admin(async req=>ok(rfqAdmin.transition({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}
