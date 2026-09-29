import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";

export function registerPhase9Routes(router,{capacity,deliveryOps,eta,receiving,rmas,deliveryAdmin}){
 const supplier=h=>protect(h,{permission:"delivery.manage_own"});
 const receive=h=>protect(h,{permission:"receiving.manage_own"});
 const returns=h=>protect(h,{permission:"return.request"});
 const read=h=>protect(h,{permission:"order.read_own"});
 const admin=h=>protect(h,{permission:"admin.delivery.manage"});

 router.register("POST","/v1/supplier/delivery/capacity-slots",supplier(async req=>ok(capacity.createSlot({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/deliveries",supplier(async req=>ok(deliveryOps.create({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/deliveries/dispatch",supplier(async req=>ok(deliveryOps.dispatch({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/deliveries/eta",supplier(async req=>ok(deliveryOps.setEta({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/rmas/decide",supplier(async req=>ok(rmas.decide({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/buyer/deliveries/eta",read(async req=>ok(eta.get({deliveryId:req.body.deliveryId,businessId:req.auth.membership.organizationId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/receivings",receive(async req=>ok(receiving.start({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/receivings/lines",receive(async req=>ok(receiving.recordLine({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/receivings/complete",receive(async req=>ok(receiving.complete({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/rmas",returns(async req=>ok(rmas.request({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/deliveries/cancel",admin(async req=>ok(deliveryAdmin.cancel({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}
