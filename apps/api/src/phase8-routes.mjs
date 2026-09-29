import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";

export function registerPhase8Routes(router,{orderCreation,orderTransitions,outbox}){
 const create=h=>protect(h,{permission:"order.create_from_requisition"});
 const transition=h=>protect(h,{permission:"order.transition_own"});
 const admin=h=>protect(h,{permission:"admin.order.manage"});

 router.register("POST","/v1/buyer/orders/create-from-requisition",create(async req=>{
   const key=req.headers?.["idempotency-key"];if(!key)throw Object.assign(new Error("IDEMPOTENCY_KEY_REQUIRED"),{code:"IDEMPOTENCY_KEY_REQUIRED"});
   return ok(orderCreation.createFromRequisition({requisitionId:req.body.requisitionId,businessId:req.auth.membership.organizationId,idempotencyKey:key,actorId:req.auth.userId}),{requestId:req.requestId});
 }));
 router.register("POST","/v1/buyer/orders/transition",transition(async req=>ok(orderTransitions.transition({...req.body,organizationType:"BUSINESS",organizationId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/orders/transition",transition(async req=>ok(orderTransitions.transition({...req.body,organizationType:"SUPPLIER",organizationId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/orders/transition",admin(async req=>ok(orderTransitions.transition({...req.body,organizationType:"PLATFORM",organizationId:"platform",actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/outbox/retry",admin(async req=>ok(outbox.retry({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}
