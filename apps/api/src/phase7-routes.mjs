import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";

export function registerPhase7Routes(router,{carts,requisitions,approvals,policies,poReadiness,procurementAdmin}){
 const cart=h=>protect(h,{permission:"cart.manage"});
 const approve=h=>protect(h,{permission:"procurement.approve"});
 const policy=h=>protect(h,{permission:"procurement.policy.manage"});
 const admin=h=>protect(h,{permission:"admin.procurement.manage"});

 router.register("POST","/v1/buyer/carts",cart(async req=>ok(carts.create({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/carts/offer-lines",cart(async req=>ok(carts.addOfferLine({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/carts/quote-lines",cart(async req=>ok(carts.addQuoteLine({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/requisitions/submit",cart(async req=>ok(requisitions.submit({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/requisitions/po-ready",cart(async req=>{const check=poReadiness.evaluate({requisitionId:req.body.requisitionId,businessId:req.auth.membership.organizationId});if(!check.ready)throw Object.assign(new Error("PO_NOT_READY"),{code:"PO_NOT_READY"});return ok(requisitions.markPoReady({requisitionId:req.body.requisitionId,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId});}));

 router.register("POST","/v1/buyer/procurement/approvals/decide",approve(async req=>ok(approvals.decide({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/procurement/policies",policy(async req=>ok(policies.create({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/procurement/policies/activate",policy(async req=>ok(policies.activate({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/procurement/requisitions/cancel",admin(async req=>ok(procurementAdmin.cancel({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}
